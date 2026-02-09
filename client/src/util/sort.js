import { maxDateTime } from './date-time';

export default {
  alphabetical: (a, b) => {
    // sort uses `name` field for both projects and forms
    // but some forms don't have a name
    const nameA = a.name != null ? a.name : a.nameOrId;
    const nameB = b.name != null ? b.name : b.nameOrId;
    return nameA.localeCompare(nameB);
  },
  latest: (a, b) => {
    const dateA = maxDateTime(a.lastSubmission, a.lastEntity);
    const dateB = maxDateTime(b.lastSubmission, b.lastEntity);
    // break tie alphabetically if both lastSub dates are null
    if (dateA == null && dateB == null) {
      const nameA = a.name != null ? a.name : a.nameOrId;
      const nameB = b.name != null ? b.name : b.nameOrId;
      return nameA.localeCompare(nameB);
    }
    // null submission dates should go at the end
    if (dateA == null)
      return 1;
    if (dateB == null)
      return -1;
    return dateB - dateA;
  },
  newest: (a, b) => {
    const dateA = a.createdAt;
    const dateB = b.createdAt;
    return new Date(dateB) - new Date(dateA);
  }
};
