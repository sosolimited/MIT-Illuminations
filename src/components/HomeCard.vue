<template>
  <v-card v-if="!show.deleted" class="preview-card" style="width:100%">
    <!-- Thumbnail -->
    <v-img
        :src="`asset://${thumbnail}`"
        class="card-image"
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
    <v-card-title class="d-block text-truncate card-title" style="font-size: 16px !important; font-weight: 500 !important; max-width: 100%">{{
        title
      }}
    </v-card-title>
    <!-- Description -->
    <v-card-text class="card-description">{{ description }}</v-card-text>
    <v-card-actions>
      <!-- Actions -->
      <v-btn color="indigo lighten-2" small text @click="routeToEditor"
      >Edit Show
      </v-btn
      >
      <v-spacer></v-spacer>
      <!-- Tags -->
      <v-icon v-if="show.info.favorite" class="pr-2" small
      >mdi-heart
      </v-icon
      >
      <v-icon v-else class="pr-2" small>mdi-heart-outline</v-icon>
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
    lightsOn() {
      return this.$store.state.lightsOn
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
  margin: 0 30px 30px 0;
  display: inline-block;
}

.card-image {
  border-radius: 0;
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
