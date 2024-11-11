// services/dotEkoModbusService.js
export const readDataDotEko = async (modbusClient, deviceID, deviceLabel, collection) => {
  try {
    // Объект для сохранения данных
    const data = {};

    // Чтение данных из 16-битных регистров
    const rightSkiData = await modbusClient.readHoldingRegisters(deviceID, 0x0002, 1);
    const leftSkiData = await modbusClient.readHoldingRegisters(deviceID, 0x0004, 1);
    const defectData = await modbusClient.readHoldingRegisters(deviceID, 0x0000, 1);
    const defectReportData = await modbusClient.readHoldingRegisters(deviceID, 0x0006, 1);
    const rightSkiReportData = await modbusClient.readHoldingRegisters(deviceID, 0x0008, 1);
    const leftSkiReportData = await modbusClient.readHoldingRegisters(deviceID, 0x000A, 1);

    const shiftTimeData = await modbusClient.readHoldingRegisters(deviceID, 0x000E, 2);
    const workTimeData = await modbusClient.readHoldingRegisters(deviceID, 0x0012, 2);
    const lineStatusData = await modbusClient.readHoldingRegisters(deviceID, 0x004A, 2);

    // Извлечение значений из прочитанных данных
    data.rightSki = rightSkiData.data[0];
    data.leftSki = leftSkiData.data[0];
    data.defect = defectData.data[0];
    data.defectReport = defectReportData.data[0];
    data.rightSkiReport = rightSkiReportData.data[0];
    data.leftSkiReport = leftSkiReportData.data[0];

    // Объединяем два 16-битных регистра в одно значение float для shiftTime
    const shiftTimeBuffer = Buffer.alloc(4);
    shiftTimeBuffer.writeUInt16LE(shiftTimeData.data[0], 0);
    shiftTimeBuffer.writeUInt16LE(shiftTimeData.data[1], 2);
    data.shiftTime = parseFloat(shiftTimeBuffer.readFloatLE(0).toFixed(2));

    // Объединяем два 16-битных регистра в одно значение float для workTime
    const workTimeBuffer = Buffer.alloc(4);
    workTimeBuffer.writeUInt16LE(workTimeData.data[0], 0);
    workTimeBuffer.writeUInt16LE(workTimeData.data[1], 2);
    data.workTime = parseFloat(workTimeBuffer.readFloatLE(0).toFixed(2));

    // Объединяем два 16-битных регистра в одно значение float для lineStatusValue
    const lineStatusBuffer = Buffer.alloc(4);
    lineStatusBuffer.writeUInt16LE(lineStatusData.data[0], 0);
    lineStatusBuffer.writeUInt16LE(lineStatusData.data[1], 2);
    data.lineStatusValue = parseFloat(lineStatusBuffer.readFloatLE(0).toFixed(2));

    // Добавляем totalSki и totalSkiReport как сумму значений
    data.totalSki = data.rightSki + data.leftSki;
    data.totalSkiReport = data.rightSkiReport + data.leftSkiReport;

    // data.timestamp = new Date();
    data.lastUpdated = new Date();

    // Вывод данных в консоль
    // console.log(`[${deviceLabel}] Полученные данные:`, data);

    // Сохранение данных в MongoDB
    await collection.insertOne(data);
    // console.log(`[${deviceLabel}] Данные успешно сохранены в базе данных.`);
  } catch (error) {
    console.error(`[${deviceLabel}] Ошибка при чтении данных:`, error);
  }
};
