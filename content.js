// Get site whitelist.
chrome.storage.sync.get("url", function(array){
  // Check if current site is in whitelist.
  if (array.url.includes(window.location.href)) {
    var ramka = document.getElementsByName("plan")[0];
    var lista = document.getElementsByName("list")[0];
    // Simulate click on last clicked class entry.
    chrome.storage.sync.get("saveLast", function(status){
      if (status.saveLast) {
        let klasa = localStorage.getItem('klasa');
        for (const a of lista.contentDocument.querySelectorAll("a")) {
          if (a.textContent.includes(klasa)) {
            a.click();
            break;
          }
        }
      }
    });

    // Styles - Need to rework this later.
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
    // Merge list and iframe css into one.
    Dark = [ramka_theme, list_theme]
      chrome.storage.sync.get("theme", function(theme){
        ramka.contentDocument.head.appendChild(window[theme.theme][0]);
        lista.contentDocument.head.appendChild(window[theme.theme][1]);
      });
      // Check if theme change is ongoing.
      chrome.storage.sync.get("isChangePending", function(themeChangePending){
        if (themeChangePending.isChangePending) {
          // Check if theme transition is allowed.
          chrome.storage.sync.get("onLoadAnim", function(animation){
            if (animation.onLoadAnim) {
              // Append animation css.
              document.head.appendChild(animate);
            }
          });
          // Set that theme change finished.
          chrome.storage.sync.set({ "isChangePending": false }, function(){
          });    
        }
      });
      // Apply theme on every iframe load.
      ramka.onload = function() {
        chrome.storage.sync.get("theme", function(theme){
          ramka.contentDocument.head.appendChild(window[theme.theme][0]);
          lista.contentDocument.head.appendChild(window[theme.theme][1]);
        });
        chrome.storage.sync.get("saveLast", function(status){
          if (status.saveLast) {
            var klasa = ramka.contentDocument.getElementsByClassName("tytulnapis")[0].innerHTML;
            localStorage.setItem('klasa', klasa);
          }
        });
      }
  } else {
    // Site is not whitelisted. Abort.
  }
});

