import { computeIfExists, hasVerbs, transformForm } from './util';
import { useRequestData } from './index';

export default () => {
  const { createResource } = useRequestData();
  return createResource('projects', (projects) => ({
    /* eslint-disable no-param-reassign */
    transformResponse: ({ data }) => {
      for (const project of data) {
        for (const form of project.formList)
          transformForm(form);
        project.verbs = new Set(project.verbs);
        project.permits = hasVerbs;
      }
      return data;
    },
    /* eslint-enable no-param-reassign */
    // Returns an object of Sets containing duplicate project names for use
    // by the Project list page.
    duplicateFormNamesPerProject: computeIfExists(() => {
      const dupeNamesByProject = {};
      for (const project of projects) {
        const seenNames = new Set();
        dupeNamesByProject[project.id] = new Set();
        for (const form of project.formList) {
          const formName = form.nameOrId.toLocaleLowerCase();
          if (seenNames.has(formName)) dupeNamesByProject[project.id].add(formName);
          seenNames.add(formName);
        }
      }
      return dupeNamesByProject;
    })
  }));
};
