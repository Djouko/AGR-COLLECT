import { computed } from 'vue';

export const enketoBasePath = '/-';

export const noop = () => {};
export const noargs = (f) => () => f();

export const sumUnderThreshold = (list, threshold) => list.reduce((acc, i) => acc + Math.min(i, threshold), 0);

// Converts a string from kebab-case to camelCase.
export const kebabToCamel = (s) =>
  s.replace(/-([a-z])/g, (match) => match[1].toUpperCase());

export const getCookieValue = (key, doc = document) => decodeURIComponent(doc.cookie.split(';')
  .map(cookie => cookie.trim())
  .find(cookie => cookie.startsWith(`${key}=`))
  ?.split('=')[1] || '');



////////////////////////////////////////////////////////////////////////////////
// VUE

// Returns an object of event handlers that simply re-emit the specified events.
// Useful for nested components. Pass the resulting object to v-on.
export const reemit = (emit, events) => Object.fromEntries(events.map(name =>
  [kebabToCamel(name), (...args) => emit(name, ...args)]));

// Returns an object of computed refs that delegate to the exposed properties of
// a template ref. Useful for nested components. Pass the resulting object to
// defineExpose().
export const reexpose = (templateRef, names) => Object.fromEntries(names.map(name =>
  [name, computed(() => templateRef.value[name])]));
