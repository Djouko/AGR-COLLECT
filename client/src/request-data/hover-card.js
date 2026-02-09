// The HoverCards component only uses local resources. This composable creates
// those resources. In some cases, we shadow the names of app-wide resources,
// e.g., `form`. For simplicity, we want the hover card resources to be
// independent of resources used in other components.

import useSubmission from './submission';
import { transformForm } from './util';
import { useRequestData } from './index';

export default () => {
  const { createResource } = useRequestData();
  const { submission } = useSubmission();
  return {
    form: createResource('form', () => ({
      transformResponse: ({ data }) => transformForm(data)
    })),
    submission,
    dataset: createResource('dataset'),
    entity: createResource('entity')
  };
};
