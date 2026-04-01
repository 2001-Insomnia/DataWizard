// state_registry.js — DataWizard 2.1
// ,------.            ,--.                     ,--.                         ,--.
// |  .-.  \  ,--,--.,-'  '-. ,--,--.,--.   ,--.`--',-----. ,--,--.,--.--. ,-|  |
// |  |  \  :' ,-.  |'-.  .-'' ,-.  ||  |.'.|  |,--.`-.  / ' ,-.  ||  .--'' .-. |
// |  '--'  /\ '-'  |  |  |  \ '-'  ||   .'.   ||  | /  `-.\ '-'  ||  |   \ `-' |
// `-------'  `--`--'  `--'   `--`--''--'   '--'`--'`-----' `--`--'`--'    `---' 
// i'm planning to eventually add new states here as their CSV data becomes available.
// Each entry maps a state code to its display name and data object.

const STATE_REGISTRY = {
  FL: {
    name: 'Florida',
    dataLoaded: true,
    getData: () => FLORIDA_DATA   // defined in florida_data.js
  },
  CO: {
    name: 'Colorado',
    dataLoaded: false,
    getData: () => ({})
  },
  NY: {
    name: 'New York',
    dataLoaded: false,
    getData: () => ({})
  },
  NJ: {
    name: 'New Jersey',
    dataLoaded: false,
    getData: () => ({})
  }
};
