// content.js — Datawizard 2.2
// ,------.            ,--.                     ,--.                         ,--.
// |  .-.  \  ,--,--.,-'  '-. ,--,--.,--.   ,--.`--',-----. ,--,--.,--.--. ,-|  |
// |  |  \  :' ,-.  |'-.  .-'' ,-.  ||  |.'.|  |,--.`-.  / ' ,-.  ||  .--'' .-. |
// |  '--'  /\ '-'  |  |  |  \ '-'  ||   .'.   ||  | /  `-.\ '-'  ||  |   \ `-' |
// `-------'  `--`--'  `--'   `--`--''--'   '--'`--'`-----' `--`--'`--'    `---' 
//     _                _                      _   _           
//  __| | _____   _____| | ___  _ __   ___  __| | | |__  _   _ 
// / _` |/ _ \ \ / / _ \ |/ _ \| '_ \ / _ \/ _` | | '_ \| | | |
//| (_| |  __/\ V /  __/ | (_) | |_) |  __/ (_| | | |_) | |_| |
// \__,_|\___| \_/_\___|_|\___/| .__/_\___|\__,_| |_.__/ \__, |
//(_)_ __  ___ / _ \ _ __ ___  |_|_ | | __ _             |___/ 
//| | '_ \/ __| | | | '_ ` _ \| '_ \| |/ _` |                  
//| | | | \__ \ |_| | | | | | | | | |_| (_| |                  
//|_|_| |_|___/\___/|_| |_| |_|_| |_(_)\__,_|   
//this is a passive listener; actual injection is done via chrome.scripting.executeScript

(function () {
  if (window.__floridaTaxFillLoaded) return;
  window.__floridaTaxFillLoaded = true;

  chrome.runtime.onMessage && chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg.action === 'ping') {
      sendResponse({ ok: true });
    }
  });
})();
