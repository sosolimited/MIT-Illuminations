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

            let strandOffset = 0;
            this.kinetStrands.forEach((strand) => {
                let strandStart = 0;
                strandStart += strandOffset;
                strandOffset += parseInt(strand.numLights);
                let strandData = data.slice((strandStart * 3), ((strandStart * 3) + (parseInt(strand.numLights) * 3)));
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
                    parseInt(strand.port),
                    0x00,
                    0x01,
                    0x00,
                    strandData.length & 0x00ff,
                    strandData.length >> 8,
                    0x00,
                    0x00
                ].concat(strandData)), 6038, strand.ip);
            });

        }

    }
}

module.exports = kinetMixin;
