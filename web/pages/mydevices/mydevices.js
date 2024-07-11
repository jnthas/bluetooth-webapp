import * as BLE from '/BLE.js';

let currentDeviceId = "";
const name = 'MyDevices';

function clearLog() {
    $('#log').text('');
}

function log(line) {
    $('#log').text($('#log').text() + line + '\n');
}


function getCurrentDeviceId() {
    return currentDeviceId;
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

            currentDeviceId = $('#devicesSelect :selected').val()
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
        filters: [{ services: [BLE.deviceDescription.service.uuid] }]
    }).then((device) => {
        log('> Requested ' + device.name + ' (' + device.id + ')');
        populateBluetoothDevices();
    });    
}


function readCharacteristic() {
    log('Reading all characteristics, please wait...');
    const deviceId = $('#devicesSelect :selected').val();

    let values = {};

    BLE.readAllCharacteristics(deviceId, (uuid, content) => values[uuid] = content).then(() => {

        for (const [key, value] of Object.entries(values)) {
            log(key + ': ' + value);
        }
    });
}


function onForgetBluetoothDeviceButtonClick() {
    const deviceId = $('#devicesSelect :selected').val();
  
    BLE.getDeviceById(deviceId).then((device) => {
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



function onActive() {
    $('header h5').text(name);
    $('#devicesSelect').on("change", (event) => {
        currentDeviceId = event.target.value;
    });
    populateBluetoothDevices();
}

export { name, onActive, populateBluetoothDevices, onRequestBluetoothDeviceButtonClick, 
    readCharacteristic, onForgetBluetoothDeviceButtonClick, clearLog, getCurrentDeviceId};
export default populateBluetoothDevices;
