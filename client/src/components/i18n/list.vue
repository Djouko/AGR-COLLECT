<template>
  <span v-if="list.length !== 0" ref="el" class="i18n-list">
    <template v-for="(element, index) in list" :key="index">
      <!-- Since `literals` is updated after the DOM is updated, literals.length
      may differ briefly from list.length. That means that literals[index] may
      be `undefined`. -->
      <span v-if="literals[index]">{{ literals[index] }}</span>
      <span class="element">
        <slot :value="element" :index="index">{{ element }}</slot>
      </span>
    </template>
    <span v-if="lastLiteral">{{ lastLiteral }}</span>
  </span>
</template>

<script setup>
import { computed, nextTick, onUpdated, ref, shallowRef, watchPostEffect } from 'vue';
import { last } from 'ramda';

import { useI18nUtils } from '../../util/i18n';

defineOptions({
  name: 'I18nList'
});
const props = defineProps({
  list: {
    type: Array,
    required: true
  }
});

/* The broad approach here is to pass the values of props.list to slots, then to
pass the resulting text of the slots to formatListToParts(). formatListToParts()
will return text to insert between and around the slots (the list "literals").
This component is unusual in that it is rendered in two steps. First, the slots
are rendered, after which formatListToParts() is called. Next, the DOM is
updated with the resulting literals. This means that the component will not be
fully rendered until a tick after it is mounted. */

const literals = shallowRef([]);
const el = ref(null);
const { formatListToParts } = useI18nUtils();
const format = () => {
  literals.value = new Array(props.list.length + 1).fill('');
  if (props.list.length === 0) return;
  const elements = [...el.value.querySelectorAll(':scope > .element')]
    .map(element => element.innerText);
  const parts = formatListToParts(elements);
  let index = 0;
  for (const part of parts) {
    if (part.type === 'literal') {
      literals.value[index] += part.value;
    } else {
      if (index === elements.length || part.value !== elements[index])
        throw new Error('element mismatch');
      index += 1;
    }
  }
};
let formatted = false;
watchPostEffect(() => {
  format();
  formatted = true;
  nextTick(() => { formatted = false; });
});
onUpdated(() => { if (!formatted) format(); });

const lastLiteral = computed(() => last(literals));
</script>
