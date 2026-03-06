<template>
  <div id="account-login">
    <div class="login-brand-panel">
      <div class="brand-content">
        <div class="brand-logo-wrap">
          <div class="brand-logo">
            <img src="/logo-agr-collect.png" alt="AGR-Collect"/>
          </div>
        </div>
        <h1 class="brand-title">AGR-Collect</h1>
        <p class="brand-tagline">Plateforme de collecte de données terrain</p>
        <div class="brand-features">
          <div class="feature-item">
            <span class="feature-dot"></span>
            <span>Collecte hors-ligne & synchronisation</span>
          </div>
          <div class="feature-item">
            <span class="feature-dot"></span>
            <span>Géolocalisation & traçabilité</span>
          </div>
          <div class="feature-item">
            <span class="feature-dot"></span>
            <span>Rapports & analyses en temps réel</span>
          </div>
        </div>
        <div class="brand-footer">
          <span>SAAHDEL</span>
        </div>
      </div>
      <div class="brand-decoration">
        <div class="deco-circle deco-1"></div>
        <div class="deco-circle deco-2"></div>
        <div class="deco-circle deco-3"></div>
      </div>
    </div>
    <div class="login-form-panel">
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
          <h2>{{ $t('title.welcome') }}</h2>
          <p>{{ $t('title.subtitle') }}</p>
        </div>
        <div v-if="config.oidcEnabled" class="form-content">
          <p class="oidc-text">{{ $t('oidc.body') }}</p>
          <a :href="oidcLoginPath" class="btn-submit"
            :class="{ disabled }" @click="loginByOIDC">
            {{ $t('action.continue') }} <spinner :state="disabled"/>
          </a>
        </div>
        <div v-else class="form-content">
          <form @submit.prevent="submit">
            <label class="field-label">{{ $t('label.email') }}</label>
            <div class="field-wrap">
              <form-group ref="email" v-model.trim="email" type="email"
                :placeholder="$t('field.email')" required autocomplete="off"/>
            </div>
            <label class="field-label">{{ $t('label.password') }}</label>
            <div class="field-wrap">
              <form-group v-model="password" type="password"
                :placeholder="$t('field.password')" required
                autocomplete="current-password"/>
            </div>
            <div v-if="showMailingListOptIn" id="mailing-list-opt-in" class="checkbox">
              <label>
                <input v-model="mailingListOptIn" type="checkbox">{{ $t('analytics.mailingListOptIn') }}
              </label>
            </div>
            <button type="submit" class="btn-submit"
              :aria-disabled="disabled">
              {{ $t('action.logIn') }} <spinner :state="disabled"/>
            </button>
            <div class="form-links">
              <router-link v-slot="{ navigate }" to="/reset-password" custom>
                <button type="button" class="link-forgot" :aria-disabled="disabled"
                  @click="navigate">
                  {{ $t('action.resetPassword') }}
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

import { enketoBasePath, noop } from '../../util/util';
import { localStore } from '../../util/storage';
import { loadLocale } from '../../util/i18n';
import { locales } from '../../i18n';
import { logIn } from '../../util/session';
import { queryString } from '../../util/request';
import { useRequestData } from '../../request-data';

export default {
  name: 'AccountLogin',
  components: { FormGroup, Spinner },
  inject: ['container', 'alert', 'config', 'location'],
  beforeRouteLeave() {
    return !this.disabled;
  },
  setup() {
    const { currentUser, session } = useRequestData();
    return { currentUser, session };
  },
  data() {
    return {
      disabled: false,
      email: '',
      password: '',
      mailingListOptIn: true,
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
    },
    oidcLoginPath() {
      const { query } = this.$route;
      const next = typeof query.next === 'string' ? query.next : null;
      const qs = queryString({ next });
      return `/v1/oidc/login${qs}`;
    },
    showMailingListOptIn() {
      return this.$route.query.source === 'claim';
    }
  },
  created() {
    this.handleOIDCError();
  },
  mounted() {
    if (this.config.oidcEnabled)
      window.addEventListener('pageshow', this.reenableIfPersisted);
    else
      this.$refs.email.focus();
  },
  beforeUnmount() {
    if (this.config.oidcEnabled)
      window.removeEventListener('pageshow', this.reenableIfPersisted);
  },
  methods: {
    switchLocale(locale) {
      loadLocale(this.container, locale)
        .then(() => { localStore.setItem('locale', locale); })
        .catch(noop);
      this.localeOpen = false;
    },
    verifyNewSession() {
      const sessionExpires = localStore.getItem('sessionExpires');
      const newSession = sessionExpires == null ||
        Number.parseInt(sessionExpires, 10) < Date.now();
      if (!newSession) {
        this.alert.info(this.$t('alert.alreadyLoggedIn'))
          .cta(this.$t('action.refresh'), () => { this.location.reload(); });
      }
      return newSession;
    },
    loginByOIDC(event) {
      if (!this.verifyNewSession()) {
        event.preventDefault();
        return;
      }

      this.disabled = true;
    },
    async handleOIDCError() {
      if (!this.config.oidcEnabled) return;

      const { oidcError, ...queryWithoutError } = this.$route.query;
      if (oidcError === undefined) return;
      await this.$router.replace({ path: '/login', query: queryWithoutError });

      if (typeof oidcError === 'string' && /^[\w-]+$/.test(oidcError)) {
        const path = `oidc.error.${oidcError}`;
        if (this.$te(path, this.$i18n.fallbackLocale))
          this.alert.danger(this.$t(path));
      }
    },
    reenableIfPersisted(event) {
      if (event.persisted) this.disabled = false;
    },
    navigateToNext(next, internal, external) {
      if (typeof next !== 'string') return internal('/');
      let url;
      try {
        url = new URL(next, window.location.origin);
      } catch (e) {
        return internal('/');
      }
      if (url.origin !== window.location.origin || url.pathname === '/login')
        return internal('/');

      if (url.pathname.startsWith(`${enketoBasePath}/`))
        return external(url.href);
      return internal(url.pathname + url.search + url.hash);
    },
    submit() {
      if (!this.verifyNewSession()) return;
      this.disabled = true;
      this.session.request({
        method: 'POST',
        url: '/v1/sessions',
        data: { email: this.email, password: this.password },
        problemToAlert: ({ code }) =>
          (code === 401.2 ? this.$t('problem.401_2') : null)
      })
        .then(() => logIn(this.container, true))
        .then(() => {
          if (this.showMailingListOptIn) {
            this.currentUser.preferences.site.mailingListOptIn = this.mailingListOptIn;
          }
          this.navigateToNext(
            this.$route.query.next,
            (location) => {
              this.disabled = false;
              const message = this.$t('alert.changePassword');
              this.$router.replace(location)
                .catch(noop)
                .then(() => {
                  if (this.password.length < 10) this.alert.info(message);
                });
            },
            (url) => {
              window.location.replace(url);
            }
          );
        })
        .catch(() => {
          this.disabled = false;
        });
    }
  }
};
</script>

<style lang="scss">
@import '../../assets/scss/variables';

#account-login {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  background: #fff;

  .login-brand-panel {
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

    .brand-logo-wrap {
      margin-bottom: 32px;
    }

    .brand-logo {
      width: 80px;
      height: 80px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }

    .brand-title {
      margin: 0 0 10px;
      font-size: 32px;
      font-weight: 800;
      color: #fff;
      letter-spacing: -0.5px;
      line-height: 1;
    }

    .brand-tagline {
      margin: 0 0 48px;
      font-size: 15px;
      color: rgba(255, 255, 255, 0.6);
      font-weight: 400;
      line-height: 1.5;
    }

    .brand-features {
      text-align: left;
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 60px;
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: 12px;
      color: rgba(255, 255, 255, 0.8);
      font-size: 14px;
      font-weight: 400;
      letter-spacing: 0.1px;
    }

    .feature-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #4ade80;
      flex-shrink: 0;
    }

    .brand-footer {
      span {
        font-size: 11px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.3);
        letter-spacing: 2px;
        text-transform: uppercase;
      }
    }

    .brand-decoration {
      position: absolute;
      inset: 0;
      pointer-events: none;
      overflow: hidden;
    }

    .deco-circle {
      position: absolute;
      border-radius: 50%;
      border: 1px solid rgba(255, 255, 255, 0.06);
    }

    .deco-1 {
      width: 500px;
      height: 500px;
      top: -15%;
      right: -25%;
    }

    .deco-2 {
      width: 350px;
      height: 350px;
      bottom: -10%;
      left: -15%;
    }

    .deco-3 {
      width: 200px;
      height: 200px;
      top: 50%;
      left: 60%;
      background: radial-gradient(circle, rgba(74, 222, 128, 0.06) 0%, transparent 70%);
    }
  }

  .login-form-panel {
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

      .caret {
        margin-left: 4px;
      }
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

        &:hover {
          background: #f3f4f6;
        }
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
      line-height: 1.2;
    }

    p {
      margin: 0;
      font-size: 15px;
      color: #6b7280;
      font-weight: 400;
    }
  }

  .field-label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 6px;
    letter-spacing: 0.01em;
  }

  .field-wrap {
    margin-bottom: 20px;

    .form-group {
      margin-bottom: 0;
      padding-bottom: 0;
    }

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

  #mailing-list-opt-in {
    margin: -8px 0 20px;
    label { font-size: 13px; color: #6b7280; font-weight: 400; }
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
    text-decoration: none;
    transition: background 0.15s ease, box-shadow 0.15s ease;
    margin-top: 4px;

    &:hover {
      background: #15803d;
      box-shadow: 0 4px 14px rgba(22, 163, 74, 0.3);
      color: #fff;
      text-decoration: none;
    }

    &:active {
      background: #166534;
      box-shadow: none;
    }

    &[aria-disabled="true"], &.disabled {
      opacity: 0.5;
      pointer-events: none;
    }
  }

  .form-links {
    text-align: center;
    margin-top: 20px;
  }

  .link-forgot {
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
    &[aria-disabled="true"] { opacity: 0.5; pointer-events: none; }
  }

  .oidc-text {
    color: #6b7280;
    font-size: 15px;
    margin-bottom: 24px;
    line-height: 1.6;
  }
}

@media (max-width: 900px) {
  #account-login {
    flex-direction: column;

    .login-brand-panel {
      flex: none;
      padding: 40px 32px 32px;

      .brand-features, .brand-footer { display: none; }
      .brand-tagline { margin-bottom: 0; }
      .brand-logo { width: 56px; height: 56px; }
      .brand-logo-wrap { margin-bottom: 16px; }
      .brand-title { font-size: 24px; margin-bottom: 6px; }
      .brand-tagline { font-size: 13px; }
    }

    .login-form-panel {
      padding: 32px 24px;
      align-items: flex-start;
    }

    .form-panel-inner { max-width: 100%; }
    .form-header { margin-bottom: 28px; h2 { font-size: 22px; } }
  }
}

@media (max-width: 480px) {
  #account-login {
    .login-brand-panel {
      padding: 28px 20px 24px;
      .brand-logo { width: 48px; height: 48px; }
      .brand-logo-wrap { margin-bottom: 12px; }
      .brand-title { font-size: 20px; }
      .brand-tagline { font-size: 12px; }
    }

    .login-form-panel { padding: 24px 20px; }
    .form-header { margin-bottom: 24px; h2 { font-size: 20px; } }
  }
}
</style>

<i18n lang="json5">
{
  "en": {
    "title": {
      "welcome": "Sign in to your account",
      "subtitle": "Enter your credentials to continue."
    },
    "label": {
      "email": "Email address",
      "password": "Password"
    },
    "alert": {
      "alreadyLoggedIn": "A user is already logged in. Please refresh the page to continue.",
      "changePassword": "To protect your account, make sure your password is 10 characters or longer."
    },
    "oidc": {
      "body": "Click Continue to proceed to the login page.",
      "error": {
        "auth-ok-user-not-found": "There is no account associated with your email address. Please ask your administrator to create an account for you to continue.",
        "email-not-verified": "Your email address has not been verified by your login server. Please contact your server administrator.",
        "email-claim-not-provided": "The system could not access the email address associated with your account. This could be because your server administrator has configured something incorrectly, or has not set an email address for your account. It could also be the result of privacy options that you can choose during the login process. If so, please try again and ensure that your email is shared.",
        "internal-server-error": "Something went wrong during login. Please contact your server administrator."
      }
    },
    "problem": {
      "401_2": "Incorrect email address and/or password."
    }
  }
}
</i18n>

<i18n>
{
  "cs": {
    "alert": {
      "alreadyLoggedIn": "Uživatel je již přihlášen. Chcete-li pokračovat, obnovte stránku."
    },
    "oidc": {
      "body": "Kliknutím na tlačítko Pokračovat přejdete na přihlašovací stránku.",
      "error": {
        "auth-ok-user-not-found": "K vaší e-mailové adrese není přiřazen žádný centrální účet. Požádejte prosím správce Central, aby vám vytvořil účet, abyste mohli pokračovat.",
        "email-not-verified": "Vaše e-mailová adresa nebyla ověřena přihlašovacím serverem. Obraťte se prosím na správce serveru.",
        "email-claim-not-provided": "Central nemohl získat přístup k e-mailové adrese přidružené k vašemu účtu. Může to být způsobeno tím, že správce serveru něco špatně nakonfiguroval nebo že e-mailovou adresu pro váš účet nenastavil. Může to být také důsledek možností ochrany osobních údajů, které můžete zvolit během přihlašovacího procesu. V takovém případě to zkuste znovu a ujistěte se, že je váš e-mail sdílený.",
        "internal-server-error": "Při přihlašování se něco pokazilo. Kontaktujte prosím správce serveru."
      }
    },
    "problem": {
      "401_2": "Nesprávná e-mailová adresa nebo heslo."
    }
  },
  "de": {
    "alert": {
      "alreadyLoggedIn": "Ein Benutzer ist bereits eingeloggt. Bitte die Seite aktualisieren um weiterzuarbeiten.",
      "changePassword": "Um Ihr Konto zu schützen, achten Sie darauf, dass Ihr Passwort mindestens 10 Zeichen lang ist."
    },
    "oidc": {
      "body": "Klicken Sie auf Weiter, um zur Anmeldeseite zu gelangen.",
      "error": {
        "auth-ok-user-not-found": "Mit Ihrer E-Mail-Adresse ist kein Central-Konto verknüpft. Bitten Sie Ihren zentralen Administrator, ein Konto zu erstellen, damit Sie fortfahren können.",
        "email-not-verified": "Ihre E-Mail-Adresse wurde von Ihrem Anmeldeserver nicht überprüft. Bitte wenden Sie sich an Ihren Serveradministrator.",
        "email-claim-not-provided": "Central konnte nicht auf die mit Ihrem Konto verknüpfte E-Mail-Adresse zugreifen. Dies kann daran liegen, dass Ihr Serveradministrator etwas falsch konfiguriert hat oder keine E-Mail-Adresse für Ihr Konto festgelegt hat. Dies könnte auch auf Datenschutzoptionen zurückzuführen sein, die Sie während des Anmeldevorgangs auswählen können. Wenn ja, versuchen Sie es bitte erneut und stellen Sie sicher, dass Ihre E-Mail-Adresse geteilt wird.",
        "internal-server-error": "Beim Anmelden ist ein Fehler aufgetreten. Bitte wenden Sie sich an Ihren Serveradministrator."
      }
    },
    "problem": {
      "401_2": "Falsche E-Mail-Adresse und/oder Passwort."
    }
  },
  "es": {
    "alert": {
      "alreadyLoggedIn": "Un usuario ya ha iniciado sesión. Actualice la página para continuar.",
      "changePassword": "Para proteger tu cuenta, asegúrate de que tu contraseña tiene 10 caracteres o más."
    },
    "oidc": {
      "body": "Haga clic en Continuar para pasar a la página de inicio de sesión.",
      "error": {
        "auth-ok-user-not-found": "No hay ninguna cuenta Central asociada con su dirección de correo electrónico. Pídale a su administrador central que cree una cuenta para continuar.",
        "email-not-verified": "Su dirección de correo electrónico no ha sido verificada por su servidor de inicio de sesión. Comuníquese con el administrador de su servidor.",
        "email-claim-not-provided": "Central no pudo acceder a la dirección de correo electrónico asociada con su cuenta. Esto podría deberse a que el administrador de su servidor haya configurado algo incorrectamente o no haya configurado una dirección de correo electrónico para su cuenta. También podría ser el resultado de las opciones de privacidad que puedes elegir durante el proceso de inicio de sesión. Si es así, inténtalo de nuevo y asegúrate de que tu correo electrónico esté compartido.",
        "internal-server-error": "Algo salió mal durante el inicio de sesión. Comuníquese con el administrador de su servidor."
      }
    },
    "problem": {
      "401_2": "Dirección de correo electrónico y/o contraseña incorrecta."
    }
  },
  "fr": {
    "alert": {
      "alreadyLoggedIn": "Un utilisateur est déjà connecté. Merci de rafraîchir la page pour continuer.",
      "changePassword": "Pour protéger votre compte, assurez vous de choisir un mot de passe d'au moins 10 caractères."
    },
    "oidc": {
      "body": "Cliquez sur Continuer pour accéder à la page de connexion.",
      "error": {
        "auth-ok-user-not-found": "Il n'y a pas de compte Central associé à votre adresse de courriel. Veuillez demander à votre administrateur de Central de vous créer un compte pour continuer.",
        "email-not-verified": "Votre adresse de courriel n'a pas été vérifiée par votre serveur de connexion. Veuillez contacter l'administrateur de votre serveur.",
        "email-claim-not-provided": "Central n'a pas pu accéder à l'adresse de courriel associée à votre compte. Cela peut être dû au fait que l'administrateur de votre serveur a configuré quelque chose de manière incorrecte ou n'a pas défini d'adresse de courriel pour votre compte. Cela peut également être dû aux options de confidentialité que vous pouvez choisir durant la procédure de connexion. Si c'est le cas, veuillez réessayer et vous assurer que votre adresse de courriel est partagée.",
        "internal-server-error": "Un problème s'est produit lors de la connexion. Veuillez contacter l'administrateur de votre serveur."
      }
    },
    "problem": {
      "401_2": "Adresse de courriel et/ou mot de passe invalides."
    }
  },
  "id": {
    "alert": {
      "alreadyLoggedIn": "Seorang pengguna sudah masuk. Mohon perbarui halaman untuk melanjutkan."
    },
    "problem": {
      "401_2": "Alamat email dan/atau kata sandi salah."
    }
  },
  "it": {
    "alert": {
      "alreadyLoggedIn": "Un utente ha già effettuato l'accesso. Aggiorna la pagina per continuare.",
      "changePassword": "Per proteggere il tuo account, assicurati che la password sia lunga almeno 10 caratteri."
    },
    "oidc": {
      "body": "Fare clic su Continua per passare alla pagina di Login.",
      "error": {
        "auth-ok-user-not-found": "Al suo indirizzo e-mail non è associato alcun account su Central. Chiedete all'amministratore di Central di creare un account per continuare.",
        "email-not-verified": "Il vostro indirizzo e-mail non è stato verificato dal server di accesso. Contattare l'amministratore del server.",
        "email-claim-not-provided": "Central non è riuscito ad accedere all'indirizzo e-mail associato al vostro account. Ciò potrebbe essere dovuto al fatto che l'amministratore del server ha configurato qualcosa di errato o non ha impostato un indirizzo e-mail per l'account. Potrebbe anche essere il risultato delle opzioni di privacy che si possono scegliere durante il processo di login. In tal caso, riprovare e assicurarsi che il proprio indirizzo e-mail sia condiviso.",
        "internal-server-error": "Qualcosa è andato storto durante l'accesso. Contattare l'amministratore del server."
      }
    },
    "problem": {
      "401_2": "Indirizzo e-mail e/o password errati."
    }
  },
  "ja": {
    "alert": {
      "alreadyLoggedIn": "すでにユーザーでログインされています。 続けるにはページを更新してください。"
    },
    "problem": {
      "401_2": "メールアドレスとパスワードの一方、または両方が違います。"
    }
  },
  "pt": {
    "alert": {
      "alreadyLoggedIn": "O usuário encontrasse logado atualmente. Por favor atualize a página para continuar.",
      "changePassword": "Para proteger a sua conta, certifique-se que sua senha tem 10 caracteres ou mais."
    },
    "oidc": {
      "body": "Clique em Continuar para prosseguir para a página de login.",
      "error": {
        "auth-ok-user-not-found": "Não há nenhuma conta no Central associada ao seu endereço de e-mail. Peça ao seu administrador do Central para criar uma conta para você continuar.",
        "email-not-verified": "Seu endereço de e-mail não foi verificado pelo seu servidor de login. Por favor, entre em contato com o administrador do seu servidor.",
        "email-claim-not-provided": "O Central não conseguiu acessar o endereço de e-mail associado à sua conta. Isso pode ter ocorrido porque o administrador do servidor configurou algo incorretamente ou não definiu um endereço de e-mail para a sua conta. Também pode ser resultado de opções de privacidade que você pode escolher durante o processo de login. Nesse caso, tente novamente e certifique-se de que seu e-mail seja compartilhado.",
        "internal-server-error": "Algo deu errado durante o login. Por favor, entre em contato com o administrador do seu servidor."
      }
    },
    "problem": {
      "401_2": "Endereço de email e/ou senha incorretos."
    }
  },
  "sw": {
    "alert": {
      "alreadyLoggedIn": "Mtumiaji tayari ameingia. Tafadhali onyesha upya ukurasa ili kuendelea."
    },
    "oidc": {
      "body": "Bofya Endelea ili kuendelea na ukurasa wa kuingia.",
      "error": {
        "auth-ok-user-not-found": "Hakuna akaunti ya Kati inayohusishwa na anwani yako ya barua pepe. Tafadhali muulize msimamizi wako Mkuu akufungulie akaunti ili uendelee.",
        "email-not-verified": "Anwani yako ya barua pepe haijathibitishwa na seva yako ya kuingia. Tafadhali wasiliana na msimamizi wa seva yako.",
        "email-claim-not-provided": "Central haikuweza kufikia anwani ya barua pepe inayohusishwa na akaunti yako. Hii inaweza kuwa kwa sababu msimamizi wa seva yako amesanidi kitu vibaya, au hajaweka anwani ya barua pepe kwa akaunti yako. Inaweza pia kuwa matokeo ya chaguzi za faragha ambazo unaweza kuchagua wakati wa mchakato wa kuingia. Ikiwa ndivyo, tafadhali jaribu tena na uhakikishe kuwa barua pepe yako inashirikiwa.",
        "internal-server-error": "Hitilafu fulani imetokea wakati wa kuingia. Tafadhali wasiliana na msimamizi wa seva yako."
      }
    },
    "problem": {
      "401_2": "Anwani ya barua pepe na/au nenosiri si sahihi."
    }
  },
  "zh": {
    "alert": {
      "alreadyLoggedIn": "已有用户登录，请刷新页面继续。",
      "changePassword": "为保护您的账户安全，请确保密码长度不少于10个字符。"
    },
    "oidc": {
      "body": "点击“继续”前往登录页面。",
      "error": {
        "auth-ok-user-not-found": "您的邮箱地址没有关联的Central账户。请联系Central管理员为您创建账户以继续操作。",
        "email-not-verified": "您的邮箱地址尚未通过登录服务器验证。请联系系统管理员。",
        "email-claim-not-provided": "Central无法访问您账户关联的邮箱地址。这可能是因为服务器管理员配置有误，或未为您的账户设置邮箱地址。也可能是您在登录过程中选择了隐私选项所致。如是后者，请重试并确保已勾选共享邮箱信息。",
        "internal-server-error": "登录过程中出现错误，请联系服务器管理员。"
      }
    },
    "problem": {
      "401_2": "邮箱地址和/或密码不正确。"
    }
  },
  "zh-Hant": {
    "alert": {
      "alreadyLoggedIn": "使用者已登入，重新載入頁面再繼續進行。",
      "changePassword": "為了保護您的帳戶，請確保您的密碼為 10 個字元以上。"
    },
    "oidc": {
      "body": "點選繼續進入登入頁面。",
      "error": {
        "auth-ok-user-not-found": "沒有與您的電子郵件地址關聯的 Central 帳戶。請要求您的 Central 管理員建立帳戶以便您繼續登入。",
        "email-not-verified": "您的登入伺服器尚未驗證您的電子郵件地址。請聯絡您的伺服器管理員。",
        "email-claim-not-provided": "Central 無法存取與您的帳戶關聯的電子郵件地址。這可能是因為您的伺服器管理員配置不正確，或沒有為您的帳戶設定電子郵件地址。這也可能是您在登入過程中可以選擇的隱私選項的結果。如果是這樣，請重試並確保您的電子郵件已分享。",
        "internal-server-error": "登入期間出現問題。請聯絡您的伺服器管理員。"
      }
    },
    "problem": {
      "401_2": "電子郵件地址和/或密碼不正確。"
    }
  }
}
</i18n>
