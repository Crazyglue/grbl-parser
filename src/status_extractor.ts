import { messageTypes, statusMap, subStateMessage } from "./constants.js";
import { StatusField } from "./constants.js";
import { parseCoordinates } from "./utils/extractor_utils.js";
import {
  Accessories,
  BufferReport,
  Feeds,
  MachineState,
  Override,
  PinEntry,
  StatusReport,
  StatusResult
} from "./results.js";

export class StatusExtractor {
  statusReport(message: string): StatusResult {
    const angleMatch = message.match(/^<(.*)>$/);
    if (!angleMatch)
      throw new Error("Not a status report: " + message);
    // <Hold:0|MPos:0.000,0.000,0.000|Bf:15,128|FS:675.5,24000|Ov:120,100,100|WCO:0.000,-5.200,306.351|A:SFM>
    // <Idle,MPos:0.000,0.000,0.000,WPos:0.000,0.000,0.000>
    const match = angleMatch[1];
    // Hold:0|MPos:0.000,0.000,0.000|Bf:15,128|FS:0,0|WCO:0.000,0.000,306.351
    // Idle,MPos:0.000,0.000,0.000,WPos:0.000,0.000,0.000

    let report: StatusReport;

    // Assigns a raw param value to its field. The old code wrote report[statusMap[key]]
    // dynamically; fields are now declared, so the field is picked with a switch.
    const applyParam = (field: StatusField, value: string): void => {
      if (field === "accessories")
        report.accessories = value;
      else if (field === "buffer")
        report.buffer = value;
      else if (field === "realtimeFeed")
        report.realtimeFeed = value;
      else if (field === "machinePosition")
        report.machinePosition = value;
      else if (field === "override")
        report.override = value;
      else if (field === "pins")
        report.pins = value;
      else if (field === "workcoordinateOffset")
        report.workcoordinateOffset = value;
      else if (field === "workPosition")
        report.workPosition = value;
    };

    if (message.includes(",MPos:") || message.includes(",WPos:")) {
      const statusData = match.match(/(\w+)\,(.+)/);
      if (!statusData)
        throw new Error("Malformed status report: " + message);
      report = { status: this.parseStatus(statusData[1]) }; // Idle
      const statusParams = statusData[2].match(/([a-zA-Z]+)\:([\d\,\.\-\|]+)\,?/g); // [ "MPos:0.000,0.000,0.000,", "WPos:0.000,0.000,0.000,", "Buf:0,", "RX:0,", "Lim:000" ]

      const buffer: string[] = [];

      if (statusParams) {
        statusParams.forEach((param) => {
          const paramData = param.split(":"); // [ "MPos", "0.000,0.000,0.000," ]
          const key = paramData[0];
          const value = paramData[1];

          if (key === "Buf")
            buffer[0] = value.replace(",", "");
          else if (key === "RX")
            buffer[1] = value.replace(",", "");
          else
            applyParam(statusMap[key], value);
        });
      }

      if (buffer.length > 0) {
        report.buffer = buffer.join(",");
      }
    } else {
      const params = match.split("|");
      // ["Hold:0", "MPos:0.000,0.000,0.000", "Bf:15,128", ...]

      report = { status: this.parseStatus(params[0]) }; // "Hold:0"

      const paramsPairs = params.slice(1, params.length);

      paramsPairs.forEach((param) => {
        const paramData = param.split(":");
        applyParam(statusMap[paramData[0]], paramData[1]);
      });
    }

    if (typeof report.machinePosition === "string") {
      report.machinePosition = parseCoordinates(report.machinePosition);
    }

    if (typeof report.workPosition === "string") {
      report.workPosition = parseCoordinates(report.workPosition);
    }

    if (typeof report.workcoordinateOffset === "string") {
      report.workcoordinateOffset = parseCoordinates(report.workcoordinateOffset);
    }

    if (typeof report.accessories === "string") {
      report.accessories = this.parseAccessories(report.accessories);
    }

    if (typeof report.buffer === "string") {
      report.buffer = this.parseBuffer(report.buffer);
    }

    if (typeof report.realtimeFeed === "string") {
      report.realtimeFeed = this.parseFeeds(report.realtimeFeed);
    }

    if (typeof report.override === "string") {
      report.override = this.parseOverride(report.override);
    }

    if (typeof report.pins === "string") {
      report.pins = this.parsePins(report.pins);
    }

    return {
      data: report,
      type: messageTypes.status,
      input: message
    };
  }

  parsePins(pins: string): PinEntry[] {
    const data: PinEntry[] = [];
    const limitPinMap: { [index: number]: string } = {
      0: "limit-x",
      1: "limit-y",
      2: "limit-z"
    };
    const controlPinMap: { [index: number]: string } = {
      0: "door",
      1: "hold",
      2: "soft-reset",
      3: "cycle-start",
    };

    if (/([01]+)\,?([01])?\,?([01]+)?/.test(pins)) {
      // 000,1,0000
      const pinMatch = pins.match(/(\d{3})?(\|\d\|)?(\d+)?/);
      const xyzPins = pinMatch ? pinMatch[1] : undefined;
      const probePin = pinMatch ? pinMatch[2] : undefined;
      const controlPins = pinMatch ? pinMatch[3] : undefined;

      if (xyzPins) {
        const limitPins = xyzPins.split("");
        limitPins.forEach((value, index) => {
          const pin: PinEntry = { pin: limitPinMap[index], on: value === "1" };
          data.push(pin);
        });
      }

      if (probePin) {
        data.push({ pin: "probe", on: probePin.replace(/\|/g, "") === "1" });
      }

      if (controlPins) {
        controlPins.split("").forEach((pin, index) => {
          data.push({ pin: controlPinMap[index], on: pin === "1" });
        });
      }
    } else {
      const grbl11pinMap: { [char: string]: string } = {
        "X": "limit-x",
        "Y": "limit-y",
        "Z": "limit-z",
        "P": "probe",
        "D": "door",
        "H": "hold",
        "R": "soft-reset",
        "S": "cycle-start",
      };
      const pinData = pins.split("");

      pinData.forEach((pinChar) => {
        const pin: PinEntry = { pin: grbl11pinMap[pinChar], on: true };
        data.push(pin);
      });
    }
    return data;
  }

  parseStatus(status: string): MachineState {
    // Hold:0
    const match = status.split(":");

    const parsedStatus: MachineState = {
      state: match[0]
    };

    if (match[1]) {
      parsedStatus.code = parseFloat(match[1]);
      parsedStatus.message = subStateMessage[match[0]][match[1]];
    }

    return parsedStatus;
  }

  parseAccessories(accessories: string): Accessories {
    // SFM
    const flags = accessories.split("");

    return {
      flood: flags.indexOf("F") > -1,
      mist: flags.indexOf("M") > -1,
      spindleDirection: flags.indexOf("S") > -1 ? "clockwise" : "counter-clockwise"
    };
  }

  parseBuffer(buffer: string): BufferReport {
    // example input: "15,128"
    const bufferData = buffer.split(",");
    return {
      availableBlocks: parseFloat(bufferData[0]),
      availableRXBytes: parseFloat(bufferData[1])
    };
  }

  parseFeeds(feeds: string): Feeds {
    // example input: "15.432,12000.5"
    const feedData = feeds.split(",");

    return {
      realtimeFeedrate: parseFloat(feedData[0]),
      realtimeSpindle: parseFloat(feedData[1])
    };
  }

  parseOverride(override: string): Override {
    // 120,100,100
    const overrideData = override.split(",");

    return {
      feeds: parseFloat(overrideData[0]),
      rapids: parseFloat(overrideData[1]),
      spindle: parseFloat(overrideData[2])
    };
  }
}
