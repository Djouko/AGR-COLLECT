<!--
Copyright 2025 AGR-Collect Developers
This file is part of AGR-Collect.
-->
<template>
  <modal id="field-key-delete" :state="state" :hideable="!awaitingResponse"
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
        <p class="text-danger">{{ $t('common.noUndo') }}</p>
      </div>
      <div class="modal-actions">
        <button type="button" class="btn btn-link" :aria-disabled="awaitingResponse"
          @click="$emit('hide')">
          {{ $t('action.noCancel') }}
        </button>
        <button type="button" class="btn btn-danger"
          :aria-disabled="awaitingResponse" @click="deleteFieldKey">
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
  name: 'FieldKeyDelete',
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
    deleteFieldKey() {
      this.request({
        method: 'DELETE',
        url: apiPaths.fieldKey(this.fieldKey.projectId, this.fieldKey.id)
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
    "title": "Delete App User",
    "introduction": [
      "Are you sure you want to permanently delete the App User {displayName}?",
      "All submissions from this user will be preserved, but the user will no longer be able to access any Forms or submit new data."
    ]
  }
}
</i18n>

<i18n>
{
  "fr": {
    "title": "Supprimer l'utilisateur mobile",
    "introduction": [
      "Êtes-vous sûr de vouloir supprimer définitivement l'utilisateur mobile {displayName}?",
      "Toutes les soumissions de cet utilisateur seront conservées, mais l'utilisateur ne pourra plus accéder aux formulaires ni soumettre de nouvelles données."
    ]
  }
}
</i18n>
