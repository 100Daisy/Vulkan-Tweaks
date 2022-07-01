const Button = document.getElementById("addtowhitelist");
const saveLast = document.getElementById("saveLast");
const themeTransition = document.getElementById("themeTransition");
const selectTheme = document.getElementById("themes");
chrome.storage.sync.get("url", function(whitelist){
    for (let i = 0; i < whitelist.url.length; i++) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) { 
            if (whitelist.url[i] == tabs[0].url) {
                Button.innerText = "Disable on this site!"
            }
        });
    }
});

chrome.storage.sync.get("saveLast", function(status){
    if (status.saveLast) {
        saveLast.checked = true
        console.log(`Restoring save last choice checkbox to ${status.saveLast}.`);
    } else {
        saveLast.checked = false
        console.log(`Restoring save last choice checkbox to ${status}.`);
    }
});
chrome.storage.sync.get("theme", function(status){
    selectTheme.value = status.theme
    console.log(`Restoring theme select to ${status.theme}.`)
});

chrome.storage.sync.get("onLoadAnim", function(animation){
    if (animation.onLoadAnim) {
        themeTransition.checked = true
        console.log(`Restoring theme transition checkbox to ${animation.onLoadAnim}.`);
    } else {
        themeTransition.checked = false
        console.log(`Restoring theme transtion checkbox to ${animation.onLoadAnim}.`)
    }
});

Button.addEventListener('click', function () {
    chrome.storage.sync.get("url", function(whitelist){
        if (whitelist.url) {
            if (whitelist.url.length > 0) {
                whitelist = whitelist.url
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) { 
                    if (whitelist.includes(tabs[0].url)) {
                            whitelist = whitelist.filter(function(value, index, arr){ 
                                return value != tabs[0].url;
                            });
                            chrome.storage.sync.set({ "url": whitelist }, function(){
                                console.log('Site removed from whitelist.')
                                Button.innerText = "Enable on this site!"
                            });
                    } else {

                            whitelist.push(tabs[0].url)
                            chrome.storage.sync.set({ "url": whitelist }, function(){
                                console.log('Site adden to whitelist.')
                                Button.innerText = "Disable on this site!"
                            });
                    }
                });
            } else {
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) { 
                    chrome.storage.sync.set({ "url": [tabs[0].url] }, function(){
                        console.log('Site adden to whitelist.')
                        Button.innerText = "Disable on this site!"
                    });
                });
            }
        } else {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) { 
                chrome.storage.sync.set({ "url": [tabs[0].url] }, function(){
                    console.log('Site adden to whitelist.')
                    Button.innerText = "Disable on this site!"
                });
            });
        }
    });
});

saveLast.addEventListener('click', function () {
    if (saveLast.checked) {
        chrome.storage.sync.set({ "saveLast": true }, function(){
            console.log('Setting save last choice to true.');
        });
    } else {
        chrome.storage.sync.set({ "saveLast": false }, function(){
            console.log('Setting save last choice to false.')
        });
    }
});

themeTransition.addEventListener('click', function () {
    if (themeTransition.checked) {
        chrome.storage.sync.set({ "onLoadAnim": true }, function(){
            console.log('Setting theme transition to true.')
        });
    } else {
        chrome.storage.sync.set({ "onLoadAnim": false }, function(){
            console.log('Setting theme transition to false.')
        });
    }
});
selectTheme.onchange = () => {
    value = selectTheme.options[selectTheme.selectedIndex].innerHTML
    chrome.storage.sync.set({ "isChangePending": true }, function(){
        console.log('This reload is a theme change!');
    });   
    chrome.storage.sync.set({ "theme": value }, function(){
        console.log(`Theme selected ${value}.`);
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) { 
            chrome.tabs.update(tabs[0].id, {url: tabs[0].url});
        });
    });
  }