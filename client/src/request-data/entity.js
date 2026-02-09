import { reactive } from 'vue';

import { useRequestData } from './index';

export default () => {
  const { createResource } = useRequestData();
  const entity = createResource('entity', () => ({
    transformResponse: ({ data }) => reactive(data)
  }));
  const audits = createResource('audits');
  return { entity, audits };
};
