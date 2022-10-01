function saveState(e) {
    browser.storage.sync.set({
        globalState: document.querySelector("#gs").checked
    });
}

function restoreOptions() {
    function setCurrentState(result) {
        document.querySelector("#gs").checked = result.globalState || false;
    }

    function onError(error) {
        console.log(`Error: ${error}`);
    }

    let getting = browser.storage.sync.get("globalState");
    getting.then(setCurrentState, onError);
}

function reloadPage() {
    browser.tabs.reload();
}

function openSettings() {
    browser.runtime.openOptionsPage();
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("#gs").addEventListener("click", saveState);
document.querySelector("#reload").addEventListener("click", reloadPage);
document.querySelector("#settings").addEventListener("click", openSettings);
