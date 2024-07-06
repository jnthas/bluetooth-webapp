let settings = {
    "service": {
        "uuid": "4cecb214-c658-4755-98b2-d855b6212b01",
        "name": "Clockwise",
        "characteristics": [
            {
                "uuid": "09b62de8-2893-43da-815c-f52aeec43b71",
                "description":"SSID",
                "value":""
            },
            {
                "uuid": "71ff60b1-47cd-4592-905c-68debaa65c3e",
                "description":"Password",
                "value":""
            },
            {
                "uuid": "78afb192-c71f-4b00-b69e-8f124ee46e89",
                "description":"Auth Type",
                "value":""
            }
        ]
    }
}



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
        log('Requesting any Bluetooth device...');
        const device = await navigator.bluetooth.requestDevice({
            //acceptAllDevices:true
            filters: [{ services: [settings.service.uuid] }]
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
    var service = await server.getPrimaryService(settings.service.uuid);


    for (const c of settings.service.characteristics) {

        var characteristic = await service.getCharacteristic(c.uuid);
        var value = await characteristic.readValue();
        var content = new TextDecoder('utf-8').decode(value);
        c.value = content;    
        log(c.description + ' ('+ c.uuid.substring(0,5) +') -> ' + c.value);
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


function loadSettings() {
    
}