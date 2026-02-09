<!--
Copyright 2025 AGR-Collect Developers
This file is part of AGR-Collect.
-->
<template>
  <modal id="field-key-restore" :state="state" :hideable="!awaitingResponse"
    backdrop @hide="$emit('hide')">
    <template #title>{{ $t('title') }}</template>
    <template #body>
      <div class="modal-introduction">
        <i18n-t tag="p" keypath="introduction[0]">
          <template #displayName>
            <strong>{{ fieldKey != null ? fieldKey.displayName : '' }}</strong>
          </template>
        </i18n-t>
        <p>{{ $t('introduction[1]') }}</p>
      </div>
      <div class="modal-actions">
        <button type="button" class="btn btn-link" :aria-disabled="awaitingResponse"
          @click="$emit('hide')">
          {{ $t('action.noCancel') }}
        </button>
        <button type="button" class="btn btn-primary"
          :aria-disabled="awaitingResponse" @click="restore">
          {{ $t('action.yesProceed') }} <spinner :state="awaitingResponse"/>
        </button>
      </div>
    </template>
  </modal>
</template>

<script>
import Modal from '../modal.vue';
import Spinner from '../spinner.vue';

import useRequest from '../../composables/request';
import { apiPaths } from '../../util/request';
import { noop } from '../../util/util';

export default {
  name: 'FieldKeyRestore',
  components: { Modal, Spinner },
  props: {
    state: Boolean,
    fieldKey: Object
  },
  emits: ['hide', 'success'],
  setup() {
    const { request, awaitingResponse } = useRequest();
    return { request, awaitingResponse };
  },
  methods: {
    restore() {
      // Create a new session for the field key actor to restore access
      this.request({
        method: 'POST',
        url: apiPaths.fieldKeySession(this.fieldKey.projectId, this.fieldKey.id)
      })
        .then(() => {
          this.$emit('success', this.fieldKey);
        })
        .catch(noop);
    }
  }
};
</script>

<i18n lang="json5">
{
  "en": {
    "title": "Restore User Access",
    "introduction": [
      "Are you sure you want to restore access for the App User {displayName}?",
      "This will generate a new QR code that can be used to configure data collection clients."
    ]
  }
}
</i18n>

<i18n>
{
  "fr": {
    "title": "Restaurer l'accès utilisateur",
    "introduction": [
      "Êtes-vous sûr de vouloir restaurer l'accès de l'utilisateur mobile {displayName}?",
      "Cela générera un nouveau code QR qui pourra être utilisé pour configurer les clients de collecte de données."
    ]
  }
}
</i18n>
