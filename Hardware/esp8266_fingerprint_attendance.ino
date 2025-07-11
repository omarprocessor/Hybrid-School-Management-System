#include <Adafruit_Fingerprint.h>
#include <SoftwareSerial.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

#define Finger_RX 12 // D6
#define Finger_TX 14 // D5

const char* ssid = "";
const char* password = "";

const char* serverUrl = "";

// 🔐 Access token (replace when expired)
const char* accessToken = "";

SoftwareSerial mySerial(Finger_RX, Finger_TX);
Adafruit_Fingerprint finger = Adafruit_Fingerprint(&mySerial);

String admnos[128];

void setup()
{
  Serial.begin(9600);
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected");

  finger.begin(57600);
  if (finger.verifyPassword())
  {
    Serial.println("Fingerprint sensor connected.");
  }
  else
  {
    Serial.println("Fingerprint sensor not found :(");
    while (1);
  }

  // Fingerprint ID to Admission Number mapping
  admnos[1] = "9599";
  admnos[2] = "8801";
  admnos[3] = "3011";
}

void loop()
{
  Serial.println("Place your finger on the sensor...");
  int result = finger.getImage();
  if (result == FINGERPRINT_NOFINGER) { delay(1000); return; }
  if (result != FINGERPRINT_OK) { Serial.println("Error reading fingerprint"); return; }
  if (finger.image2Tz() != FINGERPRINT_OK) { Serial.println("Error converting image"); return; }
  if (finger.fingerSearch() != FINGERPRINT_OK) { Serial.println("No match found."); return; }

  String admno = admnos[finger.fingerID];
  Serial.print("Match found! Fingerprint ID: "); Serial.println(finger.fingerID);
  Serial.print("Mapped AdmNo: "); Serial.println(admno);

  if (WiFi.status() == WL_CONNECTED)
  {
    HTTPClient http;
    WiFiClient client;
    http.begin(client, serverUrl);
    http.addHeader("Content-Type", "application/json");
    http.addHeader("Authorization", "Bearer " + String(accessToken));

    String payload = "{\"admission_no\": \"" + admno + "\"}";
    int httpCode = http.POST(payload);

    if (httpCode > 0) {
      String response = http.getString();
      Serial.println("Server response: " + response);
    } else {
      Serial.print("POST failed, error: ");
      Serial.println(http.errorToString(httpCode));
    }

    http.end();
  }
  else {
    Serial.println("WiFi not connected");
  }

  delay(2000);
} 