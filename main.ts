
//% color="#AA278D" weight=100
namespace AM2320_Sensor {

    let hmid: number = 999; //default error value
    let temp: number = 999; //default error value

    //% block
    //% addr.defl=92
    export function readSensorAtAddress(addr: number) {

        hmid = 999; //default error value
        temp = 999; //default error value

        pins.i2cWriteNumber(addr, 0, NumberFormat.Int8LE, false);
        pause(10);

        let buf = control.createBuffer(3);
        buf[0] = 0x03; //read data
        buf[1] = 0x00; //from this reg. addr
        buf[2] = 0x04; //4 bytes (both temp and hum.)

        pins.i2cWriteBuffer(addr, buf);
        pause(10);

        let result = pins.i2cReadBuffer(addr, 8);

        if (result[0] == 0x03 && result[1] == 0x04) {
            hmid = (result[2] << 8) | result[3];
            temp = (result[4] << 8) | result[5];
            // check for negative temperature
            if (temp & 0x8000) {
                temp = 0 - (~temp & 0xffff) - 1;
            }

            hmid = hmid * 0.1;
            temp = temp * 0.1;

        }
    }

    //% block
    export function getTemperature(): number {
        return temp;
    }

    //% block
    export function getHumidity(): number {
        return hmid;
    }
}