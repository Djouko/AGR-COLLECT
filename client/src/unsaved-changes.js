class UnsavedChanges {
  constructor() { this._count = 0; }
  get count() { return this._count; }
  plus(n) { this._count += n; }
  minus(n) { this._count -= n; }
  zero() { this._count = 0; }
}

export default (i18n) => {
  const unsavedChanges = new UnsavedChanges();
  unsavedChanges.confirm = function confirm() {
    // eslint-disable-next-line no-alert
    return this.count === 0 || window.confirm(i18n.t('router.unsavedChanges'));
  };
  return unsavedChanges;
};
