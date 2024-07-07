

const name = 'Settings';

function onActive() {

    const ssidUUID = MyDevices.deviceDescription.service.characteristics[0].uuid
    const pwdUUID = MyDevices.deviceDescription.service.characteristics[1].uuid


    MyDevices.getCurrentDevices().then((device) => {
        if (device.length > 0) {
            MyDevices.readCharacteristicValue(device[0].id, ssidUUID).then((content) => {
                $('#ssid-input').val(new TextDecoder('utf-8').decode(content));
            });
            MyDevices.readCharacteristicValue(device[0].id, pwdUUID).then((content) => {
                $('#pwd-input').val(new TextDecoder('utf-8').decode(content));
            });
        }
    });

}

export { name, onActive };
export default onActive;
