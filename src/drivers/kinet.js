/* //////////// */
/* KiNET Driver */
/* //////////// */

const kinetMixin = {
    computed: {
        enableKinet() {
            return this.$store.state.enableKinet;
        },
        kinetStrands() {
            return this.$store.state.kinetStrands;
        }
    },
    methods: {

        /**
         * Takes the RAW data, adds the appropriate header, and sends it out over KiNET
         * @param data
         */
        outputOverKinet: function (data) {

            this.kinetStrands.forEach((strand, index) => {
                let strandStart = 0;
                if (index > 0) {
                    let allStrands = [...this.kinetStrands];
                    let priorStrands = allStrands.splice(0, index);
                    strandStart = priorStrands.reduce((accumulator, previousStrand) => {
                        accumulator += previousStrand.numLights;
                        return accumulator;
                    });
                }
                let strandData = data.slice((strandStart * 3), ((strandStart * 3) + (strand.num_lights * 3)));
                window.dgram.send(Buffer.from([
                    0x04,
                    0x01,
                    0xdc,
                    0x4a,
                    0x02,
                    0x00,
                    0x08,
                    0x01,
                    0x00,
                    0x00,
                    0x00,
                    0x00,
                    0xff,
                    0xff,
                    0xff,
                    0xff,
                    strand.port.toString(16),
                    0x00,
                    0x01,
                    0x00,
                    (strandData.length & 0x00ff),
                    (strandData.length >> 8),
                    0x00,
                    0x00
                ].concat(data)), strand.port, strand.ip);
            });

        }

    }
}

module.exports = kinetMixin;
