//popup.js — DataWizard v2.2.3
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


const stateSelect     = document.getElementById('stateSelect');
const countySelect    = document.getElementById('countySelect');
const stateBadge      = document.getElementById('stateBadge');
const btnAppraiser    = document.getElementById('btnAppraiser');
const btnCollector    = document.getElementById('btnCollector');
const btnInspect      = document.getElementById('btnInspect');
const btnClearFields  = document.getElementById('btnClearFields');
const previewEmpty    = document.getElementById('previewEmpty');
const comingSoon      = document.getElementById('comingSoon');
const comingSoonState = document.getElementById('comingSoonState');
const infoCard        = document.getElementById('infoCard');
const statusDot       = document.getElementById('statusDot');
const statusText      = document.getElementById('statusText');
const fieldsPanel     = document.getElementById('fieldsPanel');
const fieldsList      = document.getElementById('fieldsList');
const noFields        = document.getElementById('noFields');

let currentStateCode = '';
let currentStateData = {};

//Memory restore last session
chrome.storage.local.get(['lastState', 'lastCounty'], ({ lastState, lastCounty }) => {
  if (lastState) {
    stateSelect.value = lastState;
    handleStateChange(lastState, lastCounty);
  }
});

stateSelect.addEventListener('change', () => {
  const code = stateSelect.value;
  chrome.storage.local.set({ lastState: code, lastCounty: '' });
  handleStateChange(code, null);
});

function handleStateChange(code, restoreCounty) {
  currentStateCode = code;
  countySelect.innerHTML = '';
  hidePreview();

  if (!code) {
    countySelect.appendChild(makeOpt('', '— Select a state first —'));
    countySelect.disabled = true;
    setButtons(false);
    stateBadge.style.display = 'none';
    setStatus('', 'Ready — select a state to begin');
    return;
  }

  const stateInfo = STATE_REGISTRY[code];

  if (!stateInfo || !stateInfo.dataLoaded) {
    countySelect.appendChild(makeOpt('', `— No data yet for ${stateInfo?.name || code} —`));
    countySelect.disabled = true;
    setButtons(false);
    stateBadge.textContent = 'coming soon';
    stateBadge.className = 'state-badge';
    stateBadge.style.display = 'inline-flex';
    showComingSoon(stateInfo?.name || code);
    setStatus('', `${stateInfo?.name || code} data coming soon`);
    return;
  }

  currentStateData = stateInfo.getData();
  stateBadge.textContent = '✓ ready';
  stateBadge.className = 'state-badge ready';
  stateBadge.style.display = 'inline-flex';

  countySelect.appendChild(makeOpt('', '— Choose a county —'));
  Object.keys(currentStateData).sort().forEach(county => {
    countySelect.appendChild(makeOpt(county, `${county} County`));
  });
  countySelect.disabled = false;

  if (restoreCounty && currentStateData[restoreCounty]) {
    countySelect.value = restoreCounty;
    handleCountyChange(restoreCounty);
  } else {
    setButtons(false);
    setStatus('', `${stateInfo.name} loaded — select a county`);
  }
}

function makeOpt(value, text) {
  const o = document.createElement('option');
  o.value = value; o.textContent = text; return o;
}

countySelect.addEventListener('change', () => {
  const county = countySelect.value;
  chrome.storage.local.set({ lastCounty: county });
  handleCountyChange(county);
});

function handleCountyChange(county) {
  if (!county) { setButtons(false); hidePreview(); return; }
  setButtons(true);
  showPreview(county, 'appraiser');
  setStatus('', `${county} County, ${STATE_REGISTRY[currentStateCode]?.name}`);
}

function showPreview(county, type) {
  const d = currentStateData[county];
  if (!d) return;
  const info = type === 'appraiser' ? d.propertyAppraiser : d.taxCollector;
  const isPA = type === 'appraiser';
  previewEmpty.style.display = 'none';
  comingSoon.style.display = 'none';
  infoCard.classList.add('visible');
  infoCard.innerHTML = `
    <span class="info-type ${isPA ? 'appraiser' : 'collector'}">
      ${isPA ? '🏠 Property Appraiser' : '💰 Tax Collector'}
    </span>
    <div class="info-row"><span class="info-key">Name</span><span class="info-val">${info.name}</span></div>
    <div class="info-row"><span class="info-key">Address</span><span class="info-val">${info.address || '—'}</span></div>
    <div class="info-row"><span class="info-key">Phone</span><span class="info-val">${info.phone || '—'}</span></div>
  `;
}

function hidePreview() {
  previewEmpty.style.display = 'block';
  comingSoon.style.display = 'none';
  infoCard.classList.remove('visible');
}

function showComingSoon(stateName) {
  previewEmpty.style.display = 'none';
  infoCard.classList.remove('visible');
  comingSoon.style.display = 'block';
  comingSoonState.textContent = `${stateName} county data will be added shortly.`;
}

function setButtons(on) {
  btnAppraiser.disabled = !on;
  btnCollector.disabled = !on;
}

//buttons
btnAppraiser.addEventListener('click', () => {
  showPreview(countySelect.value, 'appraiser');
  fillForm('appraiser');
});
btnCollector.addEventListener('click', () => {
  showPreview(countySelect.value, 'collector');
  fillForm('collector');
});

async function fillForm(type) {
  const county = countySelect.value;
  if (!county) { setStatus('error', 'Please select a county first'); return; }
  const info  = currentStateData[county][type === 'appraiser' ? 'propertyAppraiser' : 'taxCollector'];
  const label = type === 'appraiser' ? 'Property Appraiser' : 'Tax Collector';
  setStatus('working', `Filling ${label} info...`);
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: injectFillForm,
      args: [info, type]
    });
    const r = results[0]?.result;
    if (r?.success) {
      setStatus('success', `✓ Filled ${r.filled} field(s) — ${label}`);
    } else {
      setStatus('error', `No matching fields found — use Inspect to see field names`);
    }
  } catch (err) {
    setStatus('error', 'Error: ' + (err.message || 'Cannot access this page'));
  }
}

// Inspect
btnInspect.addEventListener('click', async () => {
  setStatus('working', 'Scanning page for form fields...');
  fieldsPanel.classList.add('open');
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: injectGetFields
    });
    const fields = results[0]?.result || [];
    displayFields(fields);
    setStatus(fields.length > 0 ? 'success' : '', `Found ${fields.length} field(s) on page`);
  } catch (err) {
    setStatus('error', 'Cannot inspect this page');
    noFields.textContent = 'Cannot access this page.';
    noFields.style.display = 'block';
    fieldsList.innerHTML = '';
  }
});

btnClearFields.addEventListener('click', () => {
  fieldsPanel.classList.remove('open');
  fieldsList.innerHTML = '';
  noFields.textContent = 'Click "Inspect Page Fields" to scan.';
  noFields.style.display = 'block';
});

function displayFields(fields) {
  fieldsList.innerHTML = '';
  if (!fields || fields.length === 0) {
    noFields.style.display = 'block';
    noFields.textContent = 'No visible input fields found.';
    return;
  }
  noFields.style.display = 'none';
  const AUTO_KEYS = ['name', 'contact', 'payable', 'address', 'phone', 'telephone'];
  fields.forEach(f => {
    const tag = document.createElement('div');
    tag.className = 'field-tag';
    const id = f.label || f.ngModel || f.name || f.id || f.placeholder || '(unnamed)';
    const matched = AUTO_KEYS.some(k => id.toLowerCase().includes(k));
    tag.innerHTML = `<span class="field-tag-type">${f.type}</span><span title="${f.ngModel || ''}">${id}</span>${matched ? '<span class="mapping-badge">auto-fill</span>' : ''}`;
    fieldsList.appendChild(tag);
  });
}

function setStatus(type, msg) {
  statusText.textContent = msg;
  statusDot.className = 'status-dot' + (type ? ` ${type}` : '');
  if (type === 'success' || type === 'error') {
    setTimeout(() => { statusDot.className = 'status-dot'; }, 4000);
  }
}

// ██▓ ███▄    █  ▄▄▄██▀▀▀▓█████  ▄████▄  ▄▄▄█████▓ ██▓ ▒█████   ███▄    █   ██████ 
//▓██▒ ██ ▀█   █    ▒██   ▓█   ▀ ▒██▀ ▀█  ▓  ██▒ ▓▒▓██▒▒██▒  ██▒ ██ ▀█   █ ▒██    ▒ 
//▒██▒▓██  ▀█ ██▒   ░██   ▒███   ▒▓█    ▄ ▒ ▓██░ ▒░▒██▒▒██░  ██▒▓██  ▀█ ██▒░ ▓██▄   
//░██░▓██▒  ▐▌██▒▓██▄██▓  ▒▓█  ▄ ▒▓▓▄ ▄██▒░ ▓██▓ ░ ░██░▒██   ██░▓██▒  ▐▌██▒  ▒   ██▒
//░██░▒██░   ▓██░ ▓███▒   ░▒████▒▒ ▓███▀ ░  ▒██▒ ░ ░██░░ ████▓▒░▒██░   ▓██░▒██████▒▒
//░▓  ░ ▒░   ▒ ▒  ▒▓▒▒░   ░░ ▒░ ░░ ░▒ ▒  ░  ▒ ░░   ░▓  ░ ▒░▒░▒░ ░ ▒░   ▒ ▒ ▒ ▒▓▒ ▒ ░
// ▒ ░░ ░░   ░ ▒░ ▒ ░▒░    ░ ░  ░  ░  ▒       ░     ▒ ░  ░ ▒ ▒░ ░ ░░   ░ ▒░░ ░▒  ░ ░
// ▒ ░   ░   ░ ░  ░ ░ ░      ░   ░          ░       ▒ ░░ ░ ░ ▒     ░   ░ ░ ░  ░  ░  
// ░           ░  ░   ░      ░  ░░ ░                ░      ░ ░           ░       ░  
//                               ░                                                  


 // Grab every visible text input including Angularbound 
function injectGetFields() {
  const els = Array.from(document.querySelectorAll(
    'input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="checkbox"]):not([type="radio"]):not([type="file"]), textarea, select'
  )).filter(el => {
    const s = window.getComputedStyle(el);
    return s.display !== 'none' && s.visibility !== 'hidden' && el.offsetParent !== null;
  });

  function getLabel(el) {
    let t = '';
    if (el.id) { try { const l = document.querySelector(`label[for="${CSS.escape(el.id)}"]`); if (l) t = l.textContent.trim(); } catch(e){} }
    if (!t) { const p = el.closest('label'); if (p) t = p.textContent.trim(); }
    if (!t) {
      let sib = el.previousElementSibling;
      while (sib) { const tx = sib.textContent.trim(); if (tx) { t = tx; break; } sib = sib.previousElementSibling; }
    }
    if (!t) {
      const fg = el.closest('.form-group, .field-row, .row, tr');
      if (fg) {
        const lbl = fg.querySelector('label, .col-md-4, .col-sm-4, .field-label, td:first-child');
        if (lbl && lbl !== el) t = lbl.textContent.trim();
      }
    }
    if (!t) t = el.getAttribute('aria-label') || '';
    return t.replace(/\s+/g, ' ').trim().slice(0, 80);
  }

  return els.map(el => ({
    type: el.type || el.tagName.toLowerCase(),
    name: el.name || '',
    id: el.id || '',
    placeholder: el.placeholder || '',
    ngModel: el.getAttribute('ng-model') || el.getAttribute('[(ngModel)]') || el.getAttribute('data-ng-model') || '',
    label: getLabel(el)
  }));
}

function injectFillForm(info, type) {
   const TARGETS = [
    {
      key: 'name',
      value: info.name,
      fillAll: true,  
      labelP:  ['name', 'payable to', 'payable', 'contact name', 'contact', 'company', 'authority name', 'tax authority'],
      excludeLabels: ['type'],
      attrP:   ['name', 'payableto', 'payable_to', 'contactname', 'contact_name', 'taxauthorityname', 'authorityname'],
      ngP:     ['name', 'payableto', 'payable', 'contactname', 'authority']
    },
    {
      key: 'address',
      value: info.address,
      fillAll: false,
      labelP:  ['address', 'addr', 'street', 'mailing', 'physical address', 'office address', 'location'],
      attrP:   ['address', 'addr', 'street', 'mailing', 'location'],
      ngP:     ['address', 'addr', 'street', 'mailing']
    },
    {
      key: 'phone',
      value: info.phone,
      fillAll: false,
      labelP:  ['phone', 'phone number', 'telephone', 'tel', 'contact phone', 'office phone'],
      attrP:   ['phone', 'telephone', 'tel', 'phonenumber', 'phone_number'],
      ngP:     ['phone', 'telephone', 'tel']
    },
    {
      key: 'type',
      value: 'County',
      fillAll: false,
      exactLabel: 'type',   // this single line solved so many issues lol
      labelP:  ['type'],
      attrP:   ['type'],
      ngP:     ['type']
    }
  ];
  function getLabel(el) {
    let t = '';

    if (el.id) {
      try {
        const l = document.querySelector('label[for="' + CSS.escape(el.id) + '"]');
        if (l) t = l.textContent.trim();
      } catch(e) {}
    }

    if (!t) { const p = el.closest('label'); if (p) t = p.textContent.trim(); }

    if (!t) {
      let sib = el.previousElementSibling;
      while (sib) {
        const tx = sib.textContent.trim();
        if (tx && !sib.querySelector('input,textarea,select')) { t = tx; break; }
        sib = sib.previousElementSibling;
      }
    }

    //    Handles Bootstrap form-group: <div class="form-group"><label class="col-md-4">Address:</label><div class="col-md-8"><input></div></div>
    if (!t) {
      let node = el.parentElement;
      let depth = 0;
      while (node && depth < 6) {
        // Find siblings of this node that come before it and look like labels
        const parent = node.parentElement;
        if (parent) {
          const kids = Array.from(parent.children);
          const myIdx = kids.indexOf(node);
          for (let i = myIdx - 1; i >= 0; i--) {
            const sib = kids[i];
            if (sib.contains && sib.contains(el)) continue;
            const tx = sib.textContent.trim();
            if (tx && tx.length < 60 && !sib.querySelector('input,textarea,select')) {
              t = tx; break;
            }
          }
        }
        if (t) break;
        node = node.parentElement;
        depth++;
      }
    }

    // aria-label placeholder fallback
    if (!t) t = el.getAttribute('aria-label') || el.getAttribute('placeholder') || '';

    return t.replace(/[:\*]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
  }

  function score(el, target) {
    const label   = getLabel(el);
    const name    = (el.name || '').toLowerCase();
    const id      = (el.id   || '').toLowerCase();
    const ph      = (el.placeholder || '').toLowerCase();
    const ngModel = (
      el.getAttribute('ng-model') ||
      el.getAttribute('data-ng-model') ||
      el.getAttribute('[(ngModel)]') || ''
    ).toLowerCase();

    if (target.exactLabel) {
      return label.trim() === target.exactLabel ? 999 : 0;
    }

    if (target.excludeLabels && target.excludeLabels.some(ex => label.trim() === ex)) {
      return 0;
    }

    let s = 0;

    const ngTail = ngModel.split('.').pop().replace(/\[.*?\]/g, '');
    for (const p of target.ngP) {
      if (ngTail === p)          s += p.length * 10; // exact tail match, strongest signal
      else if (ngModel.endsWith('.' + p)) s += p.length * 8;
      else if (ngModel.includes(p))       s += p.length * 3;
    }
    for (const p of target.labelP) {
      if (label.includes(p)) s += p.length * 4;
    }
    for (const p of target.attrP) {
      if (name.includes(p) || id.includes(p)) s += p.length * 2;
      if (ph.includes(p)) s += p.length;
    }

    return s;
  }
  //The most reliable way to set a value on an AngularJS ng-model from outside  is to call $setViewValue() on the ngModelController directly, then $render().
  // This bypasses all the $scope/$ctrl path issues and works regardless of how deep the binding is.
 //                        _                                              __ _ _ 
//  __ _ _ __   __ _ _   _| | __ _ _ __    __ ___      ____ _ _ __ ___   / _| | |
// / _` | '_ \ / _` | | | | |/ _` | '__|  / _` \ \ /\ / / _` | '__/ _ \ | |_| | |
//| (_| | | | | (_| | |_| | | (_| | |    | (_| |\ V  V / (_| | | |  __/ |  _| | |
// \__,_|_| |_|\__, |\__,_|_|\__,_|_|     \__,_| \_/\_/ \__,_|_|  \___| |_| |_|_|
//             |___/                                                             


  function fillEl(el, value) {
    let filled = false;

    try {
      if (typeof angular !== 'undefined' && angular.element) {
        const $el      = angular.element(el);
        const ngCtrl   = $el.controller('ngModel');

        if (ngCtrl) {
          el.value = value;

          // $setViewValue runs the $parsers chain and marks field dirty/touched
          // $commitViewValue flushes any debounce immediately
          // $render pushes the value back to the DOM view
          const scope = $el.scope();
          if (scope && !scope.$$phase) {
            scope.$apply(() => {
              ngCtrl.$setViewValue(value);
              ngCtrl.$commitViewValue();
            });
          } else {
            ngCtrl.$setViewValue(value);
            ngCtrl.$commitViewValue();
          }

          ngCtrl.$render();

          filled = true;
        }
      }
    } catch(e) {}

    if (!filled) {
      try {
        const proto = el.tagName === 'TEXTAREA'
          ? window.HTMLTextAreaElement.prototype
          : window.HTMLInputElement.prototype;
        const nativeSetter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
        if (nativeSetter) nativeSetter.call(el, value);
        else el.value = value;
      } catch(e) { el.value = value; }

      ['input', 'change', 'blur'].forEach(evt => {
        try { el.dispatchEvent(new Event(evt, { bubbles: true })); } catch(e) {}
      });
    }

    flash(el, type);
  }

  function flash(el, type) {
    const color = type === 'appraiser' ? 'rgba(65,183,128,0.25)' : 'rgba(65,183,128,0.15)';
    const orig  = el.style.backgroundColor;
    el.style.transition = 'background-color 0.2s';
    el.style.backgroundColor = color;
    setTimeout(() => { el.style.transition = 'background-color 0.8s'; el.style.backgroundColor = orig; }, 900);
  }

 const inputs = Array.from(document.querySelectorAll(
  'input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="checkbox"]):not([type="radio"]):not([type="file"]), textarea'
)).filter(el => {
  const s = window.getComputedStyle(el);
  if (s.display === 'none' || s.visibility === 'hidden' || el.offsetParent === null) return false;
  // side panel overfill fix 
  const r = el.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  if (cx >= window.innerWidth * 0.40) return false;
  return true;
});

  const used = new Set();
  let filled = 0;

  for (const target of TARGETS) {
    if (!target.value) continue;

    const scored = inputs
      .map(el => ({ el, s: score(el, target) }))
      .filter(x => x.s > 0 && !used.has(x.el))
      .sort((a, b) => b.s - a.s);

    if (!scored.length) continue;
    const toFill = target.fillAll ? scored : [scored[0]];

    for (const { el } of toFill) {
      used.add(el);
      fillEl(el, target.value);
      filled++;
    }
  }

  return { success: filled > 0, filled };
}
