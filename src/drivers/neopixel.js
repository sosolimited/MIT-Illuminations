// A driver to connect Illuminations to Neopixels running on Arduino

// eslint-disable-next-line no-unused-vars
const serialport = require('serialport');

// eslint-disable-next-line no-undef
const port = new serialport('COM3', {
    baudRate: 115200,
    parity: 'none',
    stopBits: 1,
    dataBits: 8
});

function sendToDevice(buffer){

    let outputData = [];

    for (let i = 0; i < (window.helpers.lights.count * 3); i+= 3) {
        outputData.push(buffer[i],buffer[i+1],buffer[i+2]);
    }

    port.write(Buffer.from(outputData));
}


module.exports = {
    sendToDevice: sendToDevice
}
