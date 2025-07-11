# 🛠️ Hybrid School Management System – Hardware (ESP8266 Fingerprint Attendance)

This folder contains the Arduino/ESP8266 code for the fingerprint-based attendance system, which integrates with the Hybrid School Management System backend.

---

## 📋 Overview

This system uses an ESP8266 microcontroller and a fingerprint sensor to automate student attendance. When a registered student places their finger on the sensor:
- The ESP8266 identifies the fingerprint and maps it to a student admission number.
- It sends an HTTP POST request to the backend `/api/attendance/` endpoint, marking the student's attendance in real time.
- The backend can then trigger SMS notifications to parents (if configured).

---

## 🧰 Hardware & Libraries

- **ESP8266** (e.g., NodeMCU, Wemos D1 Mini)
- **Fingerprint Sensor** (e.g., R305, GT-521F52, etc.)
- **Wires, Breadboard, Power Supply**
- **Libraries:**
  - Adafruit_Fingerprint
  - SoftwareSerial
  - ESP8266WiFi
  - ESP8266HTTPClient

---

## ⚙️ Setup Instructions

1. **Wiring:**
   - Connect the fingerprint sensor's TX/RX to ESP8266 pins D6 (GPIO12) and D5 (GPIO14) as defined in the code.

2. **Configure WiFi:**
   - In `esp8266_fingerprint_attendance.ino`, set your WiFi credentials:
     ```cpp
     const char* ssid = "YOUR_WIFI_SSID";
     const char* password = "YOUR_WIFI_PASSWORD";
     ```

3. **Configure Backend URL:**
   - Set the backend server URL (should point to your Django API):
     ```cpp
     const char* serverUrl = "http://<YOUR_BACKEND_IP>:8000/api/attendance/";
     ```

4. **Set Access Token:**
   - Obtain a valid JWT access token from your Django backend (admin or teacher account recommended).
   - Paste it in the code:
     ```cpp
     const char* accessToken = "<YOUR_JWT_ACCESS_TOKEN>";
     ```
   - **Note:** Tokens expire, so you may need to update this periodically.

5. **Map Fingerprint IDs to Admission Numbers:**
   - Update the `admnos` array in the code to map fingerprint IDs to student admission numbers as registered in the backend.
     ```cpp
     admnos[1] = "9599";
     admnos[2] = "8801";
     admnos[3] = "3011";
     ```

6. **Upload the Code:**
   - Use the Arduino IDE or PlatformIO to upload the `.ino` file to your ESP8266.

---

## 🔗 How It Works with the Backend

- When a fingerprint is matched, the ESP8266 sends a POST request to:
  - `POST /api/attendance/`
  - With JSON body: `{ "admission_no": "<student_admission_no>" }`
  - And header: `Authorization: Bearer <access_token>`
- The Django backend receives the request, marks attendance for the student, and (optionally) sends an SMS to the parent using Africastalking.
- The backend responds with a success or error message, which is printed to the ESP8266 serial monitor.

---

## 📝 Notes

- Ensure your ESP8266 and backend server are on the same network (or the backend is accessible from the ESP8266).
- The JWT access token must be valid; expired tokens will result in authentication errors.
- Admission numbers must match those registered in the Django backend.
- For production, consider implementing a secure way to refresh tokens automatically.

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](../LICENSE) file for details. 