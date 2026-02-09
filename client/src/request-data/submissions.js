import { reactive, shallowReactive } from 'vue';

import { computeIfExists } from './util';
import { useRequestData } from './index';

const transformValue = (data, config) => {
  const { searchParams } = new URL(config.url, window.location.origin);

  const skip = searchParams.get('$skip') ?? 0;
  const count = data['@odata.count'];
  return data.value.map((submission, index) => ({
    ...submission,
    __system: reactive({
      ...submission.__system,
      rowNumber: count - skip - index
    })
  }));
};

export default () => {
  const { createResource } = useRequestData();
  const odata = createResource('odata', () => ({
    transformResponse: ({ data, config }) => shallowReactive({
      value: shallowReactive(transformValue(data, config)),
      count: data['@odata.count'],
      removedSubmissions: reactive(new Set())
    }),
    replaceData(data, config) {
      odata.count = data['@odata.count'];
      odata.value = shallowReactive(transformValue({
        ...data,
        value: data.value.filter(s => !odata.removedSubmissions.has(s.__id))
      }, config));
    }
  }));
  const submitters = createResource('submitters', () => ({
    ids: computeIfExists(() =>
      submitters.reduce((set, { id }) => set.add(id), new Set()))
  }));
  const deletedSubmissionCount = createResource('deletedSubmissionCount', () => ({
    transformResponse: ({ data }) => reactive({
      value: data['@odata.count']
    })
  }));

  return { odata, submitters, deletedSubmissionCount };
};
