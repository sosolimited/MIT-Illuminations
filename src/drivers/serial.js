/* ////////////////////// */
/* Arduino / Serial Mixin */
/* ////////////////////// */

const {SerialPort} = require("serialport");

const serialMixin = {
    data() {
        return {
            connectedToSerial: false,
            port: false
        }
    },
    computed: {
        enableSerial() {
            return this.$store.state.enableSerial;
        },
        selectedSerialPort() {
            return this.$store.state.selectedSerialPort;
        },
        selectedColorMode() {
            return this.$store.state.selectedColorMode;
        }
    },
    methods: {

        /**
         * Handles the initial connection to a serial port, and reconnection if lost/closed or the selected port changes
         */
        connectToPort: function () {

            SerialPort.list().then(ports => {
                if (ports.includes(this.selectedSerialPort) === false) {
                    this.selectedSerialPort = null;
                }
            });

            if (this.selectedSerialPort) {
                if (this.selectedSerialPort.length && this.connectedToSerial === false) {

                    this.port = new SerialPort({
                        path: this.selectedSerialPort,
                        baudRate: 115200,
                        parity: 'none',
                        stopBits: 1,
                        dataBits: 8,
                        autoOpen: true
                    });

                    this.port.on('open', () => {
                        this.connectedToSerial = true;
                    });

                    this.port.on('close', () => {
                        this.connectedToSerial = false;
                    });

                    this.port.on('error', () => {
                        this.connectedToSerial = false;
                        this.selectedSerialPort = null;
                    });

                    this.port.open();
                }
            }

        },

        /**
         * Takes the RAW RGB data, cleans it up, and sends it out over serial connection to the Arduino.
         * @param data
         */
        outputOverSerial: function (data) {
            let outputData = [];
            if (this.selectedColorMode === 'RGB') {
                for (let i = 0; i < (window.helpers.lights.count * 3); i += 3) {
                    outputData.push(data[i], data[i + 1], data[i + 2]);
                }
            } else {
                for (let i = 0; i < (window.helpers.lights.count * 4); i += 4) {
                    outputData.push(data[i], data[i + 1], data[i + 2], data[i + 3]);
                }
            }
            if (this.connectedToSerial) {
                this.port.write(Buffer.from(outputData));
            }
        }

    },
    mounted() {
        this.connectToPort();
    },
    watch: {
        selectedSerialPort: {
            handler() {
                this.connectToPort();
            }
        }
    }
}

module.exports = serialMixin;
