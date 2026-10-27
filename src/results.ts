// Shared vocabulary types: the data shape of every message result, the result
// wrappers themselves, and the union of all payloads an EventDispatcher
// listener can receive. Types only — compiles to an empty runtime module.

import { CodeInfo, CoordinatesPayload } from "./data/gcode_map.js";
import { Position } from "./utils/extractor_utils.js";

export { CodeInfo, CoordinatesPayload, Position };

// ---------------------------------------------------------------- status report

export interface StatusResult {
  type: "status";
  data: StatusReport;
  input: string;
}

export interface StatusReport {
  status: MachineState;
  accessories?: string | Accessories;
  buffer?: string | BufferReport;
  realtimeFeed?: string | Feeds;
  machinePosition?: string | Position;
  override?: string | Override;
  pins?: string | PinEntry[];
  workcoordinateOffset?: string | Position;
  workPosition?: string | Position;
}

export interface MachineState {
  state: string;
  code?: number;
  message?: string;
}

export interface Accessories {
  flood: boolean;
  mist: boolean;
  spindleDirection: string;
}

export interface BufferReport {
  availableBlocks: number;
  availableRXBytes: number;
}

export interface Feeds {
  realtimeFeedrate: number;
  realtimeSpindle: number;
}

export interface Override {
  feeds: number;
  rapids: number;
  spindle: number;
}

export interface PinEntry {
  pin: string;
  on: boolean;
}

// ------------------------------------------------------------------- extractors

export interface SuccessResult {
  type: "success";
  data: SuccessData;
  input: string;
}
export interface SuccessData {
  success: boolean;
}

export interface InitializeResult {
  type: "initialize";
  data: InitializeData;
  input: string;
}
export interface InitializeData {
  firmwareVersion: string;
}

export interface AlarmResult {
  type: "alarm";
  data: ErrorOrAlarmData;
  input: string;
}
export interface ErrorResult {
  type: "error";
  data: ErrorOrAlarmData;
  input: string;
}
export interface ErrorOrAlarmData {
  code?: number;
  message?: string;
}

export interface SettingResult {
  type: "setting";
  data: SettingData;
  input: string;
}
export interface SettingData {
  code: number;
  value: number;
  setting: string;
  units: string;
  description: string;
}

export interface FeedbackResult {
  type: "feedbackMessage";
  data: MessageOnlyData;
  input: string;
}
export interface EchoResult {
  type: "echoMessage";
  data: MessageOnlyData;
  input: string;
}
export interface MessageOnlyData {
  message: string;
}

export interface BuildVersionResult {
  type: "buildVersion";
  data: BuildVersionData;
  input: string;
}
export interface BuildVersionData {
  firmwareVersion: string;
  buildDate: string;
  buildString?: string;
}

export interface BuildOptionsResult {
  type: "buildOptions";
  data: BuildOptionsData;
  input: string;
}
export interface BuildOptionsData {
  options: BuildOptionEntry[];
  extras: string[];
}
export interface BuildOptionEntry {
  code: string;
  message: string;
}

export interface GcodeStateResult {
  type: "gcodeState";
  data: GcodeStateData;
  input: string;
}
export interface GcodeStateData {
  codes: CodeStateEntry[];
}
export interface CodeStateEntry {
  code: string;
  name: string;
  description: string;
  value?: number;
  coordinates?: CoordinatesPayload;
}

export interface HelpResult {
  type: "helpMessage";
  data: HelpData;
  input: string;
}
export interface HelpData {
  availableCommands: string[];
}

export interface GcodeSystemResult {
  type: "gcodeSystem";
  data: CodeInfo;
  input: string;
}

export interface ProbeResult {
  type: "probeResult";
  data: ProbeData;
  input: string;
}
export interface ProbeData {
  location: Position;
  success: boolean;
}

export interface StartupResult {
  type: "gcodeStartup";
  data: StartupData;
  input: string;
}
export interface StartupData {
  line: string;
  success: boolean;
}

// ------------------------------------------------- the full dispatched payload

export interface UnknownResult {
  type: "unknown";
  input: string;
}

export type MessagePayload =
  StatusResult |
  SuccessResult |
  InitializeResult |
  AlarmResult |
  ErrorResult |
  SettingResult |
  FeedbackResult |
  BuildVersionResult |
  BuildOptionsResult |
  GcodeStateResult |
  HelpResult |
  GcodeSystemResult |
  ProbeResult |
  EchoResult |
  StartupResult |
  UnknownResult;
