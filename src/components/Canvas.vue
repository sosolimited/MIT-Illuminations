<template>
    <div>
        <div id="canvas-controls" v-if="detailedView">
            <v-btn text disabled class="pa-0 ma-0">Output</v-btn>
        </div>
        <div id="canvas-outer-container">
            <div>
                <img
                    v-if="detailedView"
                    class="mask-detail"
                    src="../assets/svgs/lightSamplerTransparent_120.svg"
                />
                <img
                    v-if="!detailedView"
                    class="mask-preview"
                    src="../assets/svgs/lightSamplerFill_120.svg"
                />
                <div
                    :id="scriptEl"
                    class="output"
                    v-show="draftCodeRunning"
                ></div>
            </div>
        </div>
    </div>
</template>

<script>
import P5 from 'p5'
import helpers from '../config/p5helpers.config'

export default {
    name: 'Canvas',
    props: {
        detailedView: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            p5Canvas: null,
            helpers: helpers
        }
    },
    computed: {
        id() {
            return this.$route.params.showId
        },
        controls() {
            return this.$store.getters.showById(this.id).draft.controls
        },
        code() {
            return this.$store.getters.showById(this.id).draft.code
        },
        draftCodeRunning() {
            return this.$store.state.draftCodeRunning
        },
        scriptEl() {
            return this.detailedView ? 'canvas-detail' : 'canvas-illuminationsPreview'
        }
    },
    mounted() {
        // TODO(garbier): https://github.com/DrSensor/p5-global2instance
        this.parseCode()
    },
    methods: {
        /* eslint-disable no-unused-vars */
        parseCode() {
            const helpers = this.helpers
            const controls = this.controls
            const script = (p5) => {
                eval(this.code)
            }
            /* eslint-enable no-unused-vars */
            this.p5Canvas = new P5(script, this.scriptEl)
        }
    },
    watch: {
        controls: {
            handler() {
                console.log('CANVAS: CHANGE IN CONTROLS')
                if (this.p5Canvas) {
                    this.p5Canvas.remove()
                }
                this.parseCode();
            },
            deep: true
        },
        code: {
            handler: function () {
                if (this.p5Canvas) {
                    this.p5Canvas.remove()
                }
                this.parseCode()
            }
        }
    },
    unmounted() {
        this.p5Canvas.remove()
    }
}
</script>

<style scoped>
.subheader {
    font-weight: 600;
}
#canvas-outer-container {
    background-color: white;
    height: 100px;
    width: 1200px;
    position: relative;
    margin: auto;
    display: block;
    overflow: hidden;
}
.mask-preview {
    position: absolute;
    top: calc(50% - 50px);
    outline: 1px solid white;

    /*
    width: 1200px;
    margin-left: 0;
    */
    width: 1202px;
    margin-left: -1px;

    z-index: 200;
    object-fit: cover;
}
.mask-detail {
    position: absolute;
    width: 1200px;
    top: calc(50% - 10px);
    z-index: 200;
}
canvas {
    z-index: 100;
}
.output {
    top: calc(50% - 50px);
}
#canvas-controls {
    margin: 0px 20px;
}
</style>
