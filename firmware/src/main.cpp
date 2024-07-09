#include <Arduino.h>
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>

#define SERVICE_UUID   "4cecb214-c658-4755-98b2-d855b6212b01"
#define CHAR_SSID_UUID "09b62de8-2893-43da-815c-f52aeec43b71"
#define CHAR_PWD_UUID  "09b62de8-2893-43da-815c-f52aeec43b72"
#define CHAR_AUTH_UUID "09b62de8-2893-43da-815c-f52aeec43b73"

String ssid = "mywifi";
String pwd = "pwd";
String auth = "WPA2";


void logValues();
void resetBT();

class BTUpdateCallback: public BLECharacteristicCallbacks {
 void onRead(BLECharacteristic* pCharacteristic) {
    //Serial.println("Characteristic read");
 }
 void onWrite(BLECharacteristic* c) {
    if (c->getUUID().toString() == CHAR_SSID_UUID ) {
        ssid = c->getValue().c_str();

    } else if (c->getUUID().toString() == CHAR_PWD_UUID ) {
        pwd = c->getValue().c_str();
    }

    logValues();
 }
};


auto cb = new BTUpdateCallback();


void setup() {
    Serial.begin(9600);
    Serial.println("Starting bluetooth...");

    logValues();

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


    pSSID->setCallbacks(cb);
    pPWD->setCallbacks(cb);
    pAUTH->setCallbacks(cb);

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
    delay(1000);
}


void resetBT() {
    BLEDevice::stopAdvertising();
    BLEDevice::startAdvertising();
}

void logValues() {
    
    Serial.println("SSID: " + ssid);
    Serial.println("PWD: " + pwd);
    Serial.println("AUTH: " + auth);
    Serial.println("------------------------");
    
}



