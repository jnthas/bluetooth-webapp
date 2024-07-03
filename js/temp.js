const SERVICE_UUID = '4cecb214-c658-4755-98b2-d855b6212b01';
const CHAR_SSID_UUID = '09b62de8-2893-43da-815c-f52aeec43b71';

function clearLog() {
    document.querySelector('#log').textContent = '';
}

function log(line) {
    document.querySelector('#log').textContent += line + '\n';
}

async function populateBluetoothDevices() {
    const devicesSelect = document.querySelector('#devicesSelect');
    try {
        log('Getting existing permitted Bluetooth devices...');
        const devices = await navigator.bluetooth.getDevices();

        log('> Got ' + devices.length + ' Bluetooth devices.');
        devicesSelect.textContent = '';
        for (const device of devices) {
            const option = document.createElement('option');
            option.value = device.id;
            option.textContent = device.name;
            devicesSelect.appendChild(option);
        }
    }
    catch (error) {
        log('Argh! ' + error);
    }
}

async function onRequestBluetoothDeviceButtonClick() {
    try {
        log('Requesting any Bluetooth device...' + SERVICE_UUID);
        const device = await navigator.bluetooth.requestDevice({
            filters: [{ services: [SERVICE_UUID] }]
        });

        log('> Requested ' + device.name + ' (' + device.id + ')');
        populateBluetoothDevices();
    }
    catch (error) {
        log('Argh! ' + error);
    }
}


async function readCharacteristic() {

    const devices = await navigator.bluetooth.getDevices();

    const deviceIdToForget = document.querySelector('#devicesSelect').value;
    const device = devices.find((device) => device.id == deviceIdToForget);
    if (!device) {
        throw new Error('No Bluetooth device found');
    }
    
    var server = await device.gatt.connect();
    var service = await server.getPrimaryService(SERVICE_UUID);

    characteristics = await service.getCharacteristics();

    for (const c of characteristics) {
        console.log(c.uuid)
    }


    var characteristic = await service.getCharacteristic(CHAR_SSID_UUID);
    var value = await characteristic.readValue();
    var content = new TextDecoder('utf-8').decode(value);

    log('Read value -> ' + content);
}

async function onForgetBluetoothDeviceButtonClick() {
    try {
        const devices = await navigator.bluetooth.getDevices();

        const deviceIdToForget = document.querySelector('#devicesSelect').value;
        const device = devices.find((device) => device.id == deviceIdToForget);
        if (!device) {
            throw new Error('No Bluetooth device to forget');
        }
        log('Forgetting ' + device.name + 'Bluetooth device...');
        await device.forget();

        log('  > Bluetooth device has been forgotten.');
        populateBluetoothDevices();
    }
    catch (error) {
        log('Argh! ' + error);
    }
}

window.onload = () => {
    populateBluetoothDevices();
};