import { shallowReactive, reactive } from 'vue';

import { useRequestData } from './index';
import { computeIfExists } from './util';

const transformValue = (data, config) => {
  const { searchParams } = new URL(config.url, window.location.origin);

  const skip = searchParams.get('$skip') ?? 0;
  const count = data['@odata.count'];
  return data.value.map((entity, index) => ({
    ...entity,
    __system: {
      ...entity.__system,
      rowNumber: count - skip - index,
      selected: false
    }
  }));
};

export default () => {
  const { createResource } = useRequestData();
  const entityOData = createResource('odataEntities', () => ({
    transformResponse: ({ data, config }) => shallowReactive({
      value: reactive(transformValue(data, config)),
      count: data['@odata.count'],
      removedEntities: reactive(new Set())
    }),
    replaceData(data, config) {
      entityOData.count = data['@odata.count'];
      entityOData.value = reactive(transformValue({
        ...data,
        value: data.value.filter(e => !entityOData.removedEntities.has(e.__id))
      }, config));
    }
  }));
  const deletedEntityCount = createResource('deletedEntityCount', () => ({
    transformResponse: ({ data }) => reactive({
      value: data['@odata.count']
    })
  }));
  const entityCreators = createResource('entityCreators', () => ({
    ids: computeIfExists(() =>
      entityCreators.reduce((set, { id }) => set.add(id), new Set()))
  }));
  return { odataEntities: entityOData, deletedEntityCount, entityCreators };
};
