export interface Position {
  x: number;
  y: number;
  z: number;
}

export function parseCoordinates(position: string): Position {
  // example input: "23.3242,102.2234,0.4200"
  const coordinates = position.split(",");
  return {
    x: parseFloat(coordinates[0]),
    y: parseFloat(coordinates[1]),
    z: parseFloat(coordinates[2])
  };
}
