<template>
  <v-app-bar id="header" color="white" elevation="1" height="60">
    <div style="display: flex; align-items: center; cursor: pointer;" v-on:click="returnToHome()">
      <img alt="MIT Logo (SVG)" class="header__logo" src="https://illuminations.mit.edu/assets/images/logo.svg">
    </div>
    <v-spacer></v-spacer>
    <v-btn text @click="toggleLightsStatus" style="font-size: 12px !important; font-weight: bold !important;">
      <v-icon v-if="status">mdi-electric-switch-closed</v-icon>
      <v-icon v-else>mdi-electric-switch</v-icon>
      <span id="lights-text">Lights {{ status ? 'On' : 'Off' }}</span>
    </v-btn>
    <SettingsPanel />
    <v-btn text @click="exitApplication" style="font-size: 12px !important; font-weight: bold !important;">
      <v-icon>mdi-cancel</v-icon>
      <span id="exit-text">Exit</span>
    </v-btn>
  </v-app-bar>
</template>

<script>

import SettingsPanel from "@/components/SettingsPanel";

export default {
  name: 'Header',
  components: {
    SettingsPanel
  },
  computed: {
    status() {
      return this.$store.state.lightsOn
    },
    statusText() {
      return this.status ? 'on' : 'off'
    },
    textOpacity() {
      return {
        opacity: this.status ? '1' : '.5'
      }
    }
  },
  methods: {
    toggleLightsStatus() {
      this.$store.commit('toggleLightsStatus')
    },
    returnToHome() {
      this.$router.push({name: 'home'});
    },
    exitApplication() {
      window.close();
    }
  }
}
</script>

<style scoped>
#header {
  padding: 0 60px;
  -webkit-user-select: none;
  -webkit-app-region: drag;
}

#header * {
  -webkit-app-region: no-drag;
}

#lights-text {
  margin-left: 10px;
}

#exit-text {
  margin-left: 10px;
}

.header__logo {
  width: 140px;
}
</style>
