import { computed, inject } from 'vue';

import useQueryRef from './query-ref';

export default () => {
  const { i18n } = inject('container');

  const dataView = useQueryRef({
    fromQuery: (query) => (!query.deleted && query.map === 'true' ? 'map' : 'table'),
    toQuery: (value) => ({ map: value === 'map' ? 'true' : null })
  });

  const options = computed(() => [
    { value: 'table', text: i18n.t('common.table') },
    { value: 'map', text: i18n.t('common.map') }
  ]);

  return { dataView, options };
};
