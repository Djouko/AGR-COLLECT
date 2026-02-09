<template>
  <page-body>
    <i18n-t tag="p" keypath="body">
      <template #filename>
        <strong>{{ attachmentName }}</strong>
      </template>
    </i18n-t>
    <!-- eslint-disable-next-line vuejs-accessibility/anchor-has-content -->
    <a v-show="false" ref="link" :href="href" download></a>
  </page-body>
</template>

<script>
export default {
  name: 'Download'
};
</script>
<script setup>
import { computed, onMounted, ref } from 'vue';

import PageBody from './page/body.vue';

import { apiPaths } from '../util/request';

const props = defineProps({
  projectId: {
    type: String,
    required: true
  },
  xmlFormId: {
    type: String,
    required: true
  },
  instanceId: {
    type: String,
    required: true
  },
  attachmentName: {
    type: String,
    required: true
  }
});

const href = computed(() => apiPaths.submissionAttachment(
  props.projectId,
  props.xmlFormId,
  false,
  props.instanceId,
  props.attachmentName
));

const link = ref(null);
onMounted(() => { link.value.click(); });
</script>

<i18n lang="json5">
{
  "en": {
    "body": "{filename} will begin downloading soon. Once the download begins, you can leave this page."
  }
}
</i18n>

<i18n>
{
  "cs": {
    "body": "{filename} se brzy začne stahovat. Jakmile začne stahování, můžete tuto stránku opustit."
  },
  "de": {
    "body": "{filename} beginnt bald mit dem Download. Sobald der Download begonnen hat, können Sie diese Seite verlassen."
  },
  "es": {
    "body": "{filename} comenzará a descargarse pronto. Una vez que comience la descarga, puede salir de esta página."
  },
  "fr": {
    "body": "Le téléchargement du fichier {filename} va bientôt commencer. Une fois qu'il aura démarré, vous pourrez quitter la page."
  },
  "id": {
    "body": "{filename} akan segera mulai mengunduh. Setelah unduhan dimulai, anda dapat meninggalkan halaman ini."
  },
  "it": {
    "body": "A breve inizierà il download di {filename}. Una volta avviato il download, puoi lasciare questa pagina."
  },
  "ja": {
    "body": "{filename}はすぐにダウンロードされます。ダウンロードが始めると、このページから移動しても構いません。"
  },
  "pt": {
    "body": "O arquivo {filename} será baixado em breve. Assim que o download começar, você poderá sair dessa página."
  },
  "sw": {
    "body": "{filename} itaanza kupakuliwa hivi karibuni. Mara tu upakuaji unapoanza, unaweza kuondoka kwenye ukurasa huu"
  },
  "zh": {
    "body": "{filename}将开始下载。当下载开始后，您可以离开此页面。"
  },
  "zh-Hant": {
    "body": "{filename}即將開始下載。下載開始後，您可以離開此頁面。"
  }
}
</i18n>
