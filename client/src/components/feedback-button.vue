<template>
    <div id="feedback-button">
      <a :href="surveyLink" target="_blank"><span>{{ $t('feedback') }}</span></a>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { queryString } from '../util/request';

defineOptions({
  name: 'FeedbackButton'
});

const route = useRoute();

const surveyLink = computed(() => {
  const query = queryString({
    st: '9hflqGrodnpWyS8g69dbORJ3RD8jSQChTBMaf7zpE5gaPElyDtKgAjI79y$zqctG',
    'd[/data/host]': window.location.host,
    'd[/data/page]': route.name
  });

  return `#${query}`;
});
</script>

<style lang="scss">
@import '../assets/scss/variables';

#feedback-button span {
  display: block;
  background-color: white;
  position: fixed;
  z-index: 99999;
  right: 0;
  bottom: 250px;
  height: 4em;
  border: 2px solid;
  border-color: $color-accent-primary;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  text-align: center;
  line-height: 2em;
  cursor: pointer;
  transform-origin: 50% 50%;
  transform: translateX(50%) rotate(-90deg);
  transition: right 0.25s;

  color: $color-accent-primary;
  font-size: 1em;
  padding: 0em 1.25em 0 1.25em;
}

#feedback-button span:hover,
#feedback-button:focus-within span {
  right: 10px;
}

@media print {
  #feedback-button {
    display: none;
  }
}
</style>

  <i18n lang="json5">
  {
    "en": {
      // Text for a hovering feedback button shown anchored to right of screen. If your language doesn't have a single word or short
      // phrase for "feedback", consider something like "comments" or "reactions".
      "feedback": "Feedback"
    }
  }
  </i18n>

<i18n>
{
  "de": {
    "feedback": "Rückmeldung"
  },
  "es": {
    "feedback": "Comentario"
  },
  "fr": {
    "feedback": "Retour d'information"
  },
  "it": {
    "feedback": "Riscontro"
  },
  "pt": {
    "feedback": "Feedback"
  },
  "zh": {
    "feedback": "反馈"
  },
  "zh-Hant": {
    "feedback": "回饋"
  }
}
</i18n>
