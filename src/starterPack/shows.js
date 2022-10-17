// define preset templates to include in the application;
// these are copied by default in new installations

// include code
const starterPack = require('./index');

module.exports = [
    {
        id: '3p__CK7daF',
        info: {
            title: 'Simple Gradient',
            description:
                'Set the lights to a single color or simple gradient.',
            longDescription: 'This simple light show transforms the space through color',
            contributors: 'Sosolimited',
            thumbnail: '3p__CK7daF.png',
            thumbnailData: null,
            favorite: true,
            websiteColors: {
                top: ['#C723A3', '#FFFFFF'],
                bottom: ['#FF852B', '#272727']
            }
        },
        code: starterPack.simpleColors,
        controls: {
            color1: {
                name: 'Color 1',
                id: 'color1',
                type: 'color',
                value: '#283BEE'
            },
            color2: {
                name: 'Color 2',
                id: 'color2',
                type: 'color',
                value: '#C723A3'
            },
            speed: {
                id: 'speed',
                name: 'Speed',
                type: 'number',
                min: -20,
                max: 20,
                step: 1,
                value: 5
            }
        },
        template: true,
        deleted: false,
        lastModified: 1639189450332,
        lastPlayed: 1639189450337
    },
    {
        id: 'yg00wFxPK0',
        info: {
            title: 'Slit-Scan',
            description:
                'Reveal an image, one row of pixels at a time.',
            longDescription:
                "Inspired by 'slit-scan' photography, this code samples an image's colors one row of pixels at a time - and sends those colors to the lights. Using this technique, viewers can watch an image reveal itself over time.",
            contributors: 'Sosolimited',
            thumbnail: 'yg00wFxPK0.png',
            thumbnailData: null,
            favorite: true
        },
        code: starterPack.slitScan,
        controls: {
            image: {
                name: 'Image',
                id: 'image',
                type: 'image',
                value: 'hYOZOuI9LC.png'
            },
            scanSpeed: {
                name: 'Scan Speed',
                id: 'scanSpeed',
                type: 'number',
                min: 0.1,
                max: 5,
                step: 0.1,
                value: 0.2
            }
        },
        template: true,
        deleted: false,
        lastModified: null,
        lastPlayed: 0
    },
    {
        id: 'P3__pperlL',
        info: {
            title: 'Perlin',
            description: 'Animate the lights with Perlin noise.',
            longDescription:
                "This lightshow uses 'Perlin noise' (developed by Ken Perlin) to create harmonic animations across the lights.",
            contributors: 'Sosolimited',
            thumbnail: 'hjUljlo0aP.png',
            thumbnailData: null,
            favorite: true
        },
        code: starterPack.perlin,
        controls: {
            noiseScale: {
                id: 'noiseScale',
                name: 'Noise Scale',
                type: 'number',
                min: 0.001,
                max: 0.02,
                step: 0.001,
                value: 0.01
            },
            noiseSpeed: {
                id: 'noiseSpeed',
                name: 'Noise Speed',
                type: 'number',
                min: 0.0001,
                max: 0.01,
                step: 0.001,
                value: 0.005
            }
        },
        template: true,
        deleted: false,
        lastModified: null,
        lastPlayed: 0
    },
    {
        id: 'Xlkv1Fasdf',
        info: {
            title: 'Solid Color',
            description: 'Ah, simplicity.',
            longDescription:
                'This lightshow plays a single color across all of the lights. It is made to be expanded upon.',
            contributors: 'Sosolimited',
            thumbnail: 'Xlkv1Fasdf.png',
            thumbnailData: null,
            favorite: true
        },
        code: starterPack.solid,
        controls: {
            color: {
                name: 'Color',
                id: 'color',
                type: 'color',
                value: '#EEB0B7'
            }
        },
        template: true,
        deleted: false,
        lastModified: null,
        lastPlayed: 0
    },
    {
        id: 'jalUBNlsj0',
        info: {
            title: 'Rainbow',
            description: 'Paint an endless rainbow.',
            longDescription:
                'Red, orange, yellow, green, blue, indigo, violet...and repeat. A small piece of code sends the colors of the rainbow to the lights.',
            contributors: 'Sosolimited',
            thumbnail: 'jalUBNlsj0.png',
            thumbnailData: null,
            favorite: true
        },
        code: starterPack.rainbow,
        controls: {
            speed: {
                id: 'speed',
                name: 'Speed',
                type: 'number',
                min: -10,
                max: 10,
                step: 1,
                value: 2
            }
        },
        template: true,
        deleted: false,
        lastModified: null,
        lastPlayed: 0
    },
    {
        "id": "nulcP0p1nw",
        "info": {
            "title": "Equalizer",
            "description": "An audio spectrum (FFT)",
            "thumbnail": "nulcP0p1nw.png",
            "favorite": true,
            "contributors": "Sosolimited",
            "longDescription": "This visualization takes the full FFT spectrum of audio input and displays various colors on the frieze based on spectrum analysis."
        },
        "code": "//\n// Title: The Equalizer\n// Contributed by: Sosolimited\n//\n\n// Global variables\nconst w = helpers.canvas.width;\nconst h = helpers.canvas.height;\nlet mic, fft, analyzer;\n\n// Setup\n// Here we find our audio input and setup an FFT visualization\nfunction setup(){\n    createCanvas(w, h);\n\n    // Get the microphone input, and adjust amplitude as needed\n    mic = new p5.AudioIn();\n    mic.amp(controls.inputAmplitude.value);\n    mic.start();\n\n    // Analyze using FFT\n    fft = new p5.FFT();\n    fft.setInput(mic);\n\n    background(0);\n}\n\n// Draw loop\nfunction draw(){\n\n    // Let's analyze the FFT spectrum\n    let spectrum = fft.analyze();\n    let lenSpectrum = spectrum.length / 15;\n    let rectWidth = w / (lenSpectrum);\n    let i = 0;\n    // For each channel in the spectrum, we determine how bright/colored it should be from it's frequency\n    for (i = 0; i < lenSpectrum; i++) {\n        let freq = spectrum[i] * (1 + controls.gainBoost.value);\n        let x0 = i * rectWidth;\n        noStroke();\n\n        if (freq > controls.highFrequencyCutoff.value) {\n            // High Frequency\n            fill(controls.highFrequencyColor.value);\n        } else if (freq > controls.midFrequencyCutoff.value) {\n            // Mid Frequency\n            fill(controls.midFrequencyColor.value);\n        } else {\n            // Low Frequency\n            fill(controls.lowFrequencyColor.value);\n        }\n        // And lastly, we draw a rectangle to screen representing the channel\n        rect(x0, 0, rectWidth, h);\n    }\n\n    // Let's fade things out for a delay effect\n    fill(0,0,0,(255 - ((mic.getLevel() * 3 ) * 2550)));\n    rect(0, 0, w, h);\n}\n",
        "controls": {
            "inputAmplitude": {
                "type": "number",
                "name": "Input Amplitude",
                "id": "inputAmplitude",
                "value": 0.7,
                "min": "0",
                "max": "1",
                "step": "0.1"
            },
            "highFrequencyCutoff": {
                "type": "number",
                "name": "High Frequency Cutoff",
                "id": "highFrequencyCutoff",
                "value": 251,
                "min": "0",
                "max": "255",
                "step": "1"
            },
            "midFrequencyCutoff": {
                "type": "number",
                "name": "Mid Frequency Cutoff",
                "id": "midFrequencyCutoff",
                "value": 172,
                "min": "0",
                "max": "255",
                "step": "1"
            },
            "highFrequencyColor": {
                "type": "color",
                "name": "High Frequency Color",
                "id": "highFrequencyColor",
                "value": "#FF60F8"
            },
            "midFrequencyColor": {
                "type": "color",
                "name": "Mid Frequency Color",
                "id": "midFrequencyColor",
                "value": "#AB00FA"
            },
            "lowFrequencyColor": {
                "type": "color",
                "name": "Low Frequency Color",
                "id": "lowFrequencyColor",
                "value": "#07005A"
            },
            "gainBoost": {
                "type": "number",
                "name": "Gain Boost",
                "id": "gainBoost",
                "value": 0.3,
                "min": "0",
                "max": "1",
                "step": "0.1"
            }
        },
        "template": true,
        "deleted": false,
        "lastModified": null,
        "lastPlayed": 0
    },
    {
        "id": "BLjfd2LZpg",
        "info": {
            "title": "Vocalizer",
            "description": "Speech-to-lights",
            "longDescription": "This visualization takes the microphone input and translates that into an effect that flows out from the center of the lights.",
            "thumbnail": "BLjfd2LZpg.png",
            "favorite": false,
            "contributors": "Sosolimited"
        },
        "code": "//\n// Title: Maestro\n// Contributed by: Soso\n//\n\n// Global variables\nconst w = helpers.canvas.width;\nconst h = helpers.canvas.height;\nlet mic, fft;\nvar prevLevels = new Array(helpers.lights.count / 1);\n\n// Setup\n// Here we find our audio input and setup an FFT visualization\nfunction setup() {\n    createCanvas(w, h);\n\n    // Get the microphone input, and adjust amplitude as needed\n    mic = new p5.AudioIn();\n    mic.amp(controls.inputAmplitude.value);\n    mic.start();\n\n    // Set the stage\n    background(0);\n}\n\n// Draw loop\nfunction draw() {\n\n    background(0);\n\n    var level = mic.getLevel();\n\n    // rectangle variables\n    //var spacing = 1;\n    //var rect_w = w / (prevLevels.length * spacing);\n    var rectangle_width = (w / prevLevels.length);\n\n    var minHeight = 2;\n    var roundness = 20;\n\n    // add new level to end of array\n    prevLevels.push(level);\n\n    // remove first item in array\n    prevLevels.splice(0, 1);\n\n    // loop through all the previous levels\n    for (var i = 0; i < prevLevels.length; i++) {\n        var colorAmplitude = logMap(prevLevels[i], 0, 0.4, -0.2, 2);\n        fill(lerpColor(color(0, 0, 0), color(controls.color.value), colorAmplitude));\n        rect((w / 2) - rectangle_width + (w - (i * rectangle_width)), 0, rectangle_width, h);\n        rect((w / 2) - rectangle_width - (w - (i * rectangle_width)), 0, rectangle_width, h);\n    }\n\n}\n\nfunction logMap(val, inMin, inMax, outMin, outMax) {\n    var offset = 0;\n    if (inMax === 0 || inMin === 0) {\n        offset = 1;\n        inMin += offset;\n        inMax += offset;\n    }\n    var a = (outMin - outMax) / Math.log2(inMin / inMax);\n    var b = outMin - a * Math.log2(inMin);\n    return a * Math.log2(val + offset) + b;\n}\n",
        "controls": {
            "inputAmplitude": {
                "type": "number",
                "name": "Input Amplitude",
                "description": "",
                "id": "inputAmplitude",
                "value": 1,
                "min": "0",
                "max": "1",
                "step": "0.1"
            },
            "color": {
                "type": "color",
                "name": "Color",
                "id": "color",
                "value": "#13AFFF"
            }
        },
        "template": true,
        "deleted": false,
        "lastModified": null,
        "lastPlayed": 0
    },
]
