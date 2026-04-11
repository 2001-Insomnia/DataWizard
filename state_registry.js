// state_registry.js — DataWizard 2.2.3
// ,------.            ,--.                     ,--.                         ,--.
// |  .-.  \  ,--,--.,-'  '-. ,--,--.,--.   ,--.`--',-----. ,--,--.,--.--. ,-|  |
// |  |  \  :' ,-.  |'-.  .-'' ,-.  ||  |.'.|  |,--.`-.  / ' ,-.  ||  .--'' .-. |
// |  '--'  /\ '-'  |  |  |  \ '-'  ||   .'.   ||  | /  `-.\ '-'  ||  |   \ `-' |
// `-------'  `--`--'  `--'   `--`--''--'   '--'`--'`-----' `--`--'`--'    `---' 
// Each entry maps a state code to its display name and data object.
//NEW STATES CA, CO, MA, NJ

const STATE_REGISTRY = {
  CA: {
    name: 'California',
    dataLoaded: true,
    getData: () => CALIFORNIA_DATA   
  },
  CO: {
    name: 'Colorado',
    dataLoaded: true,
    getData: () => COLORADO_DATA   
  },
  FL: {
    name: 'Florida',
    dataLoaded: true,
    getData: () => FLORIDA_DATA   
  },
  MA: {
    name: 'Massachusetts',
    dataLoaded: true,
    getData: () => MASSACHUSETTS_DATA   
  },
  NJ: {
    name: 'New Jersey',
    dataLoaded: true,
    getData: () => NEW_JERSEY_DATA   
  },
  NY: {
    name: 'New York',
    dataLoaded: false,
    getData: () => ({})
  }
};
