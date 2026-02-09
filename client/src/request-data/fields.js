import { computeIfExists } from './util';
import { useRequestData } from './index';

export default () => {
  const { createResource } = useRequestData();
  // The fields for a particular form version, whether the primary version or
  // otherwise
  return createResource('fields', (fields) => ({
    /* eslint-disable no-param-reassign */
    transformResponse: ({ data }) => {
      for (const field of data) {
        field.pathElements = field.path.split('/');
        field.pathElements.shift();
        field.header = field.pathElements.join('-');
      }
      return data;
    },
    /* eslint-enable no-param-reassign */
    outsideRepeat: computeIfExists(() => {
      const result = [];
      // The path of the top-level repeat group currently being traversed
      let repeat = null;
      for (const field of fields) {
        const { path } = field;
        if (repeat == null || !path.startsWith(repeat)) {
          repeat = null;
          // Note that `type` may be `undefined`, though I have seen this only
          // in the Widgets sample form (<branch>):
          // https://github.com/getodk/sample-forms/blob/e9fe5838e106b04bf69f43a8a791327093571443/Widgets.xml
          const { type } = field;
          if (type === 'repeat')
            repeat = `${path}/`;
          else if (type !== 'structure')
            result.push(field);
        }
      }
      return result;
    }),
    selectable: computeIfExists(() => fields.outsideRepeat.filter(({ path }) =>
      path !== '/meta/instanceID' && path !== '/instanceID')),
    binaryPaths: computeIfExists(() => fields.reduce(
      (acc, cur) => (cur.binary ? acc.add(cur.path) : acc),
      new Set()
    )),
    hasMappable: computeIfExists(() => fields.outsideRepeat.some(({ type }) =>
      type === 'geopoint' || type === 'geotrace' || type === 'geoshape'))
  }));
};
