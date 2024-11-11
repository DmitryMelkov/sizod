// services/ModbusClient.js
import ModbusRTU from 'modbus-serial';
import { Mutex } from 'async-mutex';

export class ModbusClient {
  constructor(port, baudRate = 57600, timeout = 12000, retryInterval = 15000, maxRetries = 3) {
    this.port = port;
    this.baudRate = baudRate;
    this.timeout = timeout;
    this.retryInterval = retryInterval;
    this.maxRetries = maxRetries;
    this.isConnected = false;
    this.client = new ModbusRTU();
    this.mutex = new Mutex();
  }

  async connect() {
    return await this.mutex.runExclusive(async () => {
      if (this.isConnected) return;
      try {
        this.client.setTimeout(this.timeout);
        await this.client.connectRTUBuffered(this.port, { baudRate: this.baudRate });
        console.log(`Connected to port ${this.port}`);
        this.isConnected = true;
      } catch (err) {
        this.isConnected = false;
        console.error(`Failed to connect on port ${this.port}:`, err);
      }
    });
  }

  async readHoldingRegisters(deviceID, address, length) {
    return await this.mutex.runExclusive(async () => {
      this.client.setID(deviceID);
      if (!this.client.isOpen || !this.isConnected) await this.connect();
      return await this.client.readHoldingRegisters(address, length);
    });
  }

  async readFloat(deviceID, address) {
    return await this.mutex.runExclusive(async () => {
      this.client.setID(deviceID);
      if (!this.client.isOpen || !this.isConnected) await this.connect();
      const data = await this.client.readHoldingRegisters(address, 2);
      const buffer = Buffer.alloc(4);
      buffer.writeUInt16BE(data.data[0], 2);
      buffer.writeUInt16BE(data.data[1], 0);
      return buffer.readFloatBE(0);
    });
  }
}
