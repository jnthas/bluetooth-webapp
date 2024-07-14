import * as BLE from '../../BLE.js';

const name = 'Characteristics';

function onActive() {

    $('#characteristics-page').empty();
    $('header h5').text(name);

    let promises = [];


    // create card 
    BLE.deviceDescription.service.characteristics.forEach((c) => {
        var article = $('<article />').addClass('border large-padding');
        var title = $('<h5 />').text(c.description);
        var div = $('<div />').attr('id', c.uuid).addClass('field border round row');
        var input = $('<input />').attr("type", "text");
        var progress = $('<progress />').addClass('circle');
        var button = $('<button />').addClass('circle').html('<i>save</i>');
        var spanError = $('<span />').addClass('error');

        button.click(function(){saveValue(device[0].id, c.uuid)});

        div.append(input);
        div.append(progress);
        div.append(spanError);
        article.append(title);
        article.append(div);

        $('#characteristics-page').append(article); 

        promises.push(() => {
            BLE.readCharacteristic(MyDevices.getCurrentDeviceId(), c.uuid).then((content) => {
                div.removeClass('invalid');
                spanError.remove();
                input.val(content);
                div.append(button);
                progress.hide();
    
            }).catch((error) => {
                div.addClass('invalid');
                spanError.text(error)
                progress.hide();
            });
        })

        promises.push(() => new Promise(resolve => setTimeout(() => resolve(content), 1000)));


    });

    promises.reduce((prev, cur) => prev.then(cur), Promise.resolve());

}

function saveValue(deviceId, charUUID) {
    const newValue = $('#' + charUUID + ' input').val();
    let encoder = new TextEncoder('utf-8');
    MyDevices.writeCharacteristicValue(deviceId, charUUID, encoder.encode(newValue)).then((c) => {
        console.log(c);
    });
}

export { name, onActive };
export default onActive;
