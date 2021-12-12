<template>
  <section>
    <!-- No Template Declared in P5 Global Mode -->
  </section>
</template>

<script>

// Kinet (DMX) Connection UDP Driver
// const kinet = require('../drivers/kinet.js');

// Arduino (Adafruit/Neopixel) Serial Port Driver
// const neopixel = require('../drivers/neopixel.js');

// Import Helpers
import helpers from '../config/p5helpers.config';

export default {
  name: 'PlayingNow',
  data() {
    return {
      helpers: helpers
    }
  },
  computed: {
    playingNowShow() {
      return this.$store.state.playingNow;
    },
    code() {
      return this.$store.state.playingNow.code;
    },
    controls() {
      return this.$store.state.playingNow.controls;
    },
    playingNowWatcher() {
      return this.$store.state.playingNowWatcher;
    },
    lightsOn() {
      return this.$store.state.lightsOn;
    },
    numLights(){
      return parseInt(this.$store.state.numLights);
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.deployToP5();
    });
  },
  methods: {

    /**
     * Preprocesses the user's code and deploys it to the global P5 instance
     * 1. It instantiates several helper utilities and libraries to support functionality.
     * 2. It loads the user-defined P5 code into the global namespace, and instantiates p5 in on-demand global mode
     * 3. It draws the illuminationsPreview "mockup" and defines the method by which the lights are sampled from the P5 instance.
     */
    deployToP5: function () {

      const vm = this;

      // Remove the prior deployment of P5 from the DOM
      if (window.p5 && window.p5.instance) {
        window.p5.instance.remove();
        window.p5.instance = window.setup = window.draw = window.preload = null;
      }

      // Move our helpers and controls into the global namespace
      window.helpers = this.helpers;
      window.helpers.lights.count = this.numLights;
      window.controls = this.controls;

      function imageSrc(filename) {
        return `file:///${window.vueApplication.$store.state.userUploadsPath}/user_uploads/${filename}`;
      }

      /**
       * Provides a method within P5 by which users can load images from controls into their code.
       * @param filename
       * @param callback
       * @returns {*}
       */
      window.loadControlImage = function (filename, callback) {
        return window.loadImage(imageSrc(filename), callback);
      }

      /**
       * Overrides the typical `addPreviewAnnotations` call, to avoid drawing illuminationsPreview screen elements to output
       * @returns {boolean}
       */
      window.addPreviewAnnotations = function () {
        return false;
      }

      // Handle Intensity Changes in Sampling
      let prevData = []
      for (let i = 0; i < this.numLights; i++) {
        let noRGB = [0, 0, 0];
        prevData = prevData.concat(noRGB);
      }

      /**
       * Defines the method by which we sample the display for output to the appropriate lights driver.
       */
      window.illuminationsPreviousSample = [];
      for (let i = 0; i < this.numLights; i++) {
        let noRGB = [0, 0, 0];
        window.illuminationsPreviousSample = window.illuminationsPreviousSample.concat(noRGB);
      }

      //
      //    The 'illuminationsSampling' method has access to all p5 methods.
      //    It gets called every frame at the end of the user's draw method
      //    and maps a series of pixels in the canvas to the corresponding
      //    red, green, and blue LED lights using the KiNET interface
      //
      //    To call a p5 method from within 'sampleLogic', prefix the
      //    method with 'p5'. For example, 'get()' can be called with 'p5.get()'.
      //
      window.illuminationsSampling = function () {
        const p5 = window.illuminationsP5;
        let prevData = window.illuminationsPreviousSample;
        let data = [];
        const filter = false;
        //
        //    limit controls the max. intensity change of each pixel
        //    Defined between 0 and 127
        const limit = 10;
        const maxNodes = vm.numLights;
        let x = 0;
        const y = Math.floor(p5.height / 2);
        const xStep = p5.width / vm.numLights;
        const x0 = xStep / 2;
        for (let i = 0; i < maxNodes; i++) {
          x = x0 + i * xStep
          let RGB = p5.get(x, y) //RGB values from the p5 sketch
          //
          //  The filter applies a time-domain convolution on the RGB values
          //  sent to the LED strand. It averages each of the Red, Green, and
          //  Blue values of the p5 sketch animation and the previously stored
          //  values displayed in the LED strand setting a limit of how much
          //  each individual pixel can increase its intensity (limit = 10);
          //
          if (filter === true) {
            for (let j = 0; j < 3; j++) {
              let currRGBv = RGB[j] //Current pixel value
              let prevRGBv = prevData[i * 3 + j] //Previous pixel value
              let newRGBv //New pixel value
              let dist //Distance between previous and current pix. value
              let change //Intensity change to the current pixel value
              let lim = limit
              if (prevRGBv <= currRGBv) {
                dist = currRGBv - prevRGBv
                change = dist / 2 >= lim ? lim : dist / 2
                newRGBv = prevRGBv + change
              } else {
                dist = prevRGBv - currRGBv
                change = dist / 2 >= lim ? lim : dist / 2
                newRGBv = prevRGBv - change
              }
              data = data.concat(newRGBv) //Stores the pix. value
            }
          } else {
            RGB.splice(3, 1)
            data = data.concat(RGB)
          }
        }
        const fps = 60
        if (p5.frameCount % (60 / fps) === 0) {
          //Send the RGB array to the KiNET interface
          if (window.estore) {
            // kinet.sendKinetStrands(data);
            // neopixel.sendToDevice(data);
          }
        }
        window.illuminationsPreviousSample = data;
      }

      /**
       * Draws the illuminationsPreview "mock-up" as part of the P5's draw() loop
       */
      window.illuminationsPreview = function () {

        // P5 Definition
        const p5 = window.illuminationsP5;

        // Canvas Definition
        const previewCanvas = document.getElementById('previewDisplay');
        const ctx = previewCanvas.getContext('2d');

        ///////////////////
        // Code Mode (2) //
        ///////////////////

        if (window.vueApplication.$store.state.previewMode === 2) {
          ctx.globalCompositeOperation = 'normal';
          ctx.fillStyle = "#000000";
          ctx.fillRect(0, 0, previewCanvas.width, previewCanvas.height);
          ctx.drawImage(document.getElementById('defaultCanvas0'), 0, 0, 1200, 100, 0, 0, 1920, 160);

          // All done
          return true;

        }

        // Sample Data
        const light_count = vm.numLights;
        const illuminations__step = (p5.width - 100) / light_count
        const illuminations__halfStep = illuminations__step / 2
        const halfHeight = p5.height / 2
        const colors = []
        for (
            let x = illuminations__halfStep;
            x < (p5.width - 100);
            x += illuminations__step
        ) {
          colors.push(p5.get(x, halfHeight))
        }

        /////////////////////
        // Sample Mode (1) //
        /////////////////////

        if (window.vueApplication.$store.state.previewMode === 1) {

          // Background
          ctx.globalCompositeOperation = 'normal';
          ctx.fillStyle = "#343434";
          ctx.fillRect(0, 0, previewCanvas.width, previewCanvas.height);

          // Code Preview Behind Sampled Lights
          ctx.globalCompositeOperation = 'normal';
          ctx.globalAlpha = 0.2;
          // ctx.drawImage(document.getElementById('defaultCanvas0'), 0, 0, 1200, 100, 0, 0, 1920, 160);
          ctx.globalAlpha = 1;

          // Sampled Lights
          let colorIndex = 0;
          for (
              let x = illuminations__halfStep;
              x < (p5.width - 100);
              x += illuminations__step
          ) {

            ctx.beginPath();
            ctx.ellipse((x + 50) * 1.6, 80, 4, 4, 0, 0, Math.PI * 2, false);
            ctx.fillStyle = 'rgba(' + colors[colorIndex][0] + ',' + colors[colorIndex][1] + ',' + colors[colorIndex][2] + ', 1)';
            ctx.globalCompositeOperation = 'normal';
            ctx.fill();

            // Continue Loop
            colorIndex += 1
          }

          // All done
          return true;

        }


        /////////////////////
        // Mockup Mode (0) //
        /////////////////////


        // Background
        ctx.globalCompositeOperation = 'normal';
        let my_gradient_background = ctx.createLinearGradient(0, 20, 0, 160);
        my_gradient_background.addColorStop(0, '#575757');
        my_gradient_background.addColorStop(1, '#4b4b4b');
        ctx.fillStyle = my_gradient_background;
        ctx.fillRect(0, 0, previewCanvas.width, previewCanvas.height);

        // Light Rays
        let colorIndex = 0;
        for (
            let x = illuminations__halfStep;
            x < (p5.width - 100);
            x += illuminations__step
        ) {

          // Hard Light Source
          ctx.beginPath();
          ctx.filter = 'blur(8px)';
          ctx.moveTo((x + 50 - 1) * 1.6, 20 * 1.6);
          ctx.lineTo((x + 50 + 1) * 1.6, 20 * 1.6);
          ctx.lineTo(((x + 50) + (illuminations__step * 2)) * 1.6, (halfHeight + 80) * 1.6);
          ctx.lineTo(((x + 50) - (illuminations__step * 4)) * 1.6, (halfHeight + 80) * 1.6);
          let my_gradient_hard = ctx.createLinearGradient(0, 20, 0, 160);
          my_gradient_hard.addColorStop(0, 'rgba(' + colors[colorIndex][0] + ',' + colors[colorIndex][1] + ',' + colors[colorIndex][2] + ', 0)');
          my_gradient_hard.addColorStop(0.3, 'rgba(' + colors[colorIndex][0] + ',' + colors[colorIndex][1] + ',' + colors[colorIndex][2] + ',' + (colors[colorIndex][3] / 5) + ')');
          my_gradient_hard.addColorStop(0.5, 'rgba(' + colors[colorIndex][0] + ',' + colors[colorIndex][1] + ',' + colors[colorIndex][2] + ',' + (colors[colorIndex][3]) + ')');
          my_gradient_hard.addColorStop(0.8, 'rgba(' + colors[colorIndex][0] + ',' + colors[colorIndex][1] + ',' + colors[colorIndex][2] + ', 0)');
          ctx.fillStyle = my_gradient_hard;
          ctx.globalCompositeOperation = 'lighter';
          ctx.globalAlpha = 0.15
          ctx.fill();
          ctx.globalAlpha = 1

          // Soft Ambient
          ctx.beginPath();
          ctx.filter = 'blur(10px)';
          ctx.moveTo((x + 50 - 1) * 1.6, 20 * 1.6);
          ctx.lineTo((x + 50 + 1) * 1.6, 20 * 1.6);
          ctx.lineTo(((x + 50) + (illuminations__step * 12)) * 1.6, (halfHeight + 140) * 1.6);
          ctx.lineTo(((x + 50) - (illuminations__step * 12)) * 1.6, (halfHeight + 140) * 1.6);
          let my_gradient_soft = ctx.createLinearGradient(0, 50, 0, 160);
          my_gradient_soft.addColorStop(0, 'rgba(' + colors[colorIndex][0] + ',' + colors[colorIndex][1] + ',' + colors[colorIndex][2] + ',' + ((colors[colorIndex][3]) / 5) + ')');
          my_gradient_soft.addColorStop(1, 'rgba(' + colors[colorIndex][0] + ',' + colors[colorIndex][1] + ',' + colors[colorIndex][2] + ', 0)');
          ctx.fillStyle = my_gradient_soft;
          ctx.globalCompositeOperation = 'screen';
          ctx.globalAlpha = 0.2
          ctx.fill();
          ctx.globalAlpha = 1

          // Continue Loop
          colorIndex += 1
        }

        // Ceiling
        ctx.filter = 'blur(0)';
        ctx.globalCompositeOperation = 'normal';
        let my_gradient_ceiling = ctx.createLinearGradient(0, 0, 0, 22);
        my_gradient_ceiling.addColorStop(0.8, '#777777');
        my_gradient_ceiling.addColorStop(1, '#6e6e6e');
        ctx.fillStyle = my_gradient_ceiling;
        ctx.fillRect(0, 0, previewCanvas.width, 20);

        // Light Sources (Par Cans)
        colorIndex = 0;
        for (
            let x = illuminations__halfStep;
            x < (p5.width - 100);
            x += illuminations__step
        ) {

          ctx.filter = 'blur(0)';
          ctx.beginPath();
          ctx.ellipse((x + 50) * 1.6, 10, 2, 2, 0, 0, Math.PI * 2, false);
          ctx.fillStyle = 'rgba(' + colors[colorIndex][0] + ',' + colors[colorIndex][1] + ',' + colors[colorIndex][2] + ', 1)';
          ctx.globalCompositeOperation = 'hard-light';
          ctx.fill();

          // Continue Loop
          colorIndex += 1
        }

        // All done
        return true;

      }

      // Rewrite instance mode code to global mode (assuming `p5` used as namespace)
      let outputCode = this.code.replace(/new p5\./g, 'translate-to-global-instance');
      outputCode = outputCode.replace(/p5\./g, 'window.');
      outputCode = outputCode.replace(/translate-to-global-instance/g, 'new window.p5.');
      outputCode = outputCode.replace(/helpers/g, 'window.helpers');
      outputCode = outputCode.replace(/controls/g, 'window.controls');
      outputCode = outputCode.replace(/let /g, 'var ');
      outputCode = outputCode.replace(/const /g, 'var ');

      /* When the application runs, it should enumerate all method/property names in window into an array in the vuex store */
      /* Then, when we parse the user's code, we should try and find variable names that are in that list, and block/stop if that's the case */
      /* Keeping the initial state in store before any user code is evaluated means we can run this multiple times and allow it to override setup/draw/etc. */

      // Evaluate the user defined P5 code into the global namespace (by means of indirect evaluation)
      try {
        window.eval(outputCode);
      } catch (e) {
        console.log(e);
      }

      // Must remain a constant and not directly referenced so that it can be appended to with illuminationsSampling/illuminationsPreview methods below
      const userDefinedDrawMethod = window.draw || function () {
      };

      // Define target FPS
      window.illuminationsFPSCap = 60;

      // Draw the user's code if lights are on, otherwise draw a black screen.
      if (this.lightsOn) {
        window.draw = function () {
          if (window.illuminationsP5.frameCount % (60 / window.illuminationsFPSCap) === 0) {
            userDefinedDrawMethod();
            window.illuminationsSampling();
            window.illuminationsPreview();
          }
        }
      } else {
        window.draw = function () {
          // eslint-disable-next-line no-undef
          background(0);
          window.illuminationsSampling();
          window.illuminationsPreview();
        }
      }

      // Load P5 in on-demand global mode
      window.illuminationsP5 = new window.p5();

    },

  },
  watch: {
    playingNowWatcher: {
      handler() {
        this.deployToP5();
      }
    },
    lightsOn: {
      handler() {
        this.deployToP5();
      }
    }
  }
}
</script>

<style scoped>
#playing-now-container {
  position: relative;
  margin-left: 6px;
}
</style>
