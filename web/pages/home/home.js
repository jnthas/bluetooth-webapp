
const name = 'Home';

function onActive() {
    MyDevices.getCurrentDevices().then((device) => {
        if (device.length > 0) {
            $('#current-device').text(device[0].name + ' (' + device[0].id + ')');
        }

    });
}

export { name, onActive };
export default onActive;
