#include <Adafruit_NeoPixel.h>

#define LED_PIN 4
#define LED_COUNT 30
#define N_COLORS 3

int total_vals = LED_COUNT * N_COLORS;

// 3rd param will need tweaking per neopixel device
Adafruit_NeoPixel strip(LED_COUNT, LED_PIN);

void setup() {
  // 8 data bits, no parity, 1 stop bit
  Serial.begin(115200, SERIAL_8N1);
  strip.begin();
  strip.setBrightness(100);
  strip.show();
}

void loop(){
  if(Serial.available()){

    byte buf[total_vals];

    // read all color vals in for this frame
    Serial.readBytes(buf, total_vals);

    int pixel = 0;

    for( int i=0; i<total_vals; ){
      int r,g,b;

      r = (int) buf[i];
      g = (int) buf[i+1];
      b = (int) buf[i+2];

      strip.setPixelColor(pixel,r,g,b);

      pixel += 1;
      i += N_COLORS;
    }

    // apply color changes
    strip.show();
  }
}