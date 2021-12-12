<template>
  <v-dialog
      v-model="settingsDialog"
      transition="dialog-bottom-transition"
      width="800"
      scrollable
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
          text
          v-bind="attrs"
          v-on="on"
      >
        <v-icon color="black">mdi-cog</v-icon>
        <span style="margin-left: 10px">Settings</span>
      </v-btn>
    </template>
    <v-card tile>
      <v-toolbar
          flat
          dark
          color="primary"
      >
        <v-btn
            icon
            dark
            @click="settingsDialog = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Settings</v-toolbar-title>
      </v-toolbar>
      <v-tabs
          dark
          background-color="blue darken-3"
          show-arrows
          v-model="currentTab"
      >
        <v-tabs-slider color="blue accent-3"></v-tabs-slider>

        <v-tab href="#settings-general">General</v-tab>
        <!--
          <v-tab href="#settings-kinet">KiNET</v-tab>
          <v-tab href="#settings-serial">Serial Port</v-tab>
         -->

        <v-tabs-items v-model="currentTab">
          <v-tab-item value="settings-general">
            <v-card-text>
              <v-list>
                <v-subheader>
                  The following settings help to configure Illuminations for your particular use case.
                </v-subheader>
                <v-list-item>
                  <v-list-item-content>
                    <v-text-field
                        label="Number of lights"
                        required
                        placeholder="How many LEDs are you outputting your light shows to?"
                        v-model="numLights"
                    ></v-text-field>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-tab-item>
<!--          <v-tab-item value="settings-kinet">
            <v-card-text>
              <v-list>
                <v-subheader>Configure the KiNET driver to output your light show for Phillips Color Kinetics products.</v-subheader>
                <v-list-item>
                  <v-list-item-action>
                    <v-checkbox v-model="enableKinet"></v-checkbox>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>Enable KiNET Output</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-data-table
                        :headers="[
                              {
                                text: 'IP Address',
                                value: 'ip',
                              },
                              { text: 'Port Number', value: 'port' },
                              { text: 'Number of Lights', value: 'numLights' },
                          ]"
                        :items="kinetStrands"
                    >
                      <template v-slot:item.ip="props">
                        <v-edit-dialog
                            :return-value.sync="props.item.ip"
                        >
                          {{ props.item.ip }}
                          <template v-slot:input>
                            <v-text-field
                                v-model="props.item.ip"
                                label="Set IP Address"
                                single-line
                            ></v-text-field>
                          </template>
                        </v-edit-dialog>
                      </template>
                      <template v-slot:item.port="props">
                        <v-edit-dialog
                            :return-value.sync="props.item.port"
                        >
                          {{ props.item.port }}
                          <template v-slot:input>
                            <v-text-field
                                v-model="props.item.port"
                                label="Set Port"
                                single-line
                                type="number"
                            ></v-text-field>
                          </template>
                        </v-edit-dialog>
                      </template>
                      <template v-slot:item.numLights="props">
                        <v-edit-dialog
                            :return-value.sync="props.item.numLights"
                        >
                          {{ props.item.numLights }}
                          <template v-slot:input>
                            <v-text-field
                                v-model="props.item.numLights"
                                label="How Many Lights?"
                                single-line
                                type="number"
                            ></v-text-field>
                          </template>
                        </v-edit-dialog>
                      </template>
                    </v-data-table>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-tab-item>
          <v-tab-item value="settings-serial">
            <v-card-text>
              <v-list>
                <v-subheader>Configure the serial port to output your light show for Arduino / Adafruit Neopixel products.</v-subheader>
                <v-list-item>
                  <v-list-item-action>
                    <v-checkbox v-model="enableSerial"></v-checkbox>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>Enable Serial Port Output</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-select
                        :items="availableSerialPorts"
                        label="Serial Port"
                        v-model="selectedSerialPort"
                    ></v-select>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-tab-item>-->
        </v-tabs-items>


      </v-tabs>

      <div style="flex: 1 1 auto;"></div>
    </v-card>
  </v-dialog>
</template>

<script>

// const SerialPort = require('serialport');

export default {
  name: 'SettingsPanel',
  data() {
    return {
      currentTab: 'settings-kinet',
      settingsDialog: false,
      enableKinet: true,
      kinetStrands: [
        {
          ip: '127.0.0.1',
          port: 1,
          numLights: 64
        },
        {
          ip: '127.0.0.1',
          port: 1,
          numLights: 56
        }
      ],
      enableSerial: true,
      selectedSerialPort: '',
      availableSerialPorts: []
    }
  },
  props: {
    //
  },
  computed: {
    numLights: {
      get () {
        return this.$store.state.numLights;
      },
      set (value) {
        this.$store.commit('updateNumLights', value)
      }
    }
  },
  methods: {
    //
  },
  mounted() {
    /*
    const vm = this;
    SerialPort.list().then(ports => {
      this.availableSerialPorts = [];
      ports.forEach(function(port) {
          vm.availableSerialPorts.push(port.path);
      });
      console.log("PORTS FOUND: ", vm.availableSerialPorts);
    });
    */
  }
}
</script>
