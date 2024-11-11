// devicesConfig.js
export const devicesConfig = [
  {
    name: 'DotEkoDevice',
    deviceID: 1,
    port: 'COM6',
    readDataFunction: 'readDataDotEko',
    serviceModule: './services/dotEkoModbusService.js',
  },
];
