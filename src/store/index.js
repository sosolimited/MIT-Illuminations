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

Vue.use(Vuex);

let electronStore = window.estore || false;

const store = new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    state: (electronStore ? electronStore.get('state') : false) || {
        // kinet: kinet_config[process.env.NODE_ENV],
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
        playingNow: default_shows.filter(show => show.id === '3p__CK7daF')[0],
        lastPublishedShow: default_shows.filter(show => show.id === '3p__CK7daF')[0],
        editingNowId: '3p__CK7daF',
        shows: default_shows,
        numLights: 30,
        enableSerial: true,
        selectedSerialPort: '',
        selectedColorMode: 'RGB'
    },
    mutations: {
        // Update the number of individual LEDs to output / preview
        updateNumLights(state, number) {
            state.numLights = number;
        },
        // Update whether or not to output light sampling to the serial driver
        updateEnableSerial(state, boolean) {
            state.enableSerial = boolean;
        },
        // Updates the user's output port for the serial driver
        updateSelectedSerialPort(state, port) {
            state.selectedSerialPort = port;
        },
        updateSelectedColorMode(state, mode) {
            state.selectedColorMode = mode;
        },
        // Create a copy of a show for editing
        createCopy(state, packet) {
            const show = JSON.parse(JSON.stringify(packet.show));
            show.id = packet.id;
            show.tmp = false;
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
                let comparison;
                comparison = lastPlayedA > lastPlayedB ? -1 : 1;
                return comparison;
            }

            function lastModified(a, b) {
                // Descending numerical
                const lastModifiedA = a.lastModified;
                const lastModifiedB = b.lastModified;
                let comparison;
                comparison = lastModifiedA > lastModifiedB ? -1 : 1;
                return comparison;
            }

            // By default, sort by title
            state.shows.sort(title);
            // Sort by a second metric, if requested
            if (state.homeSort === 'Sort by last played') {
                state.shows.sort(lastPlayed);
            } else if (state.homeSort === 'Sort by last modified') {
                state.shows.sort(lastModified);
            }
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
        toggleLightsStatus(state) {
            state.lightsOn = !state.lightsOn;
        },
        removeTmpShows(state) {
            state.shows = state.shows.filter((show) => !show.tmp);
        },
        updatePreviewMode(state, value) {
            state.previewMode = value;
        },
        updateShowsFromTemplates(state) {
            // Show library
            state.shows.forEach((show, showIndex) => {
                let defaultIndex = default_shows.findIndex(defaultShow => defaultShow.id === show.id);
                if (defaultIndex > -1) {
                    state.shows[showIndex] = default_shows[defaultIndex];
                }
            });
            // Currently Published Show
            let playingNowDefaultIndex = default_shows.findIndex(defaultShow => defaultShow.id === state.playingNow.id);
            if (playingNowDefaultIndex > -1) {
                state.playingNow = default_shows[playingNowDefaultIndex];
            }
            // Last Published Show
            let lastPublishedShowDefaultIndex = default_shows.findIndex(defaultShow => defaultShow.id === state.lastPublishedShow.id);
            if (lastPublishedShowDefaultIndex > -1) {
                state.lastPublishedShow = default_shows[lastPublishedShowDefaultIndex];
            }
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
        published(state) {
            return state.shows.filter((show) => show.published);
        },
        filteredShows(state) {
            let shows = state.shows;
            if (state.homeFilter === 'Templates') {
                shows = state.shows.filter((show) => show.template);
            } else if (state.homeFilter === 'Favorites') {
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
// On every mutation, update the persistent electronStore.
store.subscribe(() => {
    electronStore.set('state', store.state);
});

export default store
