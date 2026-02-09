import { DateTime } from 'luxon';
import useQueryRef from './query-ref';

export default () => useQueryRef({
  fromQuery: (query) => {
    if (typeof query.start === 'string' && typeof query.end === 'string') {
      const start = DateTime.fromISO(query.start);
      const end = DateTime.fromISO(query.end);
      if (start.isValid && end.isValid && start <= end)
        return [start.startOf('day'), end.startOf('day')];
    }
    return [];
  },
  toQuery: (value) => (value.length !== 0
    ? { start: value[0].toISODate(), end: value[1].toISODate() }
    : { start: null, end: null })
});
