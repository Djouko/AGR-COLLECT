<template>
  <div id="not-found-page">
    <div class="not-found-container">
      <div class="not-found-icon">
        <span class="icon-exclamation-triangle"></span>
      </div>
      <h1 class="not-found-code">404</h1>
      <h2 class="not-found-title">{{ $t('title.pageNotFound') }}</h2>
      <p class="not-found-message">{{ $t('body') }}</p>
      <router-link to="/" class="btn btn-primary not-found-btn">
        <span class="icon-home"></span> {{ $t('action.backToHome') }}
      </router-link>
    </div>
  </div>
</template>

<script setup>
defineOptions({
  name: 'NotFound'
});
</script>

<style lang="scss">
@import '../assets/scss/variables';

#not-found-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 40px 20px;
}

.not-found-container {
  text-align: center;
  max-width: 480px;
}

.not-found-icon {
  font-size: 64px;
  color: #d1d5db;
  margin-bottom: 16px;
}

.not-found-code {
  font-size: 96px;
  font-weight: 800;
  color: $color-accent-primary;
  line-height: 1;
  margin: 0 0 8px;
  letter-spacing: -2px;
}

.not-found-title {
  font-size: 24px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 12px;
}

.not-found-message {
  font-size: 16px;
  color: #6b7280;
  margin: 0 0 32px;
  line-height: 1.6;
}

.not-found-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s;
}
</style>

<i18n lang="json5">
{
  "en": {
    "body": "The page you requested could not be found."
  }
}
</i18n>

<i18n>
{
  "cs": {
    "body": "Požadovanou stránku nelze najít."
  },
  "de": {
    "body": "Die von Ihnen gewünschte Seite wurde nicht gefunden."
  },
  "es": {
    "body": "La página que está solicitando no pudo ser encontrada."
  },
  "fr": {
    "body": "La page demandée ne peut être trouvée."
  },
  "id": {
    "body": "Laman yang Anda minta tidak ditemui."
  },
  "it": {
    "body": "La pagina richiesta non è stata trovata."
  },
  "ja": {
    "body": "リクエストされたページは見つかりません。"
  },
  "pt": {
    "body": "A página que você solicitou não pode ser encontrada."
  },
  "sw": {
    "body": "Ukurasa ulioomba haukupatikana."
  },
  "zh": {
    "body": "无法找到您请求的页面。"
  },
  "zh-Hant": {
    "body": "您請求的頁面無法找到。"
  }
}
</i18n>
