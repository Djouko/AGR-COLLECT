import { watchSyncEffect } from 'vue';

import { useRequestData } from './index';

export default () => {
  const { project, createResource } = useRequestData();
  const datasets = createResource('datasets');
  watchSyncEffect(() => {
    if (project.dataExists && datasets.dataExists &&
      project.datasets !== datasets.length)
      project.datasets = datasets.length;
  });
  return datasets;
};
