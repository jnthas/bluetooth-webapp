

const name = 'Characteristics';

function onActive() {

    const ssidUUID = MyDevices.deviceDescription.service.characteristics[0].uuid
    const pwdUUID = MyDevices.deviceDescription.service.characteristics[1].uuid


    MyDevices.getCurrentDevices().then((device) => {
        if (device.length > 0) {
            $("#ssid-field progress").show();
            $("#pwd-field progress").show();

            MyDevices.readCharacteristicValue(device[0].id, ssidUUID).then((content) => {
                $('#ssid-field').removeClass('invalid');
                $("#ssid-field span").remove();
                $('#ssid-field input').val(new TextDecoder('utf-8').decode(content));
            }).catch((error) => {
                $('#ssid-field').addClass('invalid');
                var span = $('<span />').addClass('error').text(error);
                $('#ssid-field').append(span);
            }).finally(() => {
                $("#ssid-field progress").hide();
            });

            MyDevices.readCharacteristicValue(device[0].id, pwdUUID).then((content) => {
                $('#pwd-field').removeClass('invalid');
                $("#ssid-field span").remove();
                $('#pwd-field input').val(new TextDecoder('utf-8').decode(content));
            }).catch((error) => {
                $('#pwd-field').addClass('invalid');
                var span = $('<span />').addClass('error').text(error);
                $('#pwd-field').append(span);
            }).finally(() => {
                $("#pwd-field progress").hide();
            });
        }
    });

}

export { name, onActive };
export default onActive;
