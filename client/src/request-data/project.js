import { watchSyncEffect } from 'vue';

import { computeIfExists, transformForms } from './util';
import { useRequestData } from './index';

export default () => {
  const { project, createResource, createGetter } = useRequestData();
  const projectAssignments = createResource('projectAssignments');
  const forms = createResource('forms', () => ({
    transformResponse: transformForms
  }));
  const deletedForms = createResource('deletedForms', () => ({
    transformResponse: transformForms
  }));
  const formSummaryAssignments = createResource('formSummaryAssignments');
  const fieldKeys = createResource('fieldKeys', () => ({
    withToken: computeIfExists(() =>
      fieldKeys.filter(fieldKey => fieldKey.token != null))
  }));

  watchSyncEffect(() => {
    if (project.dataExists && forms.dataExists &&
      project.forms !== forms.length)
      project.forms = forms.length;
  });
  watchSyncEffect(() => {
    if (project.dataExists && fieldKeys.dataExists &&
      project.appUsers !== fieldKeys.length)
      project.appUsers = fieldKeys.length;
  });

  // Returns a set containing just the form names that appear more than once
  // in a project. Used on forms page to show form ID next to form name
  // when form names are duplicated.
  const duplicateFormNames = createGetter('duplicateFormNames', () => {
    if (!(forms.dataExists && deletedForms.dataExists)) return null;
    const allForms = [...forms, ...deletedForms];
    const seenNames = new Set();
    const dupeNames = new Set();
    for (const form of allForms) {
      const formName = form.nameOrId.toLocaleLowerCase();
      if (seenNames.has(formName)) dupeNames.add(formName);
      seenNames.add(formName);
    }
    return dupeNames;
  });

  return {
    project, projectAssignments, forms, deletedForms, formSummaryAssignments,
    fieldKeys, duplicateFormNames
  };
};
