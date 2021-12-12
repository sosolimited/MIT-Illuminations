<template>
  <v-app-bar color="white" id="header" elevation="1" height="60">
    <div v-on:click="returnToHome()" style="display: flex; align-items: center; cursor: pointer;">
      <img src="https://upload.wikimedia.org/wikipedia/commons/0/0c/MIT_logo.svg" alt="MIT Logo (SVG)" class="header__logo">
      <div id="header-title">Illuminations — Turn P5 Code into Light Shows</div>
    </div>
    <v-spacer></v-spacer>
    <v-btn text @click="toggleLightsStatus">
      <v-icon v-if="status">mdi-electric-switch-closed</v-icon>
      <v-icon v-else>mdi-electric-switch</v-icon>
      <span id="lights-text"
      >Output {{ status ? 'Enabled' : 'Disabled' }}</span
      >
    </v-btn>
    <div style="display: none">
      <SettingsPanel></SettingsPanel>
    </div>
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
    returnToHome(){
      this.$router.push({name: 'home'});
    }
  }
}
</script>

<style scoped>
#header {
  padding: 0 60px;
}

#header-title {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  font-size: 1.3rem;
  font-weight: 500;
  letter-spacing: 0.0125em;
  line-height: 2rem;
  word-break: break-all;
  cursor: pointer;
}

#lights-text {
  margin-left: 10px;
}

.header__logo {
  width: 40px;
  margin-right: 15px;
}
</style>
