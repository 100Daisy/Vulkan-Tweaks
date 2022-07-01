const Button = document.getElementById("addtowhitelist");
const Option1 = document.getElementById("Option1");
const Option2 = document.getElementById("Option2");
const selectTheme = document.getElementById("themes");
chrome.storage.sync.get("url", function(test){
    for (let i = 0; i < test.url.length; i++) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) { 
            if (test.url[i] == tabs[0].url) {
                Button.innerText = "Disable on this site!"
            }
        });
    }
});

chrome.storage.sync.get("saveLast", function(status){
    if (status.saveLast) {
        Option1.checked = true
        console.log(`Restoring save last choice checkbox to ${status.saveLast}.`);
    } else {
        Option1.checked = false
        console.log(`Restoring save last choice checkbox to ${status}.`);
    }
});
chrome.storage.sync.get("theme", function(status){
    selectTheme.value = status.theme
    console.log(`Restoring theme select to ${status.theme}.`)
});

chrome.storage.sync.get("onLoadAnim", function(animation){
    if (animation.onLoadAnim) {
        Option2.checked = true
        console.log(`Restoring theme transition checkbox to ${animation.onLoadAnim}.`);
    } else {
        Option2.checked = false
        console.log(`Restoring theme transtion checkbox to ${animation.onLoadAnim}.`)
    }
});

Button.addEventListener('click', function () {
    chrome.storage.sync.get("url", function(array){
        if (array.url) {
            if (array.url.length > 0) {
                array = array.url
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) { 
                    if (array.includes(tabs[0].url)) {
                            array = array.filter(function(value, index, arr){ 
                                return value != tabs[0].url;
                            });
                            chrome.storage.sync.set({ "url": array }, function(){
                                console.log('Site removed from whitelist.')
                                Button.innerText = "Enable on this site!"
                            });
                    } else {

                            array.push(tabs[0].url)
                            chrome.storage.sync.set({ "url": array }, function(){
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

Option1.addEventListener('click', function () {
    if (Option1.checked) {
        chrome.storage.sync.set({ "saveLast": true }, function(){
            console.log('Setting save last choice to true.');
        });
    } else {
        chrome.storage.sync.set({ "saveLast": false }, function(){
            console.log('Setting save last choice to false.')
        });
    }
});

Option2.addEventListener('click', function () {
    if (Option2.checked) {
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