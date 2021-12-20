<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
            :disabled="readonly"
            class="mr-4 mt-8"
            small
            text
            outlined
            v-bind="attrs"
            v-on="on"
        >
          New Control
        </v-btn>
      </template>
      <v-card elevation="10">
        <v-card-title>
          <span class="text-h5 mb-2">Add a New Control</span>
        </v-card-title>
        <v-card-subtitle>Controls make it easy to modify parameters of your code in real-time.</v-card-subtitle>
        <v-card-text>
          <v-form ref="controlForm" v-model="valid">
            <v-container class="mt-5">
              <v-row>
                <!-- Control type -->
                <v-col cols="6">
                  <v-select
                      :items="['Color', 'Number', 'Image']"
                      label="Control type"
                      required
                      outlined
                      v-model="controlObj.type"
                  ></v-select>
                </v-col>

                <!-- Control name -->
                <v-col cols="6">
                  <v-text-field
                      label="Control name"
                      required
                      outlined
                      :hint="controlObj.name ? 'Use this variable in your code: controls.' + toCamelCase(controlObj.name) + '.value' : ''"
                      persistent-hint
                      v-model="controlObj.name"
                      :rules="rules.name"
                  ></v-text-field>
                </v-col>

                <!-- Number-specific -->
                <v-col cols="4" v-if="controlObj.type.toLowerCase() ==='number'">
                  <v-text-field
                      type="number"
                      label="Minimum"
                      hint="The minimum allowed value"
                      v-model="controlObj.min"
                      required
                  ></v-text-field>
                </v-col>
                <v-col cols="4" v-if="controlObj.type.toLowerCase() ==='number'">
                  <v-text-field
                      type="number"
                      label="Maximum"
                      hint="The maximum allowed value"
                      v-model="controlObj.max"
                      required
                  ></v-text-field>
                </v-col>
                <v-col cols="4" v-if="controlObj.type.toLowerCase() ==='number'">
                  <v-text-field
                      type="number"
                      label="Step"
                      hint="The step between allowed values"
                      v-model="controlObj.step"
                      required
                  ></v-text-field>
                </v-col>

                <!-- Control description -->
                <v-col cols="12">
                  <v-text-field
                      label="Description"
                      v-model="controlObj.description"
                      hint="Add some notes to help people understand how this control impacts the code (optional)"
                      persistent-hint
                      outlined
                  ></v-text-field>
                </v-col>

              </v-row>

            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="saveAndClose" :disabled="!valid">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  name: 'ControlForm',
  props: {
    readonly: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      dialog: false,
      controlObj: {
        type: 'Color',
        name: '',
        description: '',
        id: '',
        value: null,
        min: null,
        max: null,
        step: null
      },
      valid: false,
      rules: {
        name: [
          (v) => !!v || 'Name is required.',
          (v) => /^[A-z]/.test(v) || 'Name must begin with a letter.',
          (v) =>
              /^[A-z0-9_ ]+$/.test(v) ||
              'Name can include letters, numbers, spaces, and underscores.'
        ]
      }
    }
  },
  computed: {
    showId() {
      return this.$route.params.id
    },
    value() {
      if (this.controlObj.type.toLowerCase() === 'color') {
        return '#EC3131'
      } else if (this.controlObj.type.toLowerCase() === 'image') {
        return 'gray'
      } else {
        return Math.round((this.controlObj.min + this.controlObj.max) / 30) || 0
      }
    }
  },
  methods: {
    validate() {
      this.$refs.controlForm.validate()
    },
    resetValidation() {
      this.$refs.controlForm.resetValidation()
    },
    toCamelCase(str) {
      return str.replace(
          /^\w|[A-Z]|\b\w|\s+/g,
          function (match, index) {
            if (+match === 0) return ''
            return index === 0
                ? match.toLowerCase()
                : match.toUpperCase()
          }
      )
    },
    close() {
      this.dialog = false
      this.controlObj = {
        type: 'Color',
        name: '',
        id: '',
        value: null
      }
    },
    saveAndClose() {
      this.controlObj.id = this.toCamelCase(this.controlObj.name)
      this.controlObj.type = this.controlObj.type.toLowerCase()
      this.controlObj.value = this.value
      this.$store.commit('addControl', {
        controlObj: this.controlObj,
        id: this.showId
      })
      this.$emit('newControlAdded')
      this.close()
    }
  }
}
</script>
