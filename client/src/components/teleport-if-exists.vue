<template>
  <teleport v-if="exists" :to="to">
    <slot></slot>
  </teleport>
  <template v-else>
    <slot></slot>
  </template>
</template>

<script setup>
/*
This component teleports content if the teleport `to` target exists in the DOM.
If the target does not exist, the content is rendered where it is without being
teleported.

This can be useful in testing. Even if the teleport `to` target always exists in
production, a particular test might not render the target if the test doesn't
mount the entire app. In that case, we still want to render the content; we just
won't teleport it. Usually it doesn't matter to tests whether content is
teleported. If it matters, the test should make sure that the teleport `to`
target exists by mounting the whole app and attaching it to the document body.
*/

const props = defineProps({
  to: {
    type: String,
    required: true
  }
});

const exists = document.querySelector(props.to) != null;
</script>
