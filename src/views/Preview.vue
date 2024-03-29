<!--suppress ES6CheckImport -->
<template>

  <v-row id="content" class="justify-space-around" v-if="ready">

    <!-- Show Details Section -->
    <v-col cols="12" md="4" lg="3">
      <v-card flat max-width="300" color="transparent" id="preview-card">

        <!-- Back to library -->
        <v-btn @click="routeToLibrary" small class="my-5" color="primary">Back to library</v-btn>

        <v-card-title>Show Details</v-card-title>

        <v-card class="preview-card mb-5">

          <!-- Show Thumbnail -->
          <v-img class="card-image" :src="thumbnailSrc"></v-img>

          <!-- Template Label-->
          <div v-if="show.template" class="text-overline ma-1 px-3 template-label">
            TEMPLATE
          </div>

          <!-- Show Title -->
          <v-card-title class="d-inline-block text-truncate card-title" style="max-width: 100%;">{{ show.info.title }}</v-card-title>
          <!-- Show Description -->
          <v-card-text class="clamp-card-description">{{ show.info.description }}</v-card-text>

          <!-- Show Actions -->
          <v-card-actions>

            <!-- Edit Show Info -->
            <v-btn @click="openAndScrollToInfoEditor" color="indigo lighten-2" text small>Edit Details</v-btn>
            <v-spacer></v-spacer>

            <!-- Tags -->
            <v-icon v-if="show.template" small class="pr-2">mdi-lock</v-icon>
            <v-icon v-if="show.info.favorite" small class="pr-2">mdi-heart</v-icon>
            <v-icon v-else small class="pr-2">mdi-heart-outline</v-icon>

          </v-card-actions>

        </v-card>


        <!-- Copy To New Show -->
        <v-btn small @click="saveToNew" class="mt-5">Copy to New Show</v-btn>

        <!-- Delete show -->
        <div>
          <v-dialog v-model="deleteShowDialog" width="500">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                  :disabled="show.template || isPublishedShow"
                  small
                  class="my-4"
                  color="error"
                  v-bind="attrs"
                  v-on="on"
              >
                Delete Show
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                Are you sure you want to delete this show?<br/>It
                cannot be undone.
              </v-card-title>
              <v-divider></v-divider>
              <v-card-actions>
                <v-btn
                    color="primary"
                    text
                    @click="deleteShowDialog = false"
                >
                  No, keep it.
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="deleteOriginal">
                  Yes, delete it.
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>

      </v-card>
    </v-col>

    <!-- Editor Window -->
    <v-col cols="12" md="7" lg="8">
      <v-card flat id="preview-editor" style="background-color: transparent;">

        <!-- Editor Title / Action Bar -->
        <v-card-title class="mb-3">

          Editor
          <v-spacer></v-spacer>

          <!-- Save-->
          <v-btn :disabled="show.template || unsavedChanges === false" @click="pushShowToLights(false)" small class="ml-4">Save / Preview</v-btn>

          <!-- Publish to Lights -->
          <v-btn :disabled="(this.editingNowId === this.lastPublishedShowId) && unsavedChanges === false " @click="pushShowToLights(true)" small class="ml-4" color="primary"> {{ uploadToLightsText }}</v-btn>


        </v-card-title>

        <!-- Important Notices -->
        <v-alert dense type="info" v-if="templateMessage !== ''">
          {{ templateMessage }}
        </v-alert>

        <!-- Editor Panel -->
        <v-card>

          <!-- User-Defined Show Controls -->
          <v-btn text class="ma-2" @click="toggleControlsVisibility">
            Controls
            <v-icon v-if="unsavedControl">mdi-circle-medium</v-icon>
            <v-icon> {{ isComponentVisible.controls ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
          </v-btn>

          <v-row v-show="isComponentVisible.controls">
            <v-col cols="10">
              <div id="controls-container">
                <Control
                    v-for="controlObj in controls"
                    :key="controlObj.id"
                    :readonly="readonly"
                    :controlObj="controlObj"
                    :controlIsUsedInCode="
                                    controlIsUsedInCode[controlObj.id]
                                "
                    @updateControlValue="updateControlValue"
                    @deleteUnusedControl="
                                    deleteUnusedControl(controlObj.id)
                                "
                />
              </div>
            </v-col>
            <v-col cols="2">
              <ControlForm v-on:newControlAdded="newControlAdded" :readonly="readonly"/>
            </v-col>
          </v-row>

          <v-divider class="mx-2"></v-divider>

          <!-- CODE -->
          <v-btn text class="ma-2" @click="toggleCodeVisibility">
            Code
            <v-icon v-if="unsavedCode">mdi-circle-medium</v-icon>
            <v-icon>{{
                isComponentVisible.code ? 'mdi-chevron-up' : 'mdi-chevron-down'
              }}
            </v-icon>
          </v-btn>
          <div v-show="isComponentVisible.code">
            <div>
              <div class="console-more">
                <v-btn
                    class="mx-5 mt-0"
                    small
                    text
                    outlined
                    @click="toggleConsoleInfoVisibility"
                >
                                <span v-if="!isComponentVisible.consoleInfo" class="mr-2"
                                ><v-icon>mdi-chevron-left</v-icon>Help</span>
                  <v-icon v-else>mdi-chevron-right</v-icon>
                </v-btn>
              </div>
            </div>

            <v-card class="ma-5 pa-0 editor-and-console" flat outlined>
              <v-row no-gutters>
                <v-col :cols="isComponentVisible.consoleInfo ? 8 : 12">
                  <v-card tile class="ma-0 pa-0" flat>
                    <codemirror
                        :options="cmOptions"
                        v-model="codeEditor"
                        :style="{opacity: this.readonly ? '0.3' : '1', 'pointer-events': this.readonly ? 'none' : 'all'}"
                    />
                  </v-card>
                </v-col>
                <v-col
                    cols="4"
                    v-if="
                                    isComponentVisible.consoleInfo
                                "
                >
                  <v-card
                      tile
                      class="ma-0 pa-2 help"
                      flat
                      color="grey lighten-4"
                  >
                    <HelpDesk/>
                  </v-card>
                </v-col>
              </v-row>
            </v-card>
          </div>

          <v-divider class="mx-2"></v-divider>

          <!-- INFO EDITOR -->
          <v-btn
              text
              class="ma-2"
              @click="toggleInfoVisibility"
              id="info"
          >
            Info & Credits
            <v-icon v-if="unsavedInfo">mdi-circle-medium</v-icon>
            <v-icon>{{
                isComponentVisible.info ? 'mdi-chevron-up' : 'mdi-chevron-down'
              }}
            </v-icon>
          </v-btn>
          <v-form v-show="isComponentVisible.info" :disabled="readonly">
            <v-row class="mx-4">
              <v-col cols="2">
                <p class="form-field">Title</p>
              </v-col>
              <v-col cols="3">
                <v-text-field
                    v-model="show.info.title"
                    outlined dense
                    hint="Enter the title of the show"
                    :rules="[infoValidation.titleCharLimit]"
                    counter
                    @focus="unsavedInfo = true"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row class="mx-4">
              <v-col cols="2">
                <p class="form-field">Subtitle</p>
              </v-col>
              <v-col cols="3">
                <v-textarea
                    v-model="show.info.description"
                    outlined dense
                    rows="3"
                    no-resize
                    :rules="[infoValidation.shortDescriptionCharLimit]"
                    counter
                    maxlength="75"
                    hint="Enter a subtitle for the show"
                    @focus="unsavedInfo = true"
                ></v-textarea>
              </v-col>
            </v-row>

            <v-row class="mx-4">
              <v-col cols="2">
                <p class="form-field">Cover Image</p>
              </v-col>
              <v-col cols="3">
                <v-img
                    class="card-img-thumb"
                    :src="thumbnailSrc"
                ></v-img>
                <v-file-input
                    accept=".png"
                    :clearable="false"
                    prepend-icon=""
                    label="Upload a PNG..."
                    @change="updateThumbnailAsset"
                    outlined
                    dense
                    class="card-img-input"
                    :messages="['Only PNG images are currently supported.']"
                ></v-file-input>
              </v-col>
            </v-row>

            <v-row class="mx-4">
              <v-col cols="2">
                <p class="form-field">Tags</p>
              </v-col>
              <v-col cols="3">
                <v-checkbox
                    class="ma-0"
                    v-model="show.info.favorite"
                    label="Mark as a favorite"
                    @change="unsavedInfo = true"
                ></v-checkbox>
              </v-col>
            </v-row>

          </v-form>
        </v-card>
      </v-card>
    </v-col>

  </v-row>

</template>

<script>

/////////////
// Imports //
/////////////

// General Utilities
import router from '../router'
import {nanoid} from 'nanoid'

// P5 and Configuration
import helpers from '../config/p5helpers.config'

// Code Editor IDE (CodeMirror)
import {codemirror} from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/eclipse.css'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/addon/display/autorefresh.js'

// User-Defined Show Controls
import Control from '../components/Control.vue'
import ControlForm from '../components/ControlForm.vue'
import HelpDesk from '../components/HelpDesk'

export default {
  name: 'Preview',
  components: {
    codemirror,
    Control,
    ControlForm,
    HelpDesk
  },
  data() {
    return {
      show: null,
      ready: false,
      editingCard: false,
      deleteShowDialog: false,
      isComponentVisible: {
        lights: true,
        controls: false,
        code: true,
        info: false,
        consoleInfo: false,
        consoleHelp: true
      },
      codeEditor: null,
      isCodeRunning: true,
      helpers: helpers,
      logs: [],
      lastSavedCodeVersion: null,
      consoleLogBasic: window.console.log,
      consoleErrorBasic: window.console.error,
      unsavedCode: false,
      unsavedControl: false,
      unsavedInfo: false,
      infoValidation: {
        titleCharLimit: value => (value && value.length <= 30) || 'Yikes, that\'s a long title',
        shortDescriptionCharLimit: value => (value && value.length <= 75) || 'Max 75 characters',
        longDescriptionCharLimit: value => (value && value.length <= 250) || 'Max 250 characters',
      }
    }
  },
  mounted() {
    this.show = JSON.parse(JSON.stringify(this.$store.getters.showById(this.id)));
    this.codeEditor = this.code; // Assign the CodeMirror IDE to use the show's code
    this.lastSavedCodeVersion = this.code;
    this.ready = true;

    this.$nextTick(() => {
      this.pushShowToLights(false, true);
    })
  },
  computed: {
    id() {
      return this.$route.params.id
    },
    editingNowId() {
      return this.$store.state.editingNowId
    },
    playingNowId() {
      return this.$store.state.playingNow ? this.$store.state.playingNowId : null
    },
    readonly() {
      return this.show.template
    },
    cmOptions() {
      return {
        tabSize: 4,
        indentUnit: 4,
        mode: 'text/javascript',
        theme: 'eclipse',
        lineNumbers: true,
        line: true,
        readOnly: this.readonly,
        autoRefresh: true,
        gutters: ["CodeMirror-lint-markers"],
        lint: true
      }
    },
    thumbnail() {
      return this.$store.getters.showById(this.id).info.thumbnail
    },
    thumbnailSrc() {
      return `asset://${this.thumbnail}`;
    },
    isPublishedShow() {
      if (this.$store.state.lastPublishedShow === null) {
        return false;
      }
      return this.editingNowId === this.lastPublishedShowId || this.id === this.lastPublishedShowId;
    },
    uploadToLightsText() {
      return this.unsavedChanges
          ? 'Save & Publish'
          : 'Publish'
    },
    code() {
      // Used only to seed the component's codeEditor and runningCode data
      // objects. If the show is saved, the codeEditor will be committed
      // to the official store code.
      return this.$store.getters.showById(this.id).code
    },
    controls() {
      return this.$store.getters.showById(this.id).controls
    },
    previewingCardStyle() {
      return {
        marginRight: '140px'
      }
    },
    lightsOn() {
      return this.$store.state.lightsOn
    },
    unsavedChanges() {
      return this.unsavedCode || this.unsavedControl || this.unsavedInfo
    },
    controlIsUsedInCode() {
      let result = {}
      for (const controlId in this.controls) {
        result[controlId] = this.codeEditor.includes(
            `controls.${controlId}`
        )
      }
      return result
    },
    /**
     * Display a message telling the user to duplicate the show, if it's a template.
     * @returns {string}
     */
    templateMessage() {
      if (this.show.template) {
        return 'To start using this template, click on "Copy to New Show" on the left.';
      }
      return '';
    },
    lastPublishedShowId() {
      return this.$store.state.lastPublishedShow ? this.$store.state.lastPublishedShow.id : null;
    }
  },
  methods: {

    /**
     * Take us home, Jim.
     */
    routeToLibrary() {
      router.push({name: 'home'})
    },

    /**
     * Delete the current show
     */
    deleteOriginal() {
      this.deleteShowDialog = false
      this.$store.commit('deleteShow', this.editingNowId)
      this.$store.commit('deleteShow', this.id)
      router.push({name: 'home'})
    },

    /**
     * Save the show to the library, and update the store.
     */
    saveToOriginal() {
      this.show.info.thumbnail = this.thumbnail
      this.$store.commit('saveToOriginal', {
        id: this.id,
        info: this.show.info,
        controls: this.controls,
        code: this.codeEditor
      });
      this.lastSavedCodeVersion = this.codeEditor
      this.unsavedCode = this.codeEditor !== this.lastSavedCodeVersion;
      this.unsavedControl = false
      this.unsavedInfo = false
    },

    /**
     * Copy the existing show to a new show, and navigate there.
     */
    saveToNew() {
      const newId = nanoid(10);
      let newShow = JSON.parse(JSON.stringify(this.show));
      newShow.template = false;
      newShow.info.favorite = false;
      newShow.info.thumbnail = "blank.png";
      newShow.info.title = `Copy of ${this.show.info.title}`;
      this.$store.commit('createCopy', {show: newShow, id: newId});
      this.$store.commit('setEditingNowId', newId);
      router.push({name: 'preview', params: {id: newId}});
    },


    /**
     * Takes the show in the editor, saves it, and uploads it to the illuminationsPreview window and live lights output
     * @param publishShow Whether or not to set this show as the active "published" show (or just display it)
     * @param initialMount Whether or not this is the initial mount of the show, in which case, don't clear errors.
     */
    pushShowToLights(publishShow = false, initialMount = false) {
      this.saveToOriginal();
      this.$store.commit('uploadToLights', this.id);
      if (publishShow) {
        this.$store.commit('setLastPublishedShow', this.id);
      }
      if (this.id === this.$store.state.errorID && !initialMount) {
        if (this.$store.state.lastPublishedShow) {
          if (this.id === this.$store.state.lastPublishedShow.id) {
            this.$store.commit('setLastPublishedShow', this.id);
          }
        }
        this.$store.commit('clearError');
      }
    },

    /**
     * Opens the informational panel for the show.
     */
    openAndScrollToInfoEditor() {
      this.isComponentVisible.lights = false
      this.isComponentVisible.controls = false
      this.isComponentVisible.code = false
      this.isComponentVisible.info = true
      this.$vuetify.goTo('#info')
    },

    /**
     * Updates the thumbnail for the show.
     * @param src
     */
    updateThumbnailAsset(src) {
      const newId = nanoid(10);
      const fse = window.fse;
      fse.copyAsset(src.path, newId);
      setTimeout(() =>
              this.$store.commit('updateThumbnail', {
                src: `${newId}.png`,
                id: this.show.id
              }),
          1000
      );
    },

    /**
     * Opens the controls panel for the show.
     */
    toggleControlsVisibility() {
      this.isComponentVisible.controls = !this.isComponentVisible.controls
    },

    /**
     * Opens the code panel for the show.
     */
    toggleCodeVisibility() {
      this.isComponentVisible.code = !this.isComponentVisible.code
    },

    /**
     * Opens the informational panel for the show.
     */
    toggleInfoVisibility() {
      this.isComponentVisible.info = !this.isComponentVisible.info
    },

    /**
     * Opens the help/console panel for the show.
     */
    toggleConsoleInfoVisibility() {
      this.isComponentVisible.consoleInfo = !this.isComponentVisible.consoleInfo
    },

    /**
     * Updates a control's value in the store.
     * @param val
     * @param controlId
     */
    updateControlValue(val, controlId) {
      this.$store.commit('updateControlValue', {
        controlId: controlId,
        controlValue: val,
        showId: this.id
      })
      this.unsavedControl = true;
    },

    /**
     * Removes an unused control from the store.
     * @param controlId
     */
    deleteUnusedControl(controlId) {
      this.$store.commit('deleteUnusedControl', {
        controlId: controlId,
        showId: this.id
      })
      this.isComponentVisible.controls = false
      this.isComponentVisible.controls = true
      this.unsavedControl = true
    },

    /**
     * Adds a new control to the store.
     */
    newControlAdded() {
      this.isComponentVisible.controls = false
      this.isComponentVisible.controls = true
      this.unsavedControl = true
    }

  },
  watch: {

    /**
     * Watch for changes to the code editor, and update the store.
     */
    codeEditor: {
      handler() {
        this.unsavedCode = this.codeEditor !== this.lastSavedCodeVersion;
      }
    }

  }
}
</script>

<style>

canvas {
  z-index: 100;
}

.output {
  top: calc(50% - 50px);
}

/* Controls */
#controls-container {
  display: flex;
  flex-basis: 25%;
  gap: 40px;
  flex-wrap: wrap;
  margin: 10px 20px 20px 20px;
  min-height: 50px;
}

/* Codemirror */
.CodeMirror {
  height: 800px !important;
  font-size: 14px !important;
}

pre {
  white-space: pre-wrap;
}

.card-img-thumb {
  border-radius: 2px;
  width: 40px;
  float: left;
}

.card-img-input {
  width: calc(100% - 50px);
  float: right;
}

#code-header {
  margin: 0 8px;
}

.console-more {
  text-align: right;
}

.help {
  overflow-x: hidden;
  height: 800px;
  font-size: 14px;
}

.btnSelected {
  background-color: #eeeeee;
}

.form-field {
  line-height: 2em;
  float: right;
}

.card-title {
  height: 52px;
}

.clamp-card-description {
  height: 42px;
  margin-bottom: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  white-space: normal;
}

.card-image {
  border-radius: 0;
  height: 200px;
}

.template-label {
  background-color: rgba(255, 255, 255, 0.75);
  position: absolute;
  top: 5px;
  right: 5px;
  border-radius: 2px;
}

.template-label:hover {
  cursor: default;
}
</style>
