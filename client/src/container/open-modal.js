import { shallowReactive } from 'vue';

// Tracks which modal is currently open.
class OpenModal {
  constructor() {
    this.state = false;
    this.el = null;
  }

  // Updates the data after a modal is shown.
  shown(el) { Object.assign(this, { state: true, el }); }
  // Updates the data after a modal is hidden.
  hidden() { Object.assign(this, { state: false, el: null }); }
}

export default () => shallowReactive(new OpenModal());
