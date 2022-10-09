const CHARS = {
    // English
    'a': 'ა',
    'b': 'ბ',
    'g': 'გ',
    'd': 'დ',
    'e': 'ე',
    'v': 'ვ',
    'z': 'ზ',
    't': 'თ',
    'i': 'ი',
    'k': 'კ',
    'l': 'ლ',
    'u': 'უ',
    'm': 'მ',
    'n': 'ნ',
    'o': 'ო',
    'p': 'პ',
    'j': 'ჟ',
    'j': 'ჯ',
    'r': 'რ',
    's': 'ს',
    't': 'ტ',
    'p': 'ფ',
    'f': 'ფ',

    //Russian
    'а': 'ა',
    'б': 'ბ',
    'г': 'გ',
    'д': 'დ',
    'е': 'ე',
    'ё': 'ე',
    'в': 'ვ',
    'з': 'ზ',
    'т': 'თ',
    'и': 'ი',
    'к': 'კ',
    'л': 'ლ',
    'у': 'უ',
    'м': 'მ',
    'н': 'ნ',
    'о': 'ო',
    'п': 'პ',
    'ж': 'ჟ',
    'ж': 'ჯ',
    'р': 'რ',
    'с': 'ს',
    'т': 'ტ',
    'п': 'ფ',
    'ф': 'ფ',

};

function createInput(letter) {
    let el = document.createElement('li');
    el.innerHTML = '<label><input type="checkbox" name="' + letter + '" data-replace="' + CHARS[letter] + '">' + letter.toUpperCase() + ',' + letter + ' = ' + CHARS[letter] + '</label>';
    return el;
}

function initSettings() {
    let list = document.getElementById('letters');
    for(let letter in CHARS) {
        list.appendChild(createInput(letter));
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
    let chars = {};
    for(let i = 0; i < checked.length; i++) {
        let el = checked[i];
        chars[el.getAttribute('name')] = el.getAttribute('data-replace');
    }
    browser.storage.sync.set({
        letters: chars
    });
}

function restoreSettings() {
    function updateControls(result) {
        let chars = {
            'a': 'ა',
        };
        if(result.letters) {
            chars = result.letters;
        }
        for(let c in chars) {
            document.querySelector('input[name="' + c + '"]').checked = true;
        }
    }

    function onError(error) {
        console.log(`Error: ${error}`);
    }

    let getting = browser.storage.sync.get("letters");
    getting.then(updateControls, onError);
}


document.addEventListener("DOMContentLoaded", initSettings);

document.querySelector("#save").addEventListener("click", saveSettings);
