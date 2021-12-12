<template>

  <v-row id="content" class="justify-space-around">

    <!-- Playing Now -->
    <v-col cols="12" md="4" lg="3">
      <v-card flat color="grey lighten-5" id="playing-now" max-width="300">
        <v-card-title>Playing now</v-card-title>
        <!-- Playing now card -->
        <HomeCard :show="activeShow"/>
        <!-- New show button -->
        <v-btn class="mb-4" @click="createShowAndReroute" small color="primary"
        >Create show
        </v-btn
        >
      </v-card>
    </v-col>

    <!-- Library -->
    <v-col cols="12" md="7" lg="8">
      <v-card flat id="library" class="ma-0" style="background-color: transparent;">
        <v-card-title class="library-title">
          <!-- Library title -->
          {{ homeFilter }}

          <v-spacer></v-spacer>
          <!-- Library filter -->
          <v-menu bottom left>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon small v-bind="attrs" v-on="on" class="mr-2">
                <v-icon color="black">mdi-filter-variant</v-icon>
              </v-btn>
            </template>
            <v-list>
              <!-- <v-list-item-group> -->
              <v-list-item
                  v-for="(item, i) in filterOptions"
                  :key="i"
                  :value="homeFilter"
              >
                <v-list-item-content>
                  <v-list-item-title
                      @click="setHomeFilter(item)"
                  >{{ item }}
                  </v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
              <!-- </v-list-item-group> -->
            </v-list>
          </v-menu>

          <!-- Library sorter -->
          <v-menu bottom left>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon small v-bind="attrs" v-on="on" class="mr-6">
                <v-icon color="black"
                >mdi-sort-alphabetical-ascending
                </v-icon
                >
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                  v-for="(item, i) in sortOptions"
                  :key="i"
                  :value="homeSort"
              >
                <v-list-item-title @click="setHomeSort(item)">{{
                    item
                  }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-card-title>
        <v-row>
          <v-col cols="12" sm="6" lg="4" xl="3" v-for="(show, index) in shows" :key="index">
            <HomeCard :show="show"/>
          </v-col>
        </v-row>

      </v-card>
    </v-col>
  </v-row>

</template>

<script>
import HomeCard from '../components/HomeCard.vue'
import router from '../router'
import {nanoid} from 'nanoid'
import {boilerplate} from '../starterPack'

export default {
  name: 'Home',
  components: {
    HomeCard
  },
  mounted() {
    this.setHomeFilter(this.filterOptions[0]); // 'All shows'
    this.$store.commit('sortShows');
    this.$store.commit('restorePublishedShow');
  },
  data() {
    return {
      filterOptions: ['All shows', 'Templates', 'Favorites'],
      filterHighlight: 0,
      sortOptions: [
        'Sort by title',
        'Sort by last played',
        'Sort by last modified'
      ]
    }
  },
  computed: {
    shows() {
      return this.$store.getters.filteredShows
    },
    activeShow() {
      return this.$store.state.playingNow
    },
    homeFilter() {
      return this.$store.state.homeFilter
    },
    homeSort() {
      return this.$store.state.homeSort
    }
  },
  methods: {
    createShowAndReroute() {
      // Set up the official store version
      const storeId = nanoid(10)
      const template = {
        id: storeId,
        info: {
          title: 'New Show',
          description: 'Subtitle...',
          longDescription: 'Website description...',
          thumbnail: 'blank.png',
          favorite: false
        },
        code: boilerplate,
        controls: {},
        template: false,
        deleted: false,
        lastModified: new Date().getTime(),
        lastPlayed: 0
      }
      this.$store.commit('setEditingNowId', storeId)
      this.$store.commit('createShow', template)

      // Route to the Preview view
      router.push({name: 'preview', params: {id: storeId}})
    },
    setHomeFilter(filter) {
      this.$store.commit('setHomeFilter', filter)
    },
    setHomeSort(sort) {
      // TODO(Anna): combine these mutations, as they always happen
      // together.
      this.$store.commit('setHomeSort', sort)
      this.$store.commit('sortShows')
    }
  }
}
</script>

<style>

.v-select.v-text-field input {
  width: 0;
}

canvas.p5Canvas {
  visibility: hidden;
  width: 0;
  height: 0;
  position: fixed;
  top: -2000px;
  bottom: -2000px;
}

h1, h2, h3, h4, h5, h6, .v-card__title, .v-card__text {
  cursor: default;
  user-select: none;
}

</style>
