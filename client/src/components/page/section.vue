<template>
  <div class="page-section" :class="{ horizontal }">
    <div class="page-section-heading">
      <!-- The first element of this slot should be a <span> element that
      contains the title of the page section. -->
      <slot name="heading"></slot>
    </div>
    <div class="page-section-body">
      <slot name="body"></slot>
    </div>
  </div>
</template>

<script setup>
defineOptions({
  name: 'PageSection'
});
defineProps({
  horizontal: Boolean
});
</script>

<style lang="scss">
@import '../../assets/scss/variables';

.page-section {
  margin-bottom: 28px;
}

.page-section-heading {
  font-size: 28px;
  margin-bottom: 14px;
  position: relative;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;

  @mixin page-section-heading {
    color: $color-accent-primary;
    font-weight: 700;
    letter-spacing: -0.02em;

    + .btn { margin-left: 12px; }
    ~ .btn {
      position: relative;
      top: -1px;
    }
  }

  > h1:first-child,
  > h2:first-child,
  > h3:first-child,
  > h4:first-child,
  > h5:first-child,
  > h6:first-child {
    @include page-section-heading;
    margin-top: 0px;
  }

  > span:first-child {
    @include page-section-heading;
  }
}

.page-section.horizontal {
  display: flex;

  .page-section-heading {
    line-height: 1;
    margin-bottom: 0;
    margin-right: 20px;
  }

  .page-section-body { flex: 1; }
}
</style>
