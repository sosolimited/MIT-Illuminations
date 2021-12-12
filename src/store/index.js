/////////////
// Imports //
/////////////

import Vue from 'vue';
import Vuex from 'vuex';
import qs from 'querystring';

import default_shows from '../starterPack/shows.js';

/////////////////////////
// Kinet Configuration //
/////////////////////////

// const kinet_config = require('@/config/kinet.config.js'); // Used if no config.js in local store

//////////////////////////////////
// Electron Store Configuration //
//////////////////////////////////

const electronStore = window.estore || false;

Vue.use(Vuex);

const store = new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    state: (electronStore ? electronStore.get('state') : false) || {
        // kinet: kinet_config[process.env.NODE_ENV],
        // eslint-disable-next-line no-undef
        userUploadsPath: qs.decode(location.search.slice(1)).userDataPath,
        lightsOn: true,
        draftCodeRunning: true,
        devOptions: {
            enabled: process.env.NODE_ENV !== 'production'
        },
        homeFilter: 'All shows',
        homeSort: 'Sort by last modified',
        previewMode: 0,
        playingNowWatcher: 0,
        // default to Simple Colors
        playingNow: default_shows.filter(show => show.id === '3p__CK7daF')[0],
        lastPublishedShow: default_shows.filter(show => show.id === '3p__CK7daF')[0],
        editingNowId: '3p__CK7daF',
        shows: default_shows,
        numLights: 30
    },
    mutations: {
        // Update the number of individual LEDs to output / preview
        updateNumLights(state, number) {
            state.numLights = number;
        },
        // Create copy for editing
        createCopy(state, packet) {
            const show = JSON.parse(JSON.stringify(packet.show));
            show.id = packet.id;
            show.tmp = false;
            state.shows.push(show);
        },
        createTmpCopy(state, packet) {
            const show = JSON.parse(JSON.stringify(packet.show));
            show.id = packet.id;
            show.tmp = true;
            state.shows.push(show);
        },
        deleteShow(state, id) {
            state.shows = state.shows.filter((show) => show.id !== id);
        },
        setEditingNowId(state, id) {
            state.editingNowId = id;
        },
        saveToOriginal(state, updates) {
            const show = state.shows.find(
                (show) => show.id === state.editingNowId
            )
            show.info = JSON.parse(JSON.stringify(updates.info));
            show.controls = JSON.parse(JSON.stringify(updates.controls));
            show.code = updates.code;
            show.lastModified = new Date().getTime();
        },
        markShowAsPlaying(state) {
            // Unmark current selection
            const currentlyPlaying = state.shows.filter(
                (show) => show.playing
            )[0];
            currentlyPlaying.playing = false;
            // Mark new selection
            const newPlaying = state.shows.find(
                (show) => show.id === state.editingNowId
            )
            newPlaying.playing = true;
            newPlaying.lastPlayed = new Date().getTime();
        },
        uploadToLights(state) {
            const show = state.shows.find(
                (show) => show.id === state.editingNowId
            );
            state.playingNow = JSON.parse(JSON.stringify(show));
            store.state.playingNowWatcher += 1;
            show.lastPlayed = new Date().getTime();
        },
        createShow(state, show) {
            state.shows.push(show);
        },
        updateControlValue(state, updates) {
            const show = state.shows.find((show) => show.id === updates.showId);
            show.controls[updates.controlId].value = updates.controlValue;
        },
        deleteUnusedControl(state, updates) {
            const show = state.shows.find((show) => show.id === updates.showId);
            delete show.controls[updates.controlId];
        },
        setHomeFilter(state, filter) {
            state.homeFilter = filter;
        },
        setHomeSort(state, sort) {
            state.homeSort = sort;
        },
        addControl(state, updates) {
            console.log(updates)
            const show = state.shows.find((show) => show.id === updates.id);
            show.controls[updates.controlObj.id] = updates.controlObj;
        },
        updateThumbnail(state, updates) {
            const show = state.shows.find((show) => show.id === updates.id);
            show.info.thumbnail = updates.src;
        },
        sortShows(state) {
            // TODO(Anna): generalize sort fxns
            function title(a, b) {
                // Ascending alphabetical
                const titleA = a.info.title.toUpperCase();
                const titleB = b.info.title.toUpperCase();
                return titleA > titleB ? 1 : -1;
            }

            function lastPlayed(a, b) {
                // Descending numerical
                const lastPlayedA = a.lastPlayed;
                const lastPlayedB = b.lastPlayed;
                let comparison = 0;
                comparison = lastPlayedA > lastPlayedB ? -1 : 1;
                return comparison;
            }

            function lastModified(a, b) {
                // Descending numerical
                const lastModifiedA = a.lastModified;
                const lastModifiedB = b.lastModified;
                let comparison = 0;
                comparison = lastModifiedA > lastModifiedB ? -1 : 1;
                return comparison;
            }

            // By default, sort by title
            state.shows.sort(title)

            // Sort by a second metric, if requested
            if (state.homeSort === 'Sort by last played') {
                state.shows.sort(lastPlayed);
            } else if (state.homeSort === 'Sort by last modified') {
                state.shows.sort(lastModified);
            }
        },
        setPlayingNowThumbnailData(state, buffer) {
            state.playingNow.info.thumbnailData = buffer;
        },

        // Old
        addShow(state, show) {
            state.shows.push(show);
        },
        updateShow(state, updates) {
            const show = state.shows.find((show) => show.id === updates.id);
            show.title = updates.title;
            show.description = updates.description;
            show.thumbnail = updates.thumbnail;
        },
        deactivateShow(state, id) {
            const show = state.shows.find((show) => show.id === id);
            show.playing = false;
        },
        activateShow(state, id) {
            const show = state.shows.find((show) => show.id === id);
            show.playing = true;
        },
        setPlayingNowShow(state, id) {
            const show = state.shows.find((show) => show.id === id);
            state.playingNow = JSON.parse(JSON.stringify(show));
            store.state.playingNowWatcher += 1;
        },
        setLastPublishedShow(state, id) {
            state.lastPublishedShow = state.shows.find((show) => show.id === id);
        },
        restorePublishedShow(state) {
            console.log("Restoring published show");
            if (state.lastPublishedShow !== null) {
                state.playingNow = state.lastPublishedShow;
                store.state.playingNowWatcher += 1;
            }
        },
        // deleteShow(state, id) {
        //     const show = state.shows.find(show => show.id === id)
        //     show.deleted = true
        // },
        toggleLightsStatus(state) {
            state.lightsOn = !state.lightsOn;
        },
        toggleHomeFilter(state, filter) {
            state.homeFilters[filter] = !state.homeFilters[filter];
        },
        setCode(state, info) {
            const show = state.shows.find((show) => show.id === info.id);
            show.code = info.code;
        },
        // addControl(state, info) {
        //     const show = state.shows.find(show => show.id === info.id)
        //     show.controls[info.controlObj.id] = info.controlObj
        // },
        // deleteControl(state, info) {
        //     const show = state.shows.find(show => show.id === info.id)
        //     delete show.controls[info.controlObj.id]
        // },
        addDraftForEditing(state, id) {
            const show = state.shows.find((show) => show.id === id);
            // JSON parse & stringify decouple 'published' from 'draft' objects,
            // which is what we want...until the user publishes their draft.
            show.draft = JSON.parse(JSON.stringify(show.published));
            console.log('New draft created for editing');
        },
        saveDraftAsPublished(state, id) {
            const show = state.shows.find((show) => show.id === id);
            show.published = JSON.parse(JSON.stringify(show.draft));
            console.log('Draft saved to published');
        },
        discardDraft(state, id) {
            const show = state.shows.find((show) => show.id === id);
            show.draft = null;
            console.log('Draft cleared');
        },
        addDraftControl(state, info) {
            const show = state.shows.find((show) => show.id === info.id);
            show.draft.controls[info.controlObj.id] = info.controlObj;
            console.log(show.draft);
        },
        updateDraftInfo(state, info) {
            const show = state.shows.find((show) => show.id === info.id);
            show.draft.info = info.info;
        },
        updateDraftCode(state, info) {
            const show = state.shows.find((show) => show.id === info.id);
            show.draft.code = info.code;
        },
        stopDraftCode(state) {
            state.draftCodeRunning = false;
            console.log('stop draft code');
        },
        runDraftCode(state) {
            state.draftCodeRunning = true;
            console.log('run draft code');
        },
        removeTmpShows(state) {
            // Clean the store of any tmp shows that are the result
            // of exiting the app before vue can be destroyed.
            state.shows = state.shows.filter((show) => !show.tmp);
        },
        updatePreviewMode(state, value) {
            state.previewMode = value;
        }
    },
    getters: {
        // Get show by id
        showById: (state) => (id) => {
            return state.shows.find((show) => show.id === id);
        },
        playingNow(state) {
            return state.shows.filter((show) => show.playing)[0];
        },
        locked(state) {
            return state.shows.filter((show) => show.locked);
        },

        // Old
        templates(state) {
            return state.shows.filter((show) => show.template);
        },
        favorites(state) {
            return state.shows.filter((show) => show.info.favorite);
        },
        published(state) {
            return state.shows.filter((show) => show.published);
        },
        drafts(state) {
            return state.shows.filter((show) => !show.published);
        },
        filteredShows(state) {
            let shows = state.shows;
            if (state.homeFilter == 'Templates') {
                shows = state.shows.filter((show) => show.template);
            } else if (state.homeFilter == 'Favorites') {
                shows = state.shows.filter((show) => show.info.favorite);
            }
            return shows;
        },
        kinet(state) {
            return state.kinet;
        },
        assetUrl: (state) => (filename) => {
            return `file:///${state.userUploadsPath}/user_uploads/${filename}`;
        }
    }
})

// Subscribe to Vuex store mutations.
// On every mutation, uppate the persistent electronStore.
store.subscribe(() => {
    electronStore.set('state', store.state);
})

// Opens electron store's auto-generated config.json in the
// userData folder of the local OS. Might be useful to open
// automatically on first run to set up IP addresses for kinet
// signaling. To use, must also be enabled in src/preload.js.
if (process.env.NODE_ENV === 'development' && electronStore) {
    // electronStore.openInEditor();
}

export default store
