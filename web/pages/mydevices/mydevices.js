const name = 'MyDevices';

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


function clearLog() {
    $('#log').text('');
}

function log(line) {
    $('#log').text($('#log').text() + line + '\n');
}

function populateBluetoothDevices() {
    
    log('Getting existing permitted Bluetooth devices...');
    navigator.bluetooth.getDevices().then((devices) => {

        try {
            log('> Got ' + devices.length + ' Bluetooth devices.');
            $('#devicesSelect').text('');
            for (const device of devices) {
                const option = document.createElement('option');
                option.value = device.id;
                option.textContent = device.name;
                $('#devicesSelect').append(option);
            }
        }
        catch (error) {
            log('Argh! ' + error);
        }
    });
}

function onRequestBluetoothDeviceButtonClick() {
    
    log('Requesting any Bluetooth device...');
    navigator.bluetooth.requestDevice({
        //acceptAllDevices:true
        filters: [{ services: [deviceDescription.service.uuid] }]
    }).then((device) => {
        log('> Requested ' + device.name + ' (' + device.id + ')');
        populateBluetoothDevices();
    });    
}


function readCharacteristicValue(deviceId, charUuid) {
    return getDeviceById(deviceId).then((device) => {
        return device.gatt.connect().then((server) => {
            return server.getPrimaryService(deviceDescription.service.uuid).then((service) => {
                return service.getCharacteristic(charUuid).then((characteristic) => {
                    return characteristic.readValue().then((value) => {
                        return value;                        
                    });
                });
            });
        });
    });
}


function writeCharacteristicValue(deviceId, charUuid, value) {
    return getDeviceById(deviceId).then((device) => {
        return device.gatt.connect().then((server) => {
            return server.getPrimaryService(deviceDescription.service.uuid).then((service) => {
                return service.getCharacteristic(charUuid).then((characteristic) => {
                    return characteristic.writeValueWithResponse(value);                    
                });
            });
        });
    });
}


function readCharacteristic() {
    log('Reading all characteristics, please wait...');
    const deviceId = $('#devicesSelect :selected').val();
  
    getDeviceById(deviceId).then((device) => {
        device.gatt.connect().then((server) => {
            server.getPrimaryService(deviceDescription.service.uuid).then((service) => {
                for (const c of deviceDescription.service.characteristics) {     
                    service.getCharacteristic(c.uuid).then((characteristic) => {
                        characteristic.readValue().then((value) => {
                            var content = new TextDecoder('utf-8').decode(value);
                            c.value = content;    
                            log(c.description + ' ('+ c.uuid.substring(0,5) +') -> ' + c.value);
                        });
                    });
                }
            });
        });
    });
}

function onForgetBluetoothDeviceButtonClick() {
    const deviceId = $('#devicesSelect :selected').val();
  
    getDeviceById(deviceId).then((device) => {
        try {
            log('Forgetting ' + device.name + ' bluetooth device...');
            device.forget().then(() => {
                log('  > Bluetooth device has been forgotten.');
                populateBluetoothDevices();
            });
        }
        catch (error) {
            log('Argh! ' + error);
        }
    });
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

function onActive() {
    $('header h5').text(name);
    populateBluetoothDevices();
}

export { name, deviceDescription, onActive, populateBluetoothDevices, onRequestBluetoothDeviceButtonClick, readCharacteristic, onForgetBluetoothDeviceButtonClick, getCurrentDevices, clearLog, readCharacteristicValue, writeCharacteristicValue};
export default populateBluetoothDevices;
