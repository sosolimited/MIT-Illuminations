<template>
  <section>
    <v-snackbar
        v-model="snackbar"
    >
      {{ errorMessage }}

      <template v-slot:action="{ attrs }">
        <v-btn
            color="red"
            text
            v-bind="attrs"
            @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </section>
</template>

<script>

// Phillips ColorKinetics KiNET Driver
import kinetMixin from '../drivers/kinet';

// Arduino (Adafruit/Neopixel) Serial Port Driver
import serialMixin from '../drivers/serial';

// Import Helpers
import helpers from '../config/p5helpers.config';

import {parse} from 'acorn';

export default {
  name: 'PlayingNow',
  data() {
    return {
      helpers: helpers,
      snackbar: false,
      errorMessage: '',
      protectedVariables: []
    }
  },
  mixins: [
    serialMixin,
    kinetMixin
  ],
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
    numLights() {
      return parseInt(this.$store.state.numLights);
    }
  },
  mounted() {
    // Prepare the protected variables
    this.protectedVariables = Object.keys(window);
    // Deploy the P5
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
        window.draw = null;
        window.p5.instance.remove();
        window.p5.instance = window.setup = window.draw = window.preload = null;
      }

      // Move our helpers and controls into the global namespace
      window.helpers = this.helpers;
      window.helpers.lights.count = this.numLights;
      window.controls = this.controls;

      /**
       * Provides a method within P5 by which users can load images from controls into their code.
       * @param filename
       * @param callback
       * @returns {*}
       */
      window.loadControlImage = function (filename, callback) {
        return window.loadImage(`asset://${filename}`, callback);
      }

      /**
       * Overrides the typical `addPreviewAnnotations` call, to avoid drawing illuminationsPreview screen elements to output
       * @returns {boolean}
       */
      window.addPreviewAnnotations = function () {
        return false;
      }

      window.illuminationsSampling = function () {

        const p5 = window.illuminationsP5;
        let data = [];
        const y = 50;
        const xStep = Math.floor(1200 / vm.numLights);
        const x0 = Math.floor(xStep / 2);
        p5.loadPixels();
        const samples = [];
        for (let i = 0; i < vm.numLights; i++) {
          let x = x0 + i * xStep;
          let RGB = [];

          for (let RGBIndex = 0; RGBIndex < 3; RGBIndex++) {
            const startIndex = 4 * (y * 1200 + x);
            RGB.push(p5.pixels[startIndex + RGBIndex]);
          }

          samples.push([...RGB, 1]);

          // Convert to RGB+W if needed
          if (vm.selectedColorMode === 'RGB + W') {
            let M = Math.max(RGB[0], RGB[1], RGB[2]);
            let m = Math.min(RGB[0], RGB[1], RGB[2]);
            let Wo = (m / M < 0.5) ? ((m * M) / (M - m)) : M;
            let K = (Wo + M) / M;
            let outputRGB = [];
            outputRGB[0] = Math.floor[(K * RGB[0]) - Wo];
            outputRGB[1] = Math.floor[(K * RGB[1]) - Wo];
            outputRGB[2] = Math.floor[(K * RGB[2]) - Wo];
            outputRGB[3] = Wo;
            RGB = outputRGB;
          }
          data = data.concat(RGB);
        }

        // Output Serial Data
        if (vm.enableSerial) {
          vm.outputOverSerial(data);
        }

        // Output KiNET Data
        if (vm.enableKinet) {
          vm.outputOverKinet(data);
        }

        // Return raw sampling data for preview
        return samples;

      }

      /**
       * Draws the illuminationsPreview "mock-up" as part of the P5's draw() loop
       */
      window.illuminationsPreview = function (samples) {

        // P5 Definition
        const p5 = window.illuminationsP5;

        // Canvas Definition
        const previewCanvas = document.getElementById('previewDisplay');
        const ctx = previewCanvas.getContext('2d');

        // No Data
        if (samples.length === 0) {
          ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
          return;
        }

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
        const illuminations__step = Math.floor(p5.width / samples.length)
        const illuminations__halfStep = Math.floor(illuminations__step / 2);
        const halfHeight = Math.floor(p5.height / 2);

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
          ctx.globalAlpha = 1;

          // Sampled Lights
          for (let i = 0; i < samples.length; i++) {
            ctx.beginPath();
            ctx.ellipse(Math.floor((illuminations__halfStep + (i * illuminations__step)) * 1.6), 80, 4, 4, 0, 0, Math.PI * 2, false);
            ctx.fillStyle = 'rgba(' + samples[i][0] + ',' + samples[i][1] + ',' + samples[i][2] + ', 1)';
            ctx.globalCompositeOperation = 'normal';
            ctx.fill();
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
        for (let i = 0; i < samples.length; i++) {

          const x = (illuminations__halfStep + (i * illuminations__step));

          // Hard Light Source
          ctx.beginPath();
          ctx.moveTo((x - 1) * 1.6, 20 * 1.6);
          ctx.lineTo((x + 1) * 1.6, 20 * 1.6);
          ctx.lineTo(((x) + (illuminations__step * 2)) * 1.6, (halfHeight + 80) * 1.6);
          ctx.lineTo(((x) - (illuminations__step * 4)) * 1.6, (halfHeight + 80) * 1.6);
          let my_gradient_hard = ctx.createLinearGradient(0, 20, 0, 160);
          my_gradient_hard.addColorStop(0, 'rgba(' + samples[i][0] + ',' + samples[i][1] + ',' + samples[i][2] + ', 0)');
          my_gradient_hard.addColorStop(0.3, 'rgba(' + samples[i][0] + ',' + samples[i][1] + ',' + samples[i][2] + ',' + (samples[i][3] / 5) + ')');
          my_gradient_hard.addColorStop(0.5, 'rgba(' + samples[i][0] + ',' + samples[i][1] + ',' + samples[i][2] + ',' + (samples[i][3]) + ')');
          my_gradient_hard.addColorStop(0.8, 'rgba(' + samples[i][0] + ',' + samples[i][1] + ',' + samples[i][2] + ', 0)');
          ctx.fillStyle = my_gradient_hard;
          ctx.globalCompositeOperation = 'lighter';
          ctx.globalAlpha = 0.25;
          ctx.fill();
          ctx.globalAlpha = 1;
        }

        // Ceiling
        ctx.globalCompositeOperation = 'normal';
        let my_gradient_ceiling = ctx.createLinearGradient(0, 0, 0, 22);
        my_gradient_ceiling.addColorStop(0.8, '#777777');
        my_gradient_ceiling.addColorStop(1, '#6e6e6e');
        ctx.fillStyle = my_gradient_ceiling;
        ctx.fillRect(0, 0, previewCanvas.width, 20);

        // Light Sources (Par Cans)
        for (let i = 0; i < samples.length; i++) {

          const x = (illuminations__halfStep + (i * illuminations__step));

          ctx.beginPath();
          ctx.ellipse((x) * 1.6, 10, 2, 2, 0, 0, Math.PI * 2, false);
          ctx.fillStyle = 'rgba(' + samples[i][0] + ',' + samples[i][1] + ',' + samples[i][2] + ', 1)';
          ctx.globalCompositeOperation = 'hard-light';
          ctx.fill();

        }

        // All done
        return true;

      }

      // Bad Show
      if ('errorFlag' in window.vueApplication.$store.state && 'errorID' in window.vueApplication.$store.state) {
        if (window.vueApplication.$store.state.errorFlag && window.vueApplication.$store.state.errorID === window.vueApplication.$store.state.playingNow.id) {
          const previewCanvas = document.getElementById('previewDisplay');
          const ctx = previewCanvas.getContext('2d');
          ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
          return;
        }
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

      // Evaluate the user defined P5 code
      try {
        const userCodeSyntax = parse(outputCode, {ecmaVersion: 2020});

        // Whoops, the user tried to throw an error
        if (userCodeSyntax["body"].filter(item => {
          return item.type === 'ThrowStatement';
        }).length > 0) {
          this.errorMessage = "Please remove your thrown error/exception - Illuminations doesn't support this yet.";
          this.snackbar = true;
          return;
        }

        // Whoops, the user forgot a setup/draw method
        if (userCodeSyntax["body"].filter(item => {
          return item.type === 'FunctionDeclaration' && (item.id.name === 'setup' || item.id.name === 'draw');
        }).length < 2) {
          this.errorMessage = "Please add a setup() and draw() method to your code.";
          this.snackbar = true;
          return;
        }

        // Make sure no variable names conflict with our protectedVariables list
        for (let item of userCodeSyntax["body"]) {
          if (item.type === 'FunctionDeclaration') {
            for (const element of item["body"]["body"]) {
              if (element.type === 'VariableDeclaration') {
                for (let declaration of element["declarations"]) {
                  if (this.protectedVariables.includes(declaration.id.name)) {
                    this.errorMessage = "Please rename your variable '" + declaration.id.name + "' - it conflicts with a protected variable name.";
                    this.snackbar = true;
                    return;
                  }
                }
              }
            }
          } else if (item.type === 'VariableDeclaration') {
            for (let declaration of item["declarations"]) {
              if (this.protectedVariables.includes(declaration.id.name)) {
                this.errorMessage = "Please rename your variable '" + declaration.id.name + "' - it conflicts with a protected variable name.";
                this.snackbar = true;
                return;
              }
            }
          }
        }


      } catch (e) {
        // Any syntax errors, let's handle them
        this.errorMessage = e.message;
        this.snackbar = true;
        return;
      }

      // Run the user defined P5 code
      try {
        window.eval(outputCode);
      } catch (e) {
        console.log(e);
      }

      // Must remain a constant and not directly referenced so that it can be appended to with illuminationsSampling/illuminationsPreview methods below
      const userDefinedSetupMethod = window.setup || function () {
      };
      const userDefinedDrawMethod = window.draw || function () {
      };

      window.setup = function () {
        userDefinedSetupMethod();
        window.frameRate(30);
      }

      // Draw the user's code if lights are on, otherwise draw a black screen.
      if (this.lightsOn) {
        window.draw = function () {
          // eslint-disable-next-line no-undef
          background(0);
          userDefinedDrawMethod();
          const previewSamples = window.illuminationsSampling();
          window.illuminationsPreview(previewSamples);
        }
      } else {
        window.draw = function () {
          // eslint-disable-next-line no-undef
          background(0);
          const previewSamples = window.illuminationsSampling();
          window.illuminationsPreview(previewSamples);

        }
      }

      // Load P5 in on-demand global mode
      window.illuminationsP5 = new window.p5();
      window.illuminationsP5.pixelDensity(1);
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
    },
    numLights: {
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
