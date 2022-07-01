var vulkan_header = document.getElementsByName("description")[0];
var pattern = '<meta name="description" content=". Plan lekcji utworzony za pomocą programu Plan lekcji Optivum firmy VULCAN">'

if (vulkan_header.outerHTML != pattern) {
  throw new Error("Common header is not detected. Extension will abort.");
}

var ramka = document.getElementsByName("plan")[0];
var lista = document.getElementsByName("list")[0];

chrome.storage.sync.get("saveLast", function(status){
  if (status.saveLast) {
    let klasa = localStorage.getItem('klasa');
    console.log(`Last known choice is ${klasa}.`);
    for (const a of lista.contentDocument.querySelectorAll("a")) {
      if (a.textContent.includes(klasa)) {
        console.log('Restoring choice!');
        a.click();
        break;
      }
    }
  }
});


var ramka_theme = document.createElement('style');
var bgcolor = '#262626'
ramka_theme.textContent = `
th {
  color: #383838;
}
.p {
  color: white;
}
a {
  color: white;
}
a.n {
  color: white;
}
a.s {
  color: white;
}
.tytul {
  background-color: #1c1c1c;
}
body {
  background-color: ${bgcolor};
}
tr {
  border: 0;
}
.tytul {
  border: 0;
}
table {
  background-color: ${bgcolor};
  border: 0;
}
th {
  background-color: #1c1c1c;
  border: 0;
}
td {
  background-color: ${bgcolor};
  border: 0;
}
td.l {
  background-color: #2e2e2e;
  border: 0;
}
td.g {
  background-color: #212121;
  border: 0;
  color: #383838;
}
td.nr {
  background-color: #1c1c1c;
  border: 0;
  color: #383838;
}
`
var list_theme = document.createElement('style');
list_theme.textContent = `
body {
  background-color: #1c1c1c;
  color: white;
}
`

var animate = document.createElement('style');
animate.textContent = `
@keyframes fadeIn{
  0% {
    opacity:0;
  }
  100% {
    opacity:1;
  }
}

html {
  animation: fadeIn ease 2s;
}
`
Dark = [ramka_theme, list_theme]
  chrome.storage.sync.get("theme", function(theme){
    ramka.contentDocument.head.appendChild(window[theme.theme][0]);
  });
chrome.storage.sync.get("isChangePending", function(themeChangePending){
  if (themeChangePending.isChangePending) {
    chrome.storage.sync.get("onLoadAnim", function(animation){
      if (animation.onLoadAnim) {
        console.log('Theme change pending, Starting FadeIn animation.');
        document.head.appendChild(animate);
      }
    });
    chrome.storage.sync.set({ "isChangePending": false }, function(){
      console.log('Theme change finished!')
    });    
  }
});
chrome.storage.sync.get("theme", function(theme){
  console.log(`Theme is set to ${theme.theme}.`);
  console.log('Applying theme for side panel.');
  lista.contentDocument.head.appendChild(window[theme.theme][1]);
  console.log('Applying theme for frame.')
});
ramka.onload = function() {
  chrome.storage.sync.get("theme", function(theme){
    ramka.contentDocument.head.appendChild(window[theme.theme][0]);
  });
  chrome.storage.sync.get("saveLast", function(status){
    if (status.saveLast) {
      var klasa = ramka.contentDocument.getElementsByClassName("tytulnapis")[0].innerHTML;
      console.log(`New known choice ${klasa}!`);
      localStorage.setItem('klasa', klasa);
    }
  });
}
