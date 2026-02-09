<template>
  <div ref="el" class="hover-card">
    <div class="hover-card-heading">
      <span :class="`icon-${icon}`"></span>
      <div>
        <div class="hover-card-title"><slot name="title"></slot></div>
        <div class="hover-card-subtitle"><slot name="subtitle"></slot></div>
      </div>
    </div>
    <div class="hover-card-body" :class="{ 'truncate-dt': truncateDt }">
      <slot name="body"></slot>
    </div>
    <div class="hover-card-footer"><slot name="footer"></slot></div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

import { px, styleBox } from '../util/dom';

defineOptions({
  name: 'HoverCard'
});
const props = defineProps({
  icon: {
    type: String,
    required: true
  },
  /* By default, <dt> elements will be truncated if their width exceeds 50% of
  the hover card. However, if <dt> elements have a known fixed width -- if their
  text is not user-provided or arbitrarily long -- then we don't want to
  truncate them. (You can't hover over a hover card, so we can't show a tooltip
  over truncated text.) That said, we still generally don't want the width of a
  <dt> to exceed 50% of the hover card (to be wider than the <dd>). With that in
  mind, if truncateDt is `false`, there will be no restriction on the width of
  <dt> elements, but the width of <dd> elements will be allowed to grow up to
  the width of the <dt> elements. */
  truncateDt: {
    type: Boolean,
    default: true
  }
});

const el = ref(null);
const computeWidth = (body) => {
  const dt = body.querySelector('dt');
  if (dt == null) return 0;

  const dtWidth = dt.getBoundingClientRect().width;
  const ddWidth = body.querySelector('dd').getBoundingClientRect().width;
  return dtWidth + Math.min(dtWidth, ddWidth);
};
const resize = () => {
  if (props.truncateDt) return;

  const body = el.value.querySelector('.hover-card-body');
  const box = styleBox(getComputedStyle(body));
  const currentWidth = body.getBoundingClientRect().width -
    box.borderLeft - box.borderRight;

  const siblings = [...el.value.querySelectorAll(':scope > :not(.hover-card-body)')];
  for (const sibling of siblings) sibling.style.display = 'none';
  el.value.style.width = 'auto';

  const newWidth = computeWidth(body);

  el.value.style.width = '';
  for (const sibling of siblings) sibling.style.display = '';

  if (newWidth > currentWidth)
    el.value.style.width = px(el.value.getBoundingClientRect().width + newWidth - currentWidth);
};
onMounted(resize);
</script>

<style lang="scss">
@import '../assets/scss/mixins';

$border: 1px solid #fff;
$border-radius: 12px;

.popover:has(.hover-card) { border-radius: $border-radius; }
.hover-card { width: 290px; }

.hover-card-heading {
  $icon-margin-top: 2px;

  background-color: #374151;
  border-inline: $border;
  border-top: $border;
  border-top-left-radius: $border-radius;
  border-top-right-radius: $border-radius;
  color: #fff;
  display: flex;
  line-height: 1.2;
  padding: #{$padding-panel-body - $icon-margin-top} $padding-panel-body 13px;

  > [class^="icon-"] {
    flex-shrink: 0;
    font-size: 26px;
    margin-right: 10px;
    margin-top: $icon-margin-top;
  }

  > div { overflow: hidden; }
}

.hover-card-title {
  @include text-overflow-ellipsis;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 1px;
}

.hover-card-subtitle { font-size: 12px; }

.hover-card-body {
  background-color: #fff;
  border-inline: $border;

  dl {
    grid-template-columns: max-content 1fr;
    margin-bottom: 0;
    padding-block: $padding-block-dl;
  }

  dd:not(.dl-data-dd) { @include text-overflow-ellipsis; }

  &.truncate-dt {
    dl { grid-template-columns: fit-content(50%) 1fr; }
    dt:not(.dl-data-dt) { @include text-overflow-ellipsis; }
  }
}

.hover-card-footer {
  background-color: #e5e7eb;
  border-inline: $border;

  &:empty { display: none; }
}

.hover-card-footer, .hover-card:has(.hover-card-footer:empty) .hover-card-body {
  border-bottom: $border;
  border-bottom-left-radius: $border-radius;
  border-bottom-right-radius: $border-radius;
}
</style>
