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

function traverse(node) {
    if(node.nodeType == Node.TEXT_NODE && TAGS.indexOf(node.parentNode.tagName) !== -1) {
        let re = new RegExp('[' + Object.keys(CHARS).join('') + ']', 'gi');
        node.textContent = node.textContent.replace(re, function(c) { return CHARS[c]; });
        //console.debug(node.tagName, node.text);
    }

    for (let element of node.childNodes) {
        if (node.nodeType == Node.ELEMENT_NODE && TAGS_EXCLUDE.indexOf(node.tagName) !== -1) {
            continue;
        }
        traverse(element);
    }
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
            CHARS[c.toUpperCase()] = CHARS[c];
        }
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

function onGot(item) {
    console.debug("Global state", item.globalState);
    if (item.globalState) {
        georginify();
    }
}

loadSettings();
const getting = browser.storage.sync.get("globalState");
getting.then(onGot, onError);
