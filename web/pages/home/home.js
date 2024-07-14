
import * as ble from '../../BLE.js';

const name = 'Home';

function onActive() {
    $('header h5').text(name);
    
    ble.getCurrentDevices().then((device) => {
        if (device.length > 0) {
            $('#last-device').text(device[0].name);
        }

    });
}

export { name, onActive };
export default onActive;
