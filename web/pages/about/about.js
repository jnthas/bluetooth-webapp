
const name = 'About';

function onActive() {
    $('header h5').text(name);
}

export { name, onActive };
export default onActive;
