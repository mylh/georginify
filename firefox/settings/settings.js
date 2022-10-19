const CHARS = {
    en: [
        // English
        {'a': 'ა'},
        {'b': 'ბ'},
        {'g': 'გ'},
        {'d': 'დ'},
        {'e': 'ე'},
        {'v': 'ვ'},
        {'z': 'ზ'},
        {'t': 'თ'},
        {'t': 'ტ'},
        {'i': 'ი'},
        {'k': 'კ'},
        {'ck': 'კ'},
        {'k': 'ყ'},
        {'c': 'ქ'},
        {'k': 'ქ'},
        {'l': 'ლ'},
        {'u': 'უ'},
        {'m': 'მ'},
        {'n': 'ნ'},
        {'o': 'ო'},
        {'p': 'პ'},
        {'j': 'ჟ'},
        {'j': 'ჯ'},
        {'r': 'რ'},
        {'s': 'ს'},
        {'f': 'ფ'},
        {'ph': 'ფ'},
        {'g': 'ღ'},
        {'sh': 'შ'},
        {'ch': 'ჩ'},
        {'ch': 'ჭ'},
        {'ts': 'ც'},
        {'z': 'ც'},
        {'dz': 'ძ'},
        {'z': 'ძ'},
        {'ts': 'წ'},
        {'z': 'წ'},
        {'h': 'ხ'},
        {'h': 'ჰ'},
    ],

    ru: [
        //Russian
        {'а': 'ა'},
        {'б': 'ბ'},
        {'г': 'გ'},
        {'г': 'ღ'},
        {'д': 'დ'},
        {'е': 'ე'},
        {'ё': 'ე'},
        {'в': 'ვ'},
        {'з': 'ზ'},
        {'т': 'თ'},
        {'т': 'ტ'},
        {'и': 'ი'},
        {'к': 'კ'},
        {'к': 'ქ'},
        {'к': 'ყ'},
        {'л': 'ლ'},
        {'у': 'უ'},
        {'м': 'მ'},
        {'н': 'ნ'},
        {'о': 'ო'},
        {'п': 'პ'},
        {'п': 'ფ'},
        {'ф': 'ფ'},
        {'ж': 'ჟ'},
        {'ж': 'ჯ'},
        {'дж': 'ჯ'},
        {'р': 'რ'},
        {'с': 'ს'},
        {'ш': 'შ'},
        {'ч': 'ჩ'},
        {'ч': 'ჭ'},
        {'ц': 'ც'},
        {'ц': 'წ'},
        {'дз': 'ძ'},
        {'з': 'ძ'},
        {'х': 'ხ'},
        {'х': 'ჰ'},
    ]
};

function _(dict) {
    let key = Object.keys(dict)[0];
    return {
        id: key.charCodeAt(0) * 10000 + dict[key],
        key: key,
        val: dict[key]
    };
}

function title(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function createInput(letter) {
    let el = document.createElement('li'),
    d = _(letter);
    el.innerHTML = '<label><input type="checkbox" id="' + d.id + '" name="' + d.key + '" data-replace="' + d.val + '">' + title(d.key) + ',' + d.key + ' = ' + d.val + '</label>';
    return el;
}

function initSettings() {
    let list = document.getElementById('en_letters');
    for(let i = 0; i < CHARS.en.length; i++) {
        list.appendChild(createInput(CHARS.en[i]));
    }
    list = document.getElementById('ru_letters');
    for(let i = 0; i < CHARS.ru.length; i++) {
        list.appendChild(createInput(CHARS.ru[i]));
    }

    restoreSettings();
    document.querySelectorAll('input[type="checkbox"]').forEach(item => {
        item.addEventListener('click', event => {
            saveSettings(event);
        });
    });
}

function saveSettings(e) {
    let checked = document.querySelectorAll('input[type="checkbox"]:checked');
    let chars = [];
    for(let i = 0; i < checked.length; i++) {
        let el = checked[i],
            d = {};
        d[el.getAttribute('name')] = el.getAttribute('data-replace');
        chars.push(d);
    }
    browser.storage.sync.set({
        letters: chars
    });
}

function restoreSettings() {
    function updateControls(result) {
        let chars = [{
            'a': 'ა',
        }];
        if(result.letters) {
            chars = result.letters;
        }
        for(let i = 0; i < chars.length; i++) {
            let d = _(chars[i]);
            document.getElementById(d.id).checked = true;
        }
    }

    function onError(error) {
        console.log(`Error: ${error}`);
    }

    let getting = browser.storage.sync.get("letters");
    getting.then(updateControls, onError);
}


document.addEventListener("DOMContentLoaded", initSettings);
