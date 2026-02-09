<template>
  <div id="account-reset-password">
    <div class="reset-brand-panel">
      <div class="brand-content">
        <div class="brand-logo">
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="18" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
            <circle cx="20" cy="20" r="8" fill="rgba(255,255,255,0.9)"/>
            <circle cx="20" cy="8" r="3" fill="rgba(255,255,255,0.7)"/>
            <circle cx="30" cy="26" r="3" fill="rgba(255,255,255,0.7)"/>
            <circle cx="10" cy="26" r="3" fill="rgba(255,255,255,0.7)"/>
          </svg>
        </div>
        <h1>AGR-Collect</h1>
        <p>Plateforme de collecte de données terrain</p>
      </div>
      <div class="brand-decoration">
        <div class="deco-circle deco-1"></div>
        <div class="deco-circle deco-2"></div>
      </div>
    </div>
    <div class="reset-form-panel">
      <div class="auth-locale-selector">
        <button type="button" class="locale-toggle" @click="localeOpen = !localeOpen">
          {{ currentLocaleName }} <span class="caret"></span>
        </button>
        <ul v-if="localeOpen" class="locale-menu">
          <li v-for="[tag, info] of availableLocales" :key="tag">
            <a href="#" @click.prevent="switchLocale(tag)">{{ info.name }}</a>
          </li>
        </ul>
      </div>
      <div class="form-panel-inner">
        <div class="form-header">
          <h2>{{ $t('title.resetPassword') }}</h2>
          <p>{{ $t('subtitle') }}</p>
        </div>
        <div class="form-content">
          <form @submit.prevent="submit">
            <label class="field-label">{{ $t('label.email') }}</label>
            <div class="field-wrap">
              <form-group ref="email" v-model.trim="email" type="email"
                :placeholder="$t('field.email')" required autocomplete="off"/>
            </div>
            <button type="submit" class="btn-submit"
              :aria-disabled="awaitingResponse">
              {{ $t('action.resetPassword') }} <spinner :state="awaitingResponse"/>
            </button>
            <div class="form-links">
              <router-link v-slot="{ navigate }" to="/login" custom>
                <button type="button" class="link-back"
                  @click="navigate">
                  {{ $t('action.backToLogin') }}
                </button>
              </router-link>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FormGroup from '../form-group.vue';
import Spinner from '../spinner.vue';

import useRequest from '../../composables/request';
import { noop } from '../../util/util';
import { loadLocale } from '../../util/i18n';
import { localStore } from '../../util/storage';
import { locales } from '../../i18n';

export default {
  name: 'AccountResetPassword',
  components: { FormGroup, Spinner },
  inject: ['alert', 'container'],
  setup() {
    const { request, awaitingResponse } = useRequest();
    return { request, awaitingResponse };
  },
  data() {
    return {
      email: '',
      localeOpen: false,
    };
  },
  computed: {
    availableLocales() {
      return locales;
    },
    currentLocaleName() {
      const info = locales.get(this.$i18n.locale);
      return info ? info.name : this.$i18n.locale;
    }
  },
  mounted() {
    this.$refs.email.focus();
  },
  methods: {
    switchLocale(locale) {
      loadLocale(this.container, locale)
        .then(() => { localStore.setItem('locale', locale); })
        .catch(noop);
      this.localeOpen = false;
    },
    submit() {
      const { email } = this;
      this.request({
        method: 'POST',
        url: '/v1/users/reset/initiate',
        data: { email }
      })
        .then(() => {
          const message = this.$t('alert.success', { email });
          return this.$router.push('/login')
            .then(() => { this.alert.success(message); });
        })
        .catch(noop);
    }
  }
};
</script>

<style lang="scss">
@import '../../assets/scss/variables';

#account-reset-password {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  background: #fff;

  .reset-brand-panel {
    flex: 0 0 45%;
    background: linear-gradient(160deg, #0a2e14 0%, #14532d 40%, #166534 70%, #1a7a3a 100%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;
    padding: 60px 48px;

    .brand-content {
      position: relative;
      z-index: 2;
      text-align: center;
      max-width: 380px;
    }

    .brand-logo {
      width: 72px;
      height: 72px;
      margin: 0 auto 24px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(12px);
      svg { width: 40px; height: 40px; }
    }

    h1 {
      margin: 0 0 10px;
      font-size: 28px;
      font-weight: 800;
      color: #fff;
      letter-spacing: -0.5px;
    }

    p {
      margin: 0;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.55);
      font-weight: 400;
    }

    .brand-decoration {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }

    .deco-circle {
      position: absolute;
      border-radius: 50%;
      border: 1px solid rgba(255, 255, 255, 0.06);
    }
    .deco-1 { width: 400px; height: 400px; top: -10%; right: -20%; }
    .deco-2 { width: 300px; height: 300px; bottom: -8%; left: -12%; }
  }

  .reset-form-panel {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px;
    background: #fff;
    overflow-y: auto;
    position: relative;
  }

  .auth-locale-selector {
    position: absolute;
    top: 20px;
    right: 24px;
    z-index: 10;

    .locale-toggle {
      background: none;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 6px 14px;
      font-size: 13px;
      font-weight: 500;
      color: #374151;
      cursor: pointer;
      transition: border-color 0.15s ease, background 0.15s ease;

      &:hover {
        border-color: #d1d5db;
        background: #f9fafb;
      }

      .caret { margin-left: 4px; }
    }

    .locale-menu {
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: 4px;
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      list-style: none;
      padding: 4px 0;
      min-width: 160px;
      max-height: 300px;
      overflow-y: auto;

      li a {
        display: block;
        padding: 7px 16px;
        font-size: 13px;
        color: #374151;
        text-decoration: none;
        transition: background 0.1s ease;
        &:hover { background: #f3f4f6; }
      }
    }
  }

  .form-panel-inner {
    width: 100%;
    max-width: 380px;
  }

  .form-header {
    margin-bottom: 36px;

    h2 {
      margin: 0 0 8px;
      font-size: 26px;
      font-weight: 700;
      color: #111827;
      letter-spacing: -0.5px;
    }

    p {
      margin: 0;
      font-size: 15px;
      color: #6b7280;
    }
  }

  .field-label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 6px;
  }

  .field-wrap {
    margin-bottom: 20px;

    .form-group { margin-bottom: 0; padding-bottom: 0; }

    .form-control {
      height: 46px;
      border-radius: 10px;
      border: 1.5px solid #d1d5db;
      font-size: 15px;
      padding: 0 14px;
      background: #fff;
      color: #111827;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;

      &:focus {
        border-color: #16a34a;
        box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
        outline: none;
      }
      &::placeholder { color: #9ca3af; }
    }
  }

  .btn-submit {
    display: block;
    width: 100%;
    padding: 13px 24px;
    background: #16a34a;
    color: #fff;
    border: none;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    text-align: center;
    transition: background 0.15s ease, box-shadow 0.15s ease;

    &:hover { background: #15803d; box-shadow: 0 4px 14px rgba(22, 163, 74, 0.3); }
    &:active { background: #166534; box-shadow: none; }
    &[aria-disabled="true"] { opacity: 0.5; pointer-events: none; }
  }

  .form-links {
    text-align: center;
    margin-top: 20px;
  }

  .link-back {
    background: none;
    border: none;
    padding: 0;
    color: #16a34a;
    font-size: 13px;
    font-weight: 500;
    text-decoration: none;
    cursor: pointer;
    transition: color 0.15s ease;
    &:hover { color: #15803d; text-decoration: underline; }
  }
}

@media (max-width: 900px) {
  #account-reset-password {
    flex-direction: column;

    .reset-brand-panel {
      flex: none;
      padding: 36px 32px 28px;
      .brand-logo { width: 52px; height: 52px; border-radius: 16px; margin-bottom: 14px; svg { width: 28px; height: 28px; } }
      h1 { font-size: 22px; margin-bottom: 4px; }
      p { font-size: 12px; }
    }

    .reset-form-panel { padding: 32px 24px; align-items: flex-start; }
    .form-panel-inner { max-width: 100%; }
    .form-header { margin-bottom: 28px; h2 { font-size: 22px; } }
  }
}

@media (max-width: 480px) {
  #account-reset-password {
    .reset-brand-panel { padding: 28px 20px 22px; }
    .reset-form-panel { padding: 24px 20px; }
    .form-header { margin-bottom: 24px; h2 { font-size: 20px; } }
  }
}
</style>

<i18n lang="json5">
{
  "en": {
    "subtitle": "Enter your email to receive a password reset link.",
    "label": {
      "email": "Email address"
    },
    "action": {
      "backToLogin": "Back to login"
    },
    "alert": {
      "success": "An email has been sent to {email} with further instructions."
    }
  }
}
</i18n>

<i18n>
{
  "cs": {
    "alert": {
      "success": "Byl odeslán e-mail na {email} s dalšími pokyny."
    }
  },
  "de": {
    "alert": {
      "success": "Eine E-Mail mit weiteren Anweisungen wurde an {email} gesendet."
    }
  },
  "es": {
    "alert": {
      "success": "Se ha enviado un correo electrónico {email} con más instrucciones"
    }
  },
  "fr": {
    "alert": {
      "success": "Un courriel a été envoyé à {email} avec de plus amples instructions"
    }
  },
  "id": {
    "alert": {
      "success": "Email sudah dikirimkan ke {email} dengan instruksi lebih lanjut."
    }
  },
  "it": {
    "alert": {
      "success": "È stata inviata un'email a {email} con ulteriori istruzioni."
    }
  },
  "ja": {
    "alert": {
      "success": "{email}に詳細の対応についての情報が記されたメールが送信されました。"
    }
  },
  "pt": {
    "alert": {
      "success": "Um email foi enviado para {email} com mais instruções."
    }
  },
  "sw": {
    "alert": {
      "success": "Barua pepe imetumwa kwa {email} ikiwa na maagizo zaidi."
    }
  },
  "zh": {
    "alert": {
      "success": "已向{email}发送邮件，内含后续操作说明。"
    }
  },
  "zh-Hant": {
    "alert": {
      "success": "一封電子郵件已發送至 {email} 並附有進一步說明。"
    }
  }
}
</i18n>
