

const name = 'Characteristics';

const resolveAfter = (value, delay) =>
    new Promise(resolve => {
      setTimeout(() => resolve(value, delay));
    });
  



function onActive() {

    $('#characteristics-page').empty();
    $('header h5').text(name);

            
    MyDevices.getCurrentDevices().then((device) => {
        if (device.length > 0) {

            

            MyDevices.deviceDescription.service.characteristics.forEach((c) => {
                

                var article = $('<article />').addClass('border large-padding');
                var title = $('<h5 />').text(c.description);
                var div = $('<div />').attr('id', c.uuid).addClass('field border round row');
                var input = $('<input />').attr("type", "text");
                var progress = $('<progress />').addClass('circle');
                var button = $('<button />').addClass('circle').html('<i>save</i>');

                button.click(function(){saveValue(device[0].id, c.uuid)});

                div.append(input);
                div.append(progress);
                div.append(button);
                article.append(title);
                article.append(div);

                $('#characteristics-page').append(article);

                MyDevices.readCharacteristicValue(device[0].id, c.uuid).then((content) => {
                    $('#' + c.uuid).removeClass('invalid');
                    $('#' + c.uuid + ' span').remove();
                    $('#' + c.uuid + ' input').val(content);
                }).catch((error) => {
                    $('#' + c.uuid).addClass('invalid');
                    var span = $('<span />').addClass('error').text(error);
                    $('#' + c.uuid).append(span);
                }).finally(() => {
                    $('#' + c.uuid + ' progress').hide();
                    
                });
            });
        }
    });

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
