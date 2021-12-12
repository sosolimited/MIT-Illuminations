<template>
    <v-card class="mx-20" width="300" elevation="2" height="100%" :disabled="readonly">
        <v-card-subtitle class="pa-0 mx-2 mt-4 font-weight-bold">
            {{ controlObj.name }} {{ controlIsUsedInCode ? '' : ' (unused)' }}
        </v-card-subtitle>
        <v-card-subtitle
            class="pa-0 mx-2 mb-4"
            v-if="controlObj.type.toLowerCase() != 'image'"
        >
            {{ `controls.${controlObj.id}.value = ${controlObj.value}` }}
        </v-card-subtitle>
        <v-card-subtitle class="pa-0 mx-2 mb-4" v-else>
            {{ `p5.loadControlImage(controls.${controlObj.id}.value)` }}
        </v-card-subtitle>

        <!-- COLOR PICKER -->
        <v-color-picker
            v-if="controlObj.type.toLowerCase() == 'color'"
            :value="controlObj.value"
            @input="updateControlValue"
        ></v-color-picker>

        <!-- NUMBER SLIDER -->
        <v-row v-if="controlObj.type.toLowerCase() == 'number'">
            <v-col cols="1">
                <span class="minNumberLabel"> Min: {{ controlObj.min }} </span>
            </v-col>
            <v-col cols="10">
                <v-slider
                    dense
                    :min="controlObj.min"
                    :max="controlObj.max"
                    :step="controlObj.step"
                    :value="controlObj.value"
                    @end="updateControlValue"
                ></v-slider>
            </v-col>
            <v-col cols="1">
                <span class="maxNumberLabel"> Max: {{ controlObj.max }} </span>
            </v-col>
        </v-row>

        <!-- IMAGE UPLOADER -->
        <v-img
            class="mt-5 mb-2"
            v-if="controlObj.type.toLowerCase() == 'image'"
            :src="assetSrc"
        >
        </v-img>
        <v-file-input
            v-if="controlObj.type.toLowerCase() == 'image'"
            accept=".png"
            class="mx-3"
            :clearable="false"
            dense
            prepend-icon="mdi-file-upload"
            @change="copyAsset"
        ></v-file-input>

      <!-- Card Description -->
      <v-card-subtitle class="pa-0 mx-2" v-if="controlObj.description">
        {{ controlObj.description }}
      </v-card-subtitle>

        <v-card-actions>
            <v-btn
                :disabled="controlIsUsedInCode"
                small
                text
                color="red"
                @click="deleteUnusedControl"
            >
                Delete control
            </v-btn>
        </v-card-actions>

    </v-card>
</template>

<script>
import { nanoid } from 'nanoid'

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
        userUploadsPath() {
            return this.$store.state.userUploadsPath
        },
        assetSrc() {
            return this.$store.getters.assetUrl(this.controlObj.value)
        }
    },
    methods: {
        updateControlValue(val) {
            this.$emit('updateControlValue', val, this.controlObj.id)
            console.log('[control] new control value')
        },
        deleteUnusedControl() {
            this.$emit('deleteUnusedControl')
            console.log(`[control] delete unused control ${this.controlObj.id}`)
        },
        copyAsset(src) {
            const newId = nanoid(10)
            const fse = window.fse
            fse.copyAsset(src.path, newId)
            // TODO: Make sure this emit happens *after* copyAsset completes.
            // Can copyAsset take a cb function as a parameter?
            setTimeout(
                () =>
                    this.$emit('updateControlValue', `${newId}.png`, this.controlObj.id),
                2000
            )
            // this.updateControlValue(newId)
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
