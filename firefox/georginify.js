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
    'TFOOT',
    'TH',
    'TR',
    'U',
    'UL',
];

var TAGS_EXCLUDE = [
    'INPUT',
    'CODE',
    'TEXTAREA',
];

var SELECTORS_EXCLUDE = [
    '[contenteditable="true"]',
];

var CHARS = {};
var REPLACE_RE = null;

function traverse(node) {
    if(node.nodeType == Node.TEXT_NODE && TAGS.indexOf(node.parentNode.tagName) !== -1) {
        node.textContent = node.textContent.replace(REPLACE_RE, function(c) { return CHARS[c.toLowerCase()]; });
        //console.debug(node.tagName, node.text);
    }

    for (let element of node.childNodes) {
        if (node.nodeType == Node.ELEMENT_NODE && TAGS_EXCLUDE.indexOf(node.tagName) !== -1 && !SELECTORS_EXCLUDE.some(selector => node.matches(selector))) {
            continue;
        }
        traverse(element);
    }
}

function title(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function _(dict) {
    let key = Object.keys(dict)[0];
    return {
        id: key.charCodeAt(0) * 10000 + dict[key],
        key: key,
        val: dict[key]
    };
}

function loadSettings() {
    function apply(result) {
        let chars = [{
            'a': 'ა',
        }];
        if(result.letters) {
            chars = result.letters;
        }
        // for(let c in CHARS) {
        //     CHARS[title(c)] = CHARS[c];
        // }
        let re_main = '', re_group = '';

        for(let i = 0; i < chars.length; i++) {
            let d = _(chars[i]);
            CHARS[d.key] = d.val;
            if(d.key.length > 1) {
                if (re_main.length) {
                    re_main += '|';
                }
                re_main += d.key;
            } else {
                re_group += d.key;
            }
        }
        if (re_group) {
            if (re_main.length) {
                    re_main += '|';
            }
            re_main += '[' + re_group + ']';
        }
        REPLACE_RE = new RegExp(re_main, 'gi');
        //console.debug(chars, re_main);
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
