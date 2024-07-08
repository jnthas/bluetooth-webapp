
const name = 'Home';

function onActive() {
    MyDevices.getCurrentDevices().then((device) => {
        if (device.length > 0) {
            $('#last-device').text(device[0].name);
        }

    });
}

export { name, onActive };
export default onActive;
