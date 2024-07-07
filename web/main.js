
import * as home from './pages/home/home.js';
import * as mydevices from './pages/mydevices/mydevices.js';
import * as settings from './pages/settings/settings.js';


function removeActiveClass(elem) {
    $('nav a').get().forEach(e => {
        $(e).removeClass('active');
    });

    $('#content div').removeClass('active');
}

function changePage(elem) {
    removeActiveClass(elem);
    $(elem).addClass('active');

    const attrPage = $(elem).attr("data-ui");
    const page = attrPage.substring(1, attrPage.indexOf('-'));
    
    $('#content').load('pages/' + page + '/' + page + '.html', () => {
        $('#content ' + attrPage).addClass('active');
    });
}



// make it global
window[home.name] = home;
window[mydevices.name] = mydevices;
window[settings.name] = settings;
window['Main'] = {removeActiveClass, changePage};