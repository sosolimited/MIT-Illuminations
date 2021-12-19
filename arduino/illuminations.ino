///////////////////////////////////////
//////// Illuminations by MIT /////////
// Install this code on your Arduino //
///////////////////////////////////////

//////////////////////////////////////////
// Modify these values before uploading //
//////////////////////////////////////////

// How many LEDs on your neopixel hardware?
#define LED_COUNT 30

// How many colors per LED (3 for RGB, 4 for RGB+W)
#define N_COLORS 3

///////////////////////////////////
// Do not modify below this line //
///////////////////////////////////

#include <Adafruit_NeoPixel.h>
#define LED_PIN 4

int total_vals = LED_COUNT * N_COLORS;

Adafruit_NeoPixel strip(LED_COUNT, LED_PIN);

void setup() {
  Serial.begin(115200, SERIAL_8N1);
  strip.begin();
  strip.setBrightness(100);
  strip.show();
}

void loop(){
  if(Serial.available()){
    byte buf[total_vals];
    Serial.readBytes(buf, total_vals);
    int pixel = 0;
    for( int i = 0; i < (total_vals - 1); ){
      int r,g,b;
      r = (int) buf[i];
      g = (int) buf[i+1];
      b = (int) buf[i+2];
      strip.setPixelColor(pixel,r,g,b);
      pixel += 1;
      i += N_COLORS;
    }
    strip.show();
  }
}
