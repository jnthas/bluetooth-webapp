const name = 'BLE';

let deviceDescription = {
    "service": {
        "uuid": "4cecb214-c658-4755-98b2-d855b6212b01",
        "name": "Clockwise",
        "characteristics": [
            {
                "uuid": "09b62de8-2893-43da-815c-f52aeec43b71",
                "description":"WiFi SSID",
                "value":""
            },
            {
                "uuid": "09b62de8-2893-43da-815c-f52aeec43b72",
                "description":"Password",
                "value":""
            },
            {
                "uuid": "09b62de8-2893-43da-815c-f52aeec43b73",
                "description":"Auth Type",
                "value":""
            }
        ]
    }
}



function getCurrentDevices() {    
    return navigator.bluetooth.getDevices();
}


function getDeviceById(id) {
    return navigator.bluetooth.getDevices().then((devices) => {
        const device = devices.find((device) => device.id == id);
        if (!device) {
            throw new Error('No Bluetooth device with id ('+id+') found');
        }
        return device;
    });
}



function readAllCharacteristics(deviceId, callback) {

    return getDeviceById(deviceId)
        .then((device) => { return Promise.resolve(device.gatt.connect()); })
        .then((server) => { return Promise.resolve(server.getPrimaryService(deviceDescription.service.uuid)); })
        .then((service) => { return Promise.resolve(service.getCharacteristics()); })
        .then((characteristics) => { 
            let promises = [];
            for (let c of characteristics) {
                promises.push(() => readCharacteristic(deviceId, c.uuid).then((content) => callback(c.uuid, content)));
            }
            return promises.reduce((prev, cur) => prev.then(cur), Promise.resolve());
         });
}


function readCharacteristic(deviceId, uuid) {
    return getDeviceById(deviceId)
        .then((device) => { return Promise.resolve(device.gatt.connect()); })
        .then((server) => { return Promise.resolve(server.getPrimaryService(deviceDescription.service.uuid)); })
        .then((service) => { return Promise.resolve(service.getCharacteristic(uuid)); })
        .then((characteristic) => { return Promise.resolve(characteristic.readValue()); })
        .then((value) => { return Promise.resolve(new TextDecoder('utf-8').decode(value)); })
        .then((content) => { return new Promise(resolve => setTimeout(() => resolve(content), 10)); });
}



function writeCharacteristic(deviceId, uuid, value) {
    return getDeviceById(deviceId)
        .then((device) => { return device.gatt.connect()})
        .then((server) => { return server.getPrimaryService(deviceDescription.service.uuid)})
        .then((service) => { return service.getCharacteristic(uuid)})
        .then((characteristic) => { return characteristic.writeValueWithResponse(value);})
        .then(() => { return new Promise(resolve => setTimeout(() => resolve(), 10)); });
}


export { name, getCurrentDevices, getDeviceById, readAllCharacteristics, readCharacteristic, writeCharacteristic, deviceDescription };
export default name;
