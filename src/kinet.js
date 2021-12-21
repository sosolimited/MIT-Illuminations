// Based in PiLights controller created by SOSO Limited
// More info at: https://github.com/sosolimited/PiLights

// import store from '../src/store'

//var logger = require('winston');
// const config = require('@/config/kinet.config.js');

// Load the kinet config from the vuex, which has logic built in
// to know whether in dev/prod mode and whether or not to look
// for a local config in the machine's userData path.
const store = require('@/store/index.js')
const config = store.default.getters.kinet

const kProtocolPort = 6038
//const kinet_max_lights = Math.floor(512 / 3);

var kV2Header = [
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

let sendSocket = false;
if (window.dgram) {
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
    kV2Header[16] = supplyPort

    // need correct endian-ness for 2 byte data length field
    var first8 = data.length >> 8
    var last8 = data.length & 0x00ff

    kV2Header[20] = last8
    kV2Header[21] = first8

    if (sendSocket !== false) {
        sendSocket(Buffer.from(kV2Header.concat(data)), kProtocolPort, supplyIP)
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
