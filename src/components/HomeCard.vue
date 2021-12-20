<template>
  <v-card v-if="!show.deleted" class="preview-card" style="width:100%">
    <!-- Thumbnail -->
    <v-img
        class="card-image"
        :src="thumbnailSrc"
        @click="routeToEditor"
    ></v-img>
    <div
        v-if="show.template"
        class="text-overline ma-1 px-3 template-label"
        @click="routeToEditor"
    >
      TEMPLATE
    </div>
    <!-- Title -->
    <v-card-title class="d-block text-truncate card-title">{{
        title
      }}
    </v-card-title>
    <!-- Description -->
    <v-card-text class="card-description">{{ description }}</v-card-text>
    <v-card-actions>
      <!-- Actions -->
      <v-btn @click="routeToEditor" color="indigo lighten-2" text small
      >Edit Show
      </v-btn
      >
      <v-spacer></v-spacer>
      <!-- Tags -->
      <!-- <v-icon v-if="show.template" small class="pr-2">mdi-lock</v-icon> -->
      <v-icon v-if="show.info.favorite" small class="pr-2"
      >mdi-heart
      </v-icon
      >
      <v-icon v-else small class="pr-2">mdi-heart-outline</v-icon>
      <!-- <v-icon v-if="show.playing && lightsOn" small class="pr-2" color="indigo lighten-2">mdi-lightbulb-on-outline</v-icon>
      <v-icon v-if="show.playing && !lightsOn" small class="pr-2">mdi-lightbulb-on-outline</v-icon> -->
    </v-card-actions>
  </v-card>
</template>

<script>
import router from '../router'

export default {
  name: 'HomeCard',
  props: {
    show: {
      type: Object,
      required: true
    }
  },
  computed: {
    title() {
      return this.show.info.title
    },
    description() {
      return this.show.info.description
    },
    thumbnail() {
      return this.show.info.thumbnail
    },
    thumbnailSrc() {
      return this.$store.getters.assetUrl(this.thumbnail)
    },
    lightsOn() {
      return this.$store.state.lightsOn
    },
    userUploadsPath() {
      return this.$store.state.userUploadsPath
    }
  },
  methods: {
    routeToEditor() {
      this.$store.commit('setEditingNowId', this.show.id)
      router.push({name: 'preview', params: {id: this.show.id}})
    }
  }
}
</script>
<style scoped>
.preview-card {
  margin: 0px 30px 30px 0px;
  display: inline-block;
}

.card-image {
  border-radius: 0px;
  height: 200px;
}

.card-image:hover {
  cursor: pointer;
}

.card-title {
  height: 50px;
  font-size: 18px;
  width: 100%;
}

.card-description {
  height: 42px;
  margin-bottom: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  white-space: normal;
}

.card-tag {
  height: 1em;
  display: inline;
  float: right;
  margin-left: 5px;
}

#playing-icon {
  height: 10px;
  width: 10px;
  border-radius: 50%;
}

.template-label {
  background-color: rgba(255, 255, 255, 0.75);
  position: absolute;
  top: 5px;
  right: 5px;
  border-radius: 2px;
}

.template-label:hover {
  cursor: pointer;
}
</style>
