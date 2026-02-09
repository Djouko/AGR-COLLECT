<!--
Copyright 2025 AGR-Collect Developers
This file is part of AGR-Collect.
-->
<template>
  <modal id="field-key-edit" :state="state" :hideable="!awaitingResponse"
    backdrop @hide="$emit('hide')">
    <template #title>{{ $t('title') }}</template>
    <template #body>
      <form @submit.prevent="save">
        <div class="modal-introduction">
          <p>{{ $t('introduction') }}</p>
        </div>
        <div class="form-group">
          <label class="form-label" for="field-key-edit-display-name">
            {{ $t('field.displayName') }} <span class="required">*</span>
          </label>
          <input id="field-key-edit-display-name" v-model.trim="displayName"
            type="text" class="form-control" required
            :placeholder="$t('field.displayName')" autocomplete="off">
        </div>
        <div class="modal-actions">
          <button type="button" class="btn btn-link" :aria-disabled="awaitingResponse"
            @click="$emit('hide')">
            {{ $t('action.cancel') }}
          </button>
          <button type="submit" class="btn btn-primary"
            :aria-disabled="awaitingResponse || !displayName">
            {{ $t('action.save') }} <spinner :state="awaitingResponse"/>
          </button>
        </div>
      </form>
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
  name: 'FieldKeyEdit',
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
  data() {
    return {
      displayName: ''
    };
  },
  watch: {
    state(newState) {
      if (newState && this.fieldKey) {
        this.displayName = this.fieldKey.displayName;
      }
    }
  },
  methods: {
    save() {
      this.request({
        method: 'PATCH',
        url: apiPaths.fieldKey(this.fieldKey.projectId, this.fieldKey.id),
        data: { displayName: this.displayName }
      })
        .then(() => {
          this.$emit('success', { ...this.fieldKey, displayName: this.displayName });
        })
        .catch(noop);
    }
  }
};
</script>

<i18n lang="json5">
{
  "en": {
    "title": "Edit App User",
    "introduction": "Update the display name for this App User.",
    "field": {
      "displayName": "Display Name"
    }
  }
}
</i18n>

<i18n>
{
  "fr": {
    "title": "Modifier l'utilisateur mobile",
    "introduction": "Modifier le nom d'affichage de cet utilisateur mobile.",
    "field": {
      "displayName": "Nom d'affichage"
    }
  }
}
</i18n>
