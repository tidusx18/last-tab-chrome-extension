/**
 * @author: Hasin Hayder [hasin_at_leevio_dot_com | http://hasin.me] NO LONGER SUPPORTS THIS EXTENSION
 * @author: Daniel Victoriano <victorianowebdesign@gmail.com>
 * @license: MIT
 */


let initTab, currentTab, oldTab, currWindow, oldWindow, tabRemoved;


init();


async function init() {

    initTab = await queryTab();
    // console.log(initTab)

    currWindow = initTab.windowId;
    oldWindow = currWindow;

    currentTab = initTab.id;
    oldTab = currentTab;

    tabRemoved = false;

}


// listen for activated tabs
chrome.tabs.onActivated.addListener(async function(tab) {

    if (currWindow !== tab.windowId) { return; }

    let activeTab = await queryTab();

    if (currentTab === activeTab.id) { return; }

    oldTab = tabRemoved ? tab.tabId : currentTab;
    currentTab = tab.tabId;
    tabRemoved = false;

    // console.log('Old/Curr Tabs: ', oldTab, currentTab)

});


// listen for activated tabs across browser windows
chrome.windows.onFocusChanged.addListener(async(windowId) => {

    if (!windowId || windowId === -1) { return; }

    oldWindow = currWindow;
    currWindow = windowId;

    let activeTab = await queryTab();

    if (currentTab === activeTab.id) { return; }

    oldTab = currentTab;
    currentTab = activeTab.id;

    // console.log("window switch: ", oldWindow, currWindow);
    // console.log('Old/Curr Tabs: ', oldTab, currentTab)

});


function getOldTab() {

    return new Promise((resolve, reject) => {

        chrome.tabs.get(oldTab, (tab) => {

            resolve(tab);

        });

    });

}


function queryTab() {

    return new Promise((resolve, reject) => {

        chrome.tabs.query({ lastFocusedWindow: true, windowType: 'normal', active: true }, (tabs) => {

            resolve(tabs[0]);

        });

    });

}


//listen for closed tabs
chrome.tabs.onRemoved.addListener(function() {

    tabRemoved = true;

});


//listen for hotkey press
chrome.commands.onCommand.addListener(async function(command) {

    if (command == "switch") {

        let oldTabInfo = await getOldTab();

        chrome.tabs.update(oldTab, { active: true });
        if (oldTabInfo.windowId !== currWindow) { chrome.windows.update(oldWindow, { focused: true }); }

    }

    // console.log('Hotkey Pressed - Old/Curr Tabs & Curr Window: ', oldTab, currentTab, currWindow)

});