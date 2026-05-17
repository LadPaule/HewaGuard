import { Device, SensorReading } from "./types";


export function mergeDevicesIntoReadings(
  readings: SensorReading[],
  devices: Device[]
): (SensorReading & { device?: Device })[] {
  const deviceMap = new Map<number, Device>();
  devices.forEach((d) => deviceMap.set(d.id, d));

  return readings.map((r) => ({
    ...r,
    device: deviceMap.get(r.device_id),
  }));
}