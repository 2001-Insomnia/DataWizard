// state_registry.js — DataWizard 2.1
// ,------.            ,--.                     ,--.                         ,--.
// |  .-.  \  ,--,--.,-'  '-. ,--,--.,--.   ,--.`--',-----. ,--,--.,--.--. ,-|  |
// |  |  \  :' ,-.  |'-.  .-'' ,-.  ||  |.'.|  |,--.`-.  / ' ,-.  ||  .--'' .-. |
// |  '--'  /\ '-'  |  |  |  \ '-'  ||   .'.   ||  | /  `-.\ '-'  ||  |   \ `-' |
// `-------'  `--`--'  `--'   `--`--''--'   '--'`--'`-----' `--`--'`--'    `---' 
// i'm planning to eventually add new states here as their CSV data becomes available.
// Each entry maps a state code to its display name and data object.

const STATE_REGISTRY = {
  CA: {
    name: 'California',
    dataLoaded: true,
    getData: () => CALIFORNIA_DATA   // defined in california_data.js
  },
  CO: {
    name: 'Colorado',
    dataLoaded: true,
    getData: () => COLORADO_DATA   // defined in colorado_data.js
  },
  FL: {
    name: 'Florida',
    dataLoaded: true,
    getData: () => FLORIDA_DATA   // defined in florida_data.js
  },
  MA: {
    name: 'Massachusetts',
    dataLoaded: true,
    getData: () => MASSACHUSETTS_DATA   // defined in massachusetts_data.js
  },
  NJ: {
    name: 'New Jersey',
    dataLoaded: true,
    getData: () => NEW_JERSEY_DATA   // defined in newjersey_data.js
  },
  NY: {
    name: 'New York',
    dataLoaded: false,
    getData: () => ({})
  }
};
