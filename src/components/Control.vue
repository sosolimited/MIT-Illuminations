<template>
  <v-card :disabled="readonly" class="mx-20" elevation="2" height="100%" width="300">
    <v-card-subtitle class="pa-0 mx-2 mt-4 font-weight-bold">
      {{ controlObj.name }} {{ controlIsUsedInCode ? '' : ' (unused)' }}
    </v-card-subtitle>
    <v-card-subtitle
        v-if="controlObj.type.toLowerCase() !== 'image'"
        class="pa-0 mx-2 mb-4"
    >
      {{ `controls.${controlObj.id}.value = ${controlObj.value}` }}
    </v-card-subtitle>
    <v-card-subtitle v-else class="pa-0 mx-2 mb-4">
      {{ `p5.loadControlImage(controls.${controlObj.id}.value)` }}
    </v-card-subtitle>

    <!-- COLOR PICKER -->
    <v-color-picker
        v-if="controlObj.type.toLowerCase() === 'color'"
        :value="controlObj.value"
        @input="updateControlValue"
    ></v-color-picker>

    <!-- NUMBER SLIDER -->
    <v-row v-if="controlObj.type.toLowerCase() === 'number'">
      <v-col cols="1">
        <span class="minNumberLabel"> Min: {{ controlObj.min }} </span>
      </v-col>
      <v-col cols="10">
        <v-slider
            :max="controlObj.max"
            :min="controlObj.min"
            :step="controlObj.step"
            :value="controlObj.value"
            dense
            @end="updateControlValue"
        ></v-slider>
      </v-col>
      <v-col cols="1">
        <span class="maxNumberLabel"> Max: {{ controlObj.max }} </span>
      </v-col>
    </v-row>

    <!-- IMAGE UPLOADER -->
    <v-img
        v-if="controlObj.type.toLowerCase() === 'image'"
        :src="assetSrc"
        class="mt-5 mb-2"
    >
    </v-img>
    <v-file-input
        v-if="controlObj.type.toLowerCase() === 'image'"
        :clearable="true"
        accept=".png"
        class="mx-3"
        dense
        prepend-icon="mdi-file-upload"
        showsize
        @change="copyAsset"
    ></v-file-input>

    <!-- Card Description -->
    <v-card-subtitle v-if="controlObj.description" class="pa-0 mx-2">
      {{ controlObj.description }}
    </v-card-subtitle>

    <v-card-actions>
      <v-btn
          :disabled="controlIsUsedInCode"
          color="red"
          small
          text
          @click="deleteUnusedControl"
      >
        Delete control
      </v-btn>
    </v-card-actions>

  </v-card>
</template>

<script>
import {nanoid} from 'nanoid'

export default {
  name: 'Control',
  props: {
    controlObj: {
      type: Object,
      required: true
    },
    controlIsUsedInCode: {
      type: Boolean,
      required: true
    },
    readonly: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    id() {
      return this.$route.params.id
    },
    assetSrc() {
      return `asset://${this.controlObj.value}`;
    }
  },
  methods: {
    updateControlValue(val) {
      this.$emit('updateControlValue', val, this.controlObj.id);
    },
    deleteUnusedControl() {
      this.$emit('deleteUnusedControl');
    },
    copyAsset(src) {
      const newId = nanoid(10);
      window.fse.copyAsset(src.path, newId).then((status) => {
        if (status) {
          setTimeout(() => {
            this.$emit('updateControlValue', `${newId}.png`, this.controlObj.id);
          }, 1000);
        } else {
          alert("This image was unable to be imported, please try again.");
        }
      });
    }
  }
}
</script>

<style>
.minNumberLabel {
  position: absolute;
  left: 10px;
  overflow: hidden;
  margin-top: 25px;
  padding: 0;
  color: gray;
  font-size: 14px;
}

.maxNumberLabel {
  position: absolute;
  right: 10px;
  overflow: hidden;
  margin-top: 25px;
  padding: 0;
  color: gray;
  font-size: 14px;
}
</style>
