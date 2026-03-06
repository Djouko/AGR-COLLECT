<template>
  <li id="navbar-help-dropdown" class="dropdown">
    <a class="dropdown-toggle" href="#" data-toggle="dropdown" role="button"
      :aria-label="$t('help')" aria-haspopup="true" aria-expanded="false">
      <span class="icon-question-circle"></span><span class="caret"></span>
    </a>
    <ul class="dropdown-menu">
      <li>
        <router-link to="/legal/guide">
          <span class="icon-book"></span> {{ $t('guide') }}
        </router-link>
      </li>
      <li class="divider" role="separator"></li>
      <li>
        <router-link to="/legal/terms">{{ $t('terms') }}</router-link>
      </li>
      <li>
        <router-link to="/legal/privacy">{{ $t('privacy') }}</router-link>
      </li>
      <li>
        <router-link to="/legal/contacts">{{ $t('contacts') }}</router-link>
      </li>
    </ul>
  </li>
</template>

<script setup>
defineOptions({
  name: 'NavbarHelpDropdown'
});
</script>

<i18n lang="json5">
{
  "en": {
    // This text is used to label a help menu that lists links to useful
    // resources.
    "help": "Help",
    "guide": "AGR-Guide",
    "terms": "Terms of Use",
    "privacy": "Privacy Policy",
    "contacts": "Contact Us"
  },
  "fr": {
    "help": "Aide",
    "guide": "AGR-Guide",
    "terms": "Conditions d'utilisation",
    "privacy": "Politique de confidentialité",
    "contacts": "Nous contacter"
  }
}
</i18n>

<i18n>
{
  "cs": {
    "help": "Nápověda"
  },
  "de": {
    "help": "Hilfe"
  },
  "es": {
    "help": "Ayuda"
  },
  "fr": {
    "help": "Aide"
  },
  "id": {
    "help": "Bantuan"
  },
  "it": {
    "help": "Aiuto"
  },
  "pt": {
    "help": "Ajuda"
  },
  "sw": {
    "help": "msaada"
  },
  "zh": {
    "help": "帮助"
  },
  "zh-Hant": {
    "help": "幫助"
  }
}
</i18n>
