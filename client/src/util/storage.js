// eslint-disable-next-line import/prefer-default-export
export const localStore = {
  getItem(name) {
    try {
      return localStorage.getItem(name);
    } catch (e) {
      return null;
    }
  },
  setItem(name, value) {
    try {
      localStorage.setItem(name, value);
    } catch (e) {}
  },
  removeItem(name) {
    try {
      localStorage.removeItem(name);
    } catch (e) {}
  }
};
