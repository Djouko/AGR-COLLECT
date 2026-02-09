<template>
  <modal id="entity-delete" :state="state" :hideable="!awaitingResponse"
    backdrop @hide="$emit('hide')">
    <template #title>{{ $t('title', { label: entity?.label }) }}</template>
    <template #body>
      <p class="modal-introduction">
        <span>{{ $t('introduction[0]', { label: entity?.label }) }}</span>
      </p>
      <div class="modal-actions">
        <button type="button" class="btn btn-link"
          :aria-disabled="awaitingResponse" @click="$emit('hide')">
          {{ $t('action.cancel') }}
        </button>
        <button type="button" class="btn btn-danger"
          :aria-disabled="awaitingResponse" @click="del">
          {{ $t('action.delete') }} <spinner :state="awaitingResponse"/>
        </button>
      </div>
    </template>
  </modal>
</template>

<script setup>
import Modal from '../modal.vue';
import Spinner from '../spinner.vue';

defineOptions({
  name: 'EntityDelete'
});
const props = defineProps({
  state: Boolean,
  entity: Object,
  awaitingResponse: Boolean
});
const emit = defineEmits(['hide', 'delete']);

const del = () => {
  emit('delete', props.entity);
};
</script>

<i18n lang="json5">
{
  "en": {
    // This is the title at the top of a pop-up. {label} is the label of an
    // Entity.
    "title": "Delete {label}",
    "introduction": [
      // {label} is the label of an Entity.
      "Are you sure you want to delete “{label}”?"
    ]
  }
}
</i18n>

<i18n>
{
  "de": {
    "title": "Löschen {label}",
    "introduction": [
      "Sind Sie sicher, dass Sie “{label}” löschen wollen?"
    ]
  },
  "es": {
    "title": "Borrar {label}",
    "introduction": [
      "¿Estás seguro de que quieres borrar “{label}”?"
    ]
  },
  "fr": {
    "title": "Supprimer {label}",
    "introduction": [
      "Êtes vous sûr de vouloir supprimer \"{label}\" ?"
    ]
  },
  "it": {
    "title": "Elimina {label}",
    "introduction": [
      "Sei sicuro di voler eliminare \"{label}\"?"
    ]
  },
  "pt": {
    "title": "Excluir {label}",
    "introduction": [
      "Tem certeza de que deseja excluir “{label}”?"
    ]
  },
  "zh": {
    "title": "删除{label}",
    "introduction": [
      "您确定要删除{label}吗？"
    ]
  },
  "zh-Hant": {
    "title": "刪除{label}",
    "introduction": [
      "您確定要刪除「{label}」？"
    ]
  }
}
</i18n>
