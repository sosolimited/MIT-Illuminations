const simpleColors = `//
// Simple Colors Template
//

//
// Global variables
//
let c1, c2;
let anchorX = 0;
const speed = controls.speed.value;

//
// Setup
// Called once at beginning of program
//
function setup() {
    createCanvas(helpers.canvas.width, helpers.canvas.height);
    c1 = color(controls.color1.value);
    c2 = color(controls.color2.value);
    noStroke();
}

//
// Draw loop
// Called once per frame after setup
//
function draw() {
    clear();
    createGradient();
    incrementAnchorX();
}

//
// Custom functions
//
createGradient = function() {
    const step = width / 120;
    for (let x = 0; x < width; x += step) {
        const distFromAnchorX = abs(x - anchorX);
        const lerpAmt = map(distFromAnchorX, 0, width, 0, 1);
        const c = lerpColor(c1, c2, lerpAmt);
        fill(c);
        rect(x, 0, step, height);
    }
}

incrementAnchorX = function() {
    if (anchorX > width || anchorX < 0) {
        // Flip the colors
        const ctmp = c1
        c1 = c2
        c2 = ctmp
        // Reset the gradient position
        if (speed > 0) {
            anchorX = 0
        } else {
            anchorX = width
        }
    }
    
    // Increment the gradient position by speed
    anchorX += speed
}
`

const slitScan = `//
// Title: Slit-Scan
// Contributed by: Soso
//

// Global variables
const w = helpers.canvas.width;
const h = helpers.canvas.height;
const scanSpeed = controls.scanSpeed.value;
let y1, y2;
let img;


// Preload
function preload() {
\timg = loadControlImage(
        controls.image.value,
    );
}

// Setup
function setup() {
    createCanvas(w, h);
    img.resize(w, img.height * w / img.width);
    y1 = -img.height + h;
    y2 = y1 - img.height;
}

// Draw loop
function draw() {
    image(img, 0, y1);
    image(img, 0, y2);
    incrementY();
}

// Update the image height
incrementY = function() {
    if (y2 >= -img.height + h) {
        y1 = y2;
        y2 = y1 - img.height;
    } else {
        y1 += scanSpeed;
        y2 += scanSpeed;
    }
}
`

// eslint-disable-next-line no-unused-vars
const weather = `//
// Title: OpenWeather API
// Contributed by: Soso
//

// CONTROL IMAGE VARS
let img, clear, clouds, rain, lightning, snow

// INTERVAL VARS
let intervalMillis = 1000 * 60 * 60;
let intervalStart

// QUERY VARS
const lon = '-71'
const lat = '42'
const baseUrl = 'https://api.openweathermap.org/data/2.5/onecall'
const key = '(insert-your-key-here)'
const query = \`\${baseUrl}?lon=\${lon}&lat=\${lat}&appid=\${key}\`

// FORECAST
let forecast

// IMAGE SCROLL VARS
const scanSpeed = controls.scanSpeed.value;
let y1, y2;

preload = function() {
    // Load all images into p5 image objects
    clear = loadControlImage(controls.clear.value)
    clouds = loadControlImage(controls.clouds.value)
    rain = loadControlImage(controls.rain.value)
    lightning = loadControlImage(controls.lightning.value)
    snow = loadControlImage(controls.snow.value)
}

function setup() {
    // Create canvas
    createCanvas(helpers.canvas.width, helpers.canvas.height);

    // Resize all images
    resizeImage(clear)
    resizeImage(clouds)
    resizeImage(rain)
    resizeImage(lightning)
    resizeImage(snow)

    // Get data
    getData()
}

function draw() {
    // If the interval duration has passed, get new data
    if (millis() - intervalStart > intervalMillis) {
        intervalStart = millis()
        getData()
    }

    // Put the image on the canvas
    if (img) {
        // Set image vertical location
    	scrollImage()

        // Display the image
        image(img, 0, y1)
        image(img, 0, y2)
    }

}

getData = function() {
    intervalStart = millis()
    loadJSON(
        query,
        result => setForecast(result)
    )
    // img = snow // toggle to manually test different effects
}

setForecast = function(data) {
    // New forecast
   	const newForecast = data.hourly[24].weather[0].main.toLowerCase()

    // If the forecast has changed since the last call
    if (newForecast != forecast) {
        forecast = newForecast
        console.log(forecast)
        switch(forecast) {
            case 'clear':
                img = clear
                break
            case 'clouds':
                img = clouds
                break
            case 'rain':
                img = rain
                break
            default:
                img = clear
        }
        y1 = -img.height + height
        y2 = y1 - img.height
    }
}

resizeImage = function(p5Image) {
    p5Image.resize(width, p5Image.height * width / p5Image.width)
}

scrollImage = function() {
    if (!y1 || !y2) {
        y1 = -img.height + height
        y2 = y1 - img.height
    }
	else if (y2 >= -img.height + height) {
        y1 = y2
        y2 = y1 - img.height
    } else {
        y1 += scanSpeed
        y2 += scanSpeed
    }
}
`

const boilerplate = `//
// Title: _________________________
// Contributed by: ________________
//

// Define global variables here. Example variable declarations:
//    const myNumberVariable = 50;
//    const myColorVariable = color('red');
//    const myControlVariable = controls.myControlId.value;
//    const myCanvasVariable = helpers.canvas.width;


// Setup is called once at beginning of the program
function setup() {
    createCanvas(helpers.canvas.width, helpers.canvas.height);
    // Add your custom setup code here
}


// Draw loop is called once per frame after setup (~60 frames / second)
function draw() {
    // Replace with your custom code
    background(200);
}

// Define custom functions here. Example function using p5 method(s):
// We recommend prefixing custom functions with 'custom_' to avoid naming conflicts.
//    custom_myCustomFunction = function() {
//         background(100);
//         ....
//    }
//
// Called with:
//    custom_myCustomFunction();
`

const solid = `//
// Title: Solid Color
// Contributed by: Soso
//

// Global variables
const w = helpers.canvas.width;
const h = helpers.canvas.height;

// Setup
function setup() {
    createCanvas(w, h);
}

// Draw loop
function draw() {
    background(controls.color.value);

}
`

const perlin = `//
// Title: Perlin
// Contributed by: Soso
//

// Global vars
const w = 1200;
const h = 100;
const rectWidth = w / 60;
const noiseSpeed = controls.noiseSpeed.value;
const noiseScale = controls.noiseScale.value;

// Setup
function setup() {
    createCanvas(w, h);
}

// Draw loop
function draw() {
    background(0, 5);
    // Noise detail takes two control parameters: lod, falloff
    // See https://p5js.org/reference/#/p5/noiseDetail
    noiseDetail(3, 1.1);
    // For each x calculate noise value
    for (let x = 0; x < w; x += rectWidth) {
      let n = noise(x * noiseScale, frameCount * noiseSpeed);
      //if(n < 0.8) {n = 0;}
      noStroke();
      fill(n * 255);
      rect(x, 0, rectWidth, h);
    }

}
`

const rainbow = `//
// Title: Rainbow
// Contributed by: Soso
//

// Global vars
const w = helpers.canvas.width;
const h = helpers.canvas.height;
const rectWidth = w / 200;
let offset = 2;
const speed = controls.speed.value;

// Setup
function setup() {
    createCanvas(w, h);
}

// Draw loop
function draw() {
    // Set the color mode to HSB to perform hue-specific calculations
    colorMode(HSB);
    offset = rainbowGradient(w, h, rectWidth, offset);

    // Reset the color mode to RGB to send data to the lights (required)
    colorMode(RGB);
}

// Supporting functions
rainbowGradient = function(w, h, rectWidth, offset) {
    for (let x = 0; x < w; x += rectWidth) {
        let hue = x / w * 360;
        noStroke();
        fill(abs(hue-offset) % 360, 100, 100);
        rect(x, 0, rectWidth, h);
    }
    return offset + speed;
}
`

export {
    simpleColors,
    slitScan,
    // weather,
    boilerplate,
    rainbow,
    perlin,
    solid
}
