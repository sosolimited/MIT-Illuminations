<template>
  <v-app id="app">
    <Header/>
    <canvas id="previewDisplay" width="1920" height="160" style="width: 100%; aspect-ratio: 1920/160; background-color: #e7e7e7;"></canvas>
    <v-bottom-navigation v-model="previewMode" background-color="#d7eaee" color="#292a3c" elevation="1" horizontal style="width: 100%; box-shadow: none; margin-bottom: 20px">
      <v-btn>
        <span>Light Preview</span>
        <v-icon>mdi-lightbulb-group-outline</v-icon>
      </v-btn>

      <v-btn>
        <span>Sampled Points</span>
        <v-icon>mdi-eyedropper-variant</v-icon>
      </v-btn>

      <v-btn>
        <span>P5 Code Output</span>
        <v-icon>mdi-code-json</v-icon>
      </v-btn>

    </v-bottom-navigation>
    <div id="content">
      <router-view id="content"></router-view>
      <PlayingNow/>
    </div>
  </v-app>
</template>

<style scoped>
.theme--light.v-bottom-navigation .v-btn:not(.v-btn--active) {
  color: rgba(0, 0, 0, 0.2) !important;
}
</style>

<script>
import Header from './components/Header.vue'
import PlayingNow from './components/PlayingNow.vue'

export default {
  name: 'App',
  components: {
    Header,
    PlayingNow
  },
  data() {
    return {
      //
    }
  },
  mounted() {
    // Maintenance of the Vuex store depends on the Vue component destroy lifecycle.
    // There are some conditions in which the electron app closes, and Vue
    // does not properly get destroyed. This leaves tmp show data in the store.
    // When the app opens, we remove any tmp data that was not properly destroyed.
    this.$store.commit('removeTmpShows')
  },
  computed: {
    // Store values to watch
    playingNow() {
      return this.$store.state.playingNow
    },
    lightsOn() {
      return this.$store.state.lightsOn
    },
    previewMode: {
      get() {
        return this.$store.state.previewMode
      },
      set(value) {
        this.$store.commit('updatePreviewMode', value)
      }
    }
  },
  watch: {
    //
  }
}
</script>

<style>
#app {
  padding: 0;
  background-color: #F8F8F8;
  max-width: 100vw;
  overflow-x: hidden;
}

#content {
  width: 100%;
  margin: 0 auto;
  background-color: transparent;
  max-width: 1920px;
  padding: 0 40px;
  min-width: 1000px;
}

@media only screen and (max-width: 1400px) {
  #content {
    padding: 0;
  }
}
</style>
