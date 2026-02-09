// A component that contains tabs may call useTabs(), which returns related
// helper functions. If the component contains at least one tab that uses a
// relative path, the component must pass in a prefix for relative paths.

import { useRoute } from 'vue-router';

export default (pathPrefix = undefined) => {
  const route = useRoute();
  const tabPath = (path) => {
    if (path.startsWith('/')) return path;
    if (pathPrefix == null) throw new Error('pathPrefix required');
    const slash = path !== '' ? '/' : '';
    return `${pathPrefix}${slash}${path}`;
  };
  const tabClass = (path) => ({ active: route.path === tabPath(path) });
  return { tabPath, tabClass };
};
