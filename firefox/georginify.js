const TAGS = [
    'A',
    'ABBR',
    'ACRONYM',
    'ARTICLE',
    'B',
    'BLOCKQUOTE',
    'BUTTON',
    'CAPTION',
    'CITE',
    'DT',
    'DD',
    'DETAILS',
    'DIV',
    'DL',
    'FOOTER',
    'FORM',
    'H1',
    'H2',
    'H3',
    'H4',
    'H5',
    'H6',
    'HEADER',
    'INPUT',
    'LABEL',
    'LEGEND',
    'LI',
    'OL',
    'OPTION',
    'P',
    'PLAINTEXT',
    'Q',
    'S',
    'SECTION',
    'SELECT',
    'SMALL',
    'SPAN',
    'STRIKE',
    'STRONG',
    'SUB',
    'SUP',
    'SUMMARY',
    'TABLE',
    'TBODY',
    'TD',
    'TEXTAREA',
    'TFOOT',
    'TH',
    'TR',
    'U',
    'UL',
];

var TAGS_EXCLUDE = [
    'CODE',
];

var CHARS = {}; // populated from settings
var REPLACE_RE = null;

function traverse(node) {
    if(node.nodeType == Node.TEXT_NODE && TAGS.indexOf(node.parentNode.tagName) !== -1) {
        node.textContent = node.textContent.replace(REPLACE_RE, function(c) { return CHARS[c]; });
        //console.debug(node.tagName, node.text);
    }

    for (let element of node.childNodes) {
        if (node.nodeType == Node.ELEMENT_NODE && TAGS_EXCLUDE.indexOf(node.tagName) !== -1) {
            continue;
        }
        traverse(element);
    }
}

function title(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function loadSettings() {
    function apply(result) {
        let chars = {
            'a': 'ა',
        };
        if(result.letters) {
            chars = result.letters;
        }
        CHARS = chars;
        for(let c in CHARS) {
            CHARS[title(c)] = CHARS[c];
        }
        let re_main = '', re_group = '';
        let keys = Object.keys(CHARS);
        for(let i = 0; i < keys.length; i++) {
            let key = keys[i];
            if(key.length > 1) {
                if (re_main != '') {
                    re_main += '|';
                }
                re_main += key;
            } else {
                re_group += key;
            }
        }
        if (re_group) {
            re_main += '|[' + re_group + ']';
        }
        REPLACE_RE = new RegExp(re_main, 'g');
        //console.debug(CHARS, re_main);
    }

    let getting = browser.storage.sync.get("letters");
    getting.then(apply, onError);
}


function georginify() {
    var title = document.querySelector('title');
    if(title) {
        traverse(title);
    }
    traverse(document.body);
}


function onError(error) {
    console.log(`Error: ${error}`);
}


const observerCallback = (mutationList, observer) => {
    for (const mutation of mutationList) {
        traverse(mutation.target);
    }
};


function main() {
    function onGetGlobalState(item) {
        //console.debug("Global state", item.globalState);
        if (item.globalState) {
            georginify();
            // observe DOM changes
            const observer = new MutationObserver(observerCallback);
            const config = { attributes: false, childList: true, subtree: true };
            observer.observe(document.body, config);
        }
    }
    loadSettings();
    const getting = browser.storage.sync.get("globalState");
    getting.then(onGetGlobalState, onError);
}

main();
