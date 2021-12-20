/* //////////// */
/* KiNET Driver */
/* //////////// */

const kinetMixin = {
    data(){
        return{
            kinetPort: 6038,
            kinetHeader: [
                0x04,
                0x01,
                0xdc,
                0x4a, // magic number
                0x02,
                0x00, // kinet version
                0x08,
                0x01, // packet type ("PORTOUT")
                0x00,
                0x00,
                0x00,
                0x00, // set these to 0; unused packet ordering feature
                0xff,
                0xff,
                0xff,
                0xff, // universe; FF FF FF FF is "don't care"
                0x01, // Port on device controller -- 0x01 - 0x10 (1-16)
                0x00, // pad, unused
                0x01,
                0x00, // flags -- "originally 0x01,0x00, 04 00 for sync"
                50,
                0x00, // # of bytes (color vals) in kinet payload; 0 - 512
                0x00,
                0x00 // 0x0FFF = ChromASIC-based lights; 0x0000 = non-CA lights
            ]
        }
    }
}

module.exports = kinetMixin;


let sendSocket = false;
if(window.dgram){
    sendSocket = window.dgram.send
}

function sendKinetV2(data, supplyIP, supplyPort) {
    if (supplyPort < 1 || supplyPort > 16) {
        //logger.error("sendKinetV2() failed; supply port out of protocol range");
        return false
    }

    if (data.length > 512) {
        //logger.error("sendKinetV2() failed; data length exceeds protocol limits");
        return false
    }

    // set target port in header
    this.kinetHeader[16] = supplyPort

    // need correct endian-ness for 2 byte data length field
    var first8 = data.length >> 8
    var last8 = data.length & 0x00ff

    this.kinetHeader[20] = last8
    this.kinetHeader[21] = first8

    if(sendSocket !== false){
        sendSocket(Buffer.from(this.kinetHeader.concat(data)), this.kinetPort, supplyIP)
    }
}

// frameBuf = RGB buffer (standard array)
function sendKinetStrands(frameBuf) {
    var strands = config

    for (var i = 0; i < strands.length; i++) {
        var s = strands[i]

        var slice_start = s.start * 3
        var slice_end = slice_start + s.num_lights * 3 // exclusive

        // send a subset of the pixels in the   current frame to this strand
        sendKinetV2(frameBuf.slice(slice_start, slice_end), s.ip, s.port)
    }
}

function getTotalKinetLights() {
    var tot = 0
    var strands = config

    for (var i = 0; i < strands.length; i++) {
        tot += config[i].num_lights
    }

    return tot
}

module.exports = {
    sendKinetStrands: sendKinetStrands,
    getTotalKinetLights: getTotalKinetLights
}
