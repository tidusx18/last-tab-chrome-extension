/**
 * @author: Hasin Hayder [hasin_at_leevio_dot_com | http://hasin.me] NO LONGER SUPPORTS THIS EXTENSION
 * @author: Daniel Victoriano <victorianowebdesign@gmail.com>
 * @license: MIT
 */
let currentTab = chrome.tabs.query({ lastFocusedWindow: true, active: true }, async(tabs) => { return tabs[0] });
let oldTab = currentTab;
let tabRemoved = false;

chrome.tabs.onActivated.addListener(function(activeInfo) {

	oldTab = tabRemoved ? activeInfo.tabId : currentTab;
	currentTab = activeInfo.tabId;

    // console.log('\n\r')
    // console.log(`Current Tab: ${currentTab}`)
    // console.log(`Old Tab: ${oldTab}`)

    tabRemoved = false;

});

//listen for the Alt + Z keypress event
chrome.commands.onCommand.addListener(function(command) {

    if (command == "switch") {

        // console.log('\n\r')
        // console.log('Switching tabs')
        // console.log(`Current Tab: ${currentTab}`)
        // console.log(`Old Tab: ${oldTab}`)

        chrome.tabs.update(oldTab, { selected: true });
    }
});

//listen when a tab is closed
chrome.tabs.onRemoved.addListener(function() {

    tabRemoved = true;
});

// function setOldTab() {

// 	if(tabRemoved) { old }
// 	if(!tabRemoved) {  }
// }