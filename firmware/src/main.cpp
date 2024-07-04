#include <Arduino.h>
#include "M5AtomS3.h"
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>

#define SERVICE_UUID   "4cecb214-c658-4755-98b2-d855b6212b01"
#define CHAR_SSID_UUID "09b62de8-2893-43da-815c-f52aeec43b71"
#define CHAR_PWD_UUID  "71ff60b1-47cd-4592-905c-68debaa65c3e"
#define CHAR_AUTH_UUID "78afb192-c71f-4b00-b69e-8f124ee46e89"


enum MainMenu { SSID, PWD, AUTH, RESET };
MainMenu menu = SSID;
MainMenu lastMenu = RESET;


String ssid = "mywifi";
String pwd = "pwd";
String auth = "WPA2";


void updateScreen();
void drawMenuNames(String key, String value);
void resetBT();


void setup() {
    auto cfg = M5.config();
    AtomS3.begin(cfg);

    
    AtomS3.Display.setTextDatum(middle_center);
    AtomS3.Display.setTextFont(&fonts::Orbitron_Light_24);
    AtomS3.Display.setTextSize(1);
    Serial.println("Click BtnA to Test");

    

    BLEDevice::init("Clockwise");

    BLEServer *pServer = BLEDevice::createServer();
    BLEService *pService = pServer->createService(SERVICE_UUID);
   
    BLECharacteristic *pSSID = pService->createCharacteristic(
                                          CHAR_SSID_UUID,
                                          BLECharacteristic::PROPERTY_READ |
                                          BLECharacteristic::PROPERTY_WRITE
                                        );

    BLECharacteristic *pPWD = pService->createCharacteristic(
                                          CHAR_PWD_UUID,
                                          BLECharacteristic::PROPERTY_READ |
                                          BLECharacteristic::PROPERTY_WRITE
                                        );

    BLECharacteristic *pAUTH = pService->createCharacteristic(
                                          CHAR_AUTH_UUID,
                                          BLECharacteristic::PROPERTY_READ |
                                          BLECharacteristic::PROPERTY_WRITE
                                        );


    pSSID->setValue(ssid.c_str());
    pPWD->setValue(pwd.c_str());
    pAUTH->setValue(auth.c_str());

    pService->start();
    // BLEAdvertising *pAdvertising = pServer->getAdvertising();  // this still is working for backward compatibility
    BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
    pAdvertising->addServiceUUID(SERVICE_UUID);
    pAdvertising->setScanResponse(true);
    pAdvertising->setMinPreferred(0x06);  // functions that help with iPhone connections issue
    pAdvertising->setMinPreferred(0x12);
    BLEDevice::startAdvertising();
    Serial.println("Characteristic defined! Now you can read it in your phone!");
}

void loop() {
    AtomS3.update();

    if (menu != lastMenu) {
        lastMenu = menu;
        updateScreen();
    }

    if (AtomS3.BtnA.wasReleased()) {

        uint8_t menuInt = static_cast<int>(menu);

        if ((menuInt+1) > 3) {
            menu = SSID;
        } else {
            menu = static_cast<MainMenu>(menuInt+1);
        }

    }


    if (AtomS3.BtnA.wasHold()) {

        switch (menu)
        {
        case SSID:
            ssid = "";
            break;
        case PWD:
            pwd = "";
            break;
        case AUTH:
            auth = "";
            break;
        case RESET:
            resetBT();
            break;
        default:
            
            break;
        }

        updateScreen();


    }
}


void resetBT() {

    BLEDevice::stopAdvertising();
    BLEDevice::startAdvertising();
}

void updateScreen() {
    switch (menu)
    {
    case SSID:
        drawMenuNames("SSID", ssid);
        break;
    case PWD:
        drawMenuNames("PWD", pwd);
        break;
    case AUTH:
        drawMenuNames("AUTH", auth);
        break;
    case RESET:
        drawMenuNames("RESET", "");
        break;
    default:
        break;
    }
}



void drawMenuNames(String key, String value) {
    AtomS3.Display.clear();
    AtomS3.Display.setTextColor(GREEN);
    AtomS3.Display.drawString(key, AtomS3.Display.width() / 2, AtomS3.Display.height()/4);

    AtomS3.Display.setTextColor(RED);
    AtomS3.Display.drawString(value, AtomS3.Display.width() / 2, AtomS3.Display.height()-AtomS3.Display.height()/4);
}
