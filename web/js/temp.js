const SERVICE_UUID = '4cecb214-c658-4755-98b2-d855b6212b01';
const CHAR_SSID_UUID = '09b62de8-2893-43da-815c-f52aeec43b71';
const CHAR_PWD_UUID  = '71ff60b1-47cd-4592-905c-68debaa65c3e';
const CHAR_AUTH_UUID = '78afb192-c71f-4b00-b69e-8f124ee46e89';



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
            //acceptAllDevices:true
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
        var characteristic = await service.getCharacteristic(c.uuid);
        var value = await characteristic.readValue();
        var content = new TextDecoder('utf-8').decode(value);

        log('Characteristic ('+ c.uuid.substring(0,5) +') -> ' + content);
    }

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