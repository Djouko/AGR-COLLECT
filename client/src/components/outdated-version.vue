<template>
  <div v-if="showBanner" class="outdated-version-banner">
    <iframe :src="iframeSrc" :title="$t('title')"></iframe>

    <a class="btn btn-primary"
      href="https://docs.agr-collect.local/central-upgrade/"
      target="_blank"
      v-tooltip.aria-describedby="$t('instructionsToUpgradeTooltip')">
        {{ $t('instructionsToUpgrade') }}
    </a>

    <button class="btn btn-danger"
      type="button"
      v-tooltip.aria-describedby="$t('dismissTooltip')"
      @click="dismiss">
        {{ $t('dismiss') }}
    </button>
  </div>
</template>

<script setup>
import { computed, inject } from 'vue';
import { useRequestData } from '../request-data';

const { centralVersion, currentUser } = useRequestData();

defineOptions({
  name: 'OutdatedVersion'
});

const visiblyLoggedIn = inject('visiblyLoggedIn');

const container = inject('container');
const { i18n: globalI18n } = container;
const locale = computed(() => globalI18n.locale);

const iframeSrc = computed(() => `about:blank?version=${centralVersion.currentVersion}&lang=${locale.value}`);

const showBanner = computed(() => {
  if (!currentUser.dataExists || !visiblyLoggedIn || !currentUser.can('config.set')) return false;
  if (!centralVersion.dataExists) return false;

  const dismissDate = currentUser.preferences?.site?.outdatedVersionWarningDismissDate;
  if (dismissDate && centralVersion.currentDate.getTime() < (new Date(dismissDate).getTime() + (864E5 * 30))) return false;

  const centralVersionYear = Number(centralVersion.currentVersion.match(/^(\d{4})/)[1]);
  const currentYear = centralVersion.currentDate.getFullYear();
  if (currentYear - centralVersionYear < 2) return false;

  return true;
});

const dismiss = () => {
  currentUser.preferences.site.outdatedVersionWarningDismissDate = centralVersion.currentDate;
};
</script>

<style lang="scss">
@import '../assets/scss/variables';

.outdated-version-banner {
  background-color: $color-danger-light;
  border: 1px solid $color-danger;
  border-radius: 8px;
  padding: 0 20px 20px 20px;
  text-align: center;
  width: 700px;
  margin: 20px auto;
  box-shadow: $box-shadow-popover;

  iframe {
    border-width: 0;
    height: 250px;
    width: 600px;
    margin: 0 auto;
  }

  .btn {
    margin: 0 5px;
    min-width: 100px;
  }
}

</style>

<i18n lang="json5">
  {
    "en": {
      // This is a title for the outdated version banner shown for the screenreaders only
      "title": "Outdated Version",
      "instructionsToUpgrade": "Instructions to upgrade",
      "instructionsToUpgradeTooltip": "Click here to see instructions to upgrade Central",
      "dismiss": "Dismiss for 30 days",
      "dismissTooltip": "Click here to dismiss this warning for 30 days."
    }
  }
  </i18n>

<i18n>
{
  "de": {
    "title": "Veraltete Version",
    "instructionsToUpgrade": "Anweisungen zum Upgrade",
    "instructionsToUpgradeTooltip": "Klicken Sie hier für eine Anleitung zum Upgrade von Central",
    "dismiss": "Entlassung für 30 Tage",
    "dismissTooltip": "Klicken Sie hier, um diese Warnung für 30 Tage aufzuheben."
  },
  "es": {
    "title": "Versión obsoleta",
    "instructionsToUpgrade": "Instrucciones para actualizar",
    "instructionsToUpgradeTooltip": "Haga clic aquí para ver las instrucciones de actualización de Central",
    "dismiss": "Despido durante 30 días",
    "dismissTooltip": "Haga clic aquí para desactivar esta advertencia durante 30 días."
  },
  "fr": {
    "title": "Version ancienne",
    "instructionsToUpgrade": "Instructions de mise à jour",
    "instructionsToUpgradeTooltip": "Cliquez ici pour voir les instructions pour mettre Central à jour",
    "dismiss": "Cacher pour 30 jours",
    "dismissTooltip": "Cliquez ici pour cacher cette alerte pour 30 jours."
  },
  "it": {
    "title": "Versione obsoleta",
    "instructionsToUpgrade": "Istruzioni per l'aggiornamento",
    "instructionsToUpgradeTooltip": "Fare clic qui per visualizzare le istruzioni per l'aggiornamento di Central",
    "dismiss": "Sospendere per 30 giorni",
    "dismissTooltip": "Fate clic qui per disattivare questo avviso per 30 giorni."
  },
  "pt": {
    "title": "Versão ultrapassada",
    "instructionsToUpgrade": "Instruções para atualizar",
    "instructionsToUpgradeTooltip": "Clique aqui para ver as instruções para atualizar o Central",
    "dismiss": "Ignorar por 30 dias",
    "dismissTooltip": "Clique aqui para ignorar este aviso por 30 dias."
  },
  "zh": {
    "title": "版本过旧",
    "instructionsToUpgrade": "版本升级指南",
    "instructionsToUpgradeTooltip": "点击此处查看Central升级指南",
    "dismiss": "30天内不再提示",
    "dismissTooltip": "点击此处可在30天内隐藏此提示。"
  },
  "zh-Hant": {
    "title": "過時的版本",
    "instructionsToUpgrade": "升級說明",
    "instructionsToUpgradeTooltip": "按此處查看升級 Central 的說明",
    "dismiss": "忽略 30 天",
    "dismissTooltip": "按此處忽略此警告 30 天。"
  }
}
</i18n>
