import { reactive } from 'vue';

import { computeIfExists } from './util';
import { useRequestData } from './index';

export default () => {
  const { createResource } = useRequestData();
  const submission = createResource('submission', () => ({
    transformResponse: ({ data }) => {
      const result = data.value[0];
      result.__system = reactive(result.__system);
      return result;
    },
    instanceName: computeIfExists(() => submission.meta?.instanceName),
    instanceNameOrId: computeIfExists(() =>
      submission.instanceName ?? submission.__id)
  }));
  const submissionVersion = createResource('submissionVersion');
  const audits = createResource('audits');
  const comments = createResource('comments');
  const diffs = createResource('diffs');
  return { submission, submissionVersion, audits, comments, diffs };
};
