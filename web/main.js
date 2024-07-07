
import * as home from './pages/home/home.js';
import * as mydevices from './pages/mydevices/mydevices.js';
import * as settings from './pages/settings/settings.js';

const name = 'Main';

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
        pages[page].onActive();
    });

}


const pages = {
    "home": home,
    "mydevices": mydevices,
    "settings": settings,
    "main": {name, removeActiveClass, changePage}
}

// make it global
for (let [key, value] of Object.entries(pages)) {
    window[value.name] = value;
}


