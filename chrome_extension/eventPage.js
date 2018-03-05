chrome.runtime.onInstalled.addListener(function () {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        chrome.declarativeContent.onPageChanged.addRules([
            {
                conditions: [
                    new chrome.declarativeContent.PageStateMatcher({
                        pageUrl: { urlContains: 'usrinfo.minjust.gov.ua' },
                    }),
                    new chrome.declarativeContent.PageStateMatcher({
                        pageUrl: { urlContains: 'localhost' },
                    })
                ],
                actions: [new chrome.declarativeContent.ShowPageAction()]
            }
        ]);
    });
});

chrome.contextMenus.create({ "title": "ParsePage", "id": "parsePageContextMenus" });
chrome.contextMenus.create({ "title": "NextPage", "id": "nextPageContextMenus" });


function getDefaultSettings() {
    const defaultSettings = {
        delimiter: '\n',
        key: 'MJUST',
        url: 'http://localhost:8080/add_firm'
    };

    return defaultSettings;
}

function sendParseEvent(settings) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "parse", url: settings.url });
    });
}

function sendNextPageEvent() {
    chrome.storage.sync.get("idsList", function (data) {
        const idsList = data.idsList
        console.log('get - idsList', idsList);
        const id = idsList.splice(0, 1)[0];
        chrome.storage.sync.set({ idsList });
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { action: "next", id: id });
        });
    });
}

const settings = getDefaultSettings();

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "parsePageContextMenus") {
        sendParseEvent(settings);
    } else if (info.menuItemId === "nextPageContextMenus") {
        sendNextPageEvent();
    }
});
