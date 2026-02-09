<!--
Copyright 2025 AGR-Collect Developers
This file is part of AGR-Collect.
-->
<template>
  <modal id="user-restore" :state="state" :hideable="!awaitingResponse"
    backdrop @hide="$emit('hide')">
    <template #title>{{ $t('title') }}</template>
    <template #body>
      <div class="modal-introduction">
        <i18n-t tag="p" keypath="introduction[0]">
          <template #displayName>
            <strong>{{ user != null ? user.displayName : '' }}</strong>
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
  name: 'UserRestore',
  components: { Modal, Spinner },
  props: {
    state: Boolean,
    user: Object
  },
  emits: ['hide', 'success'],
  setup() {
    const { request, awaitingResponse } = useRequest();
    return { request, awaitingResponse };
  },
  methods: {
    restore() {
      this.request({
        method: 'PATCH',
        url: apiPaths.user(this.user.id),
        data: { isDisabled: false }
      })
        .then(() => {
          this.$emit('success', this.user);
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
      "Are you sure you want to restore access for {displayName}?",
      "The user will be able to log in again after this action."
    ]
  }
}
</i18n>

<i18n>
{
  "fr": {
    "title": "Restaurer l'accès utilisateur",
    "introduction": [
      "Êtes-vous sûr de vouloir restaurer l'accès de {displayName}?",
      "L'utilisateur pourra à nouveau se connecter après cette action."
    ]
  }
}
</i18n>
