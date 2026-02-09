<template>
  <hover-card icon="file" :truncate-dt="false">
    <template #title>{{ form.nameOrId }}</template>
    <template #subtitle>{{ $t('resource.form') }}</template>
    <template #body>
      <dl class="dl-horizontal">
        <dt>{{ $t('common.version') }}</dt>
        <dd><form-version-string :version="form.version"/></dd>

        <dt>{{ $t('resource.submissions') }}</dt>
        <dd>{{ $n(form.submissions, 'default') }}</dd>

        <dt>{{ $t('header.lastSubmission') }}</dt>
        <dd><date-time :iso="form.lastSubmission"/></dd>
      </dl>
    </template>
  </hover-card>
</template>

<script setup>
import DateTime from '../date-time.vue';
import FormVersionString from '../form-version/string.vue';
import HoverCard from '../hover-card.vue';

import { useRequestData } from '../../request-data';

defineOptions({
  name: 'HoverCardForm'
});

const { form } = useRequestData();
</script>
