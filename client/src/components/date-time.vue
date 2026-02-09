<template>
  <time v-if="iso != null" :datetime="iso" v-tooltip.no-aria="tooltipText">{{ format(true) }}</time>
  <span v-else>{{ blank }}</span>
</template>

<script>
import { DateTime } from 'luxon';

import { formatDateTime } from '../util/date-time';

export default {
  name: 'DateTime',
  props: {
    iso: String,
    relative: {
      type: String,
      default: 'recent'
    },
    blank: {
      type: String,
      default: ''
    },
    tooltip: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    dateTime() {
      return DateTime.fromISO(this.iso, { locale: this.$i18n.locale });
    },
    tooltipText() {
      return this.tooltip ? this.format(false) : null;
    }
  },
  methods: {
    format(useRelative) {
      return formatDateTime(this.dateTime, useRelative ? this.relative : null);
    }
  }
};
</script>
