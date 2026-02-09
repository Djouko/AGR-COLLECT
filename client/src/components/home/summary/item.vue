<template>
  <linkable tag="div" :to="to" class="home-summary-item">
    <div class="heading">
      <span :class="`icon-${icon}`"></span>
      <div>
        <div class="header">
          <slot name="header"></slot>
        </div>
        <div class="subheader">
          <slot name="subheader"></slot>
        </div>
      </div>
    </div>
    <p class="body"><slot name="body"></slot></p>
  </linkable>
</template>

<script>
import Linkable from '../../linkable.vue';

export default {
  name: 'HomeSummaryItem',
  components: { Linkable },
  props: {
    to: String,
    icon: {
      type: String,
      required: true
    }
  }
};
</script>

<style lang="scss">
@import '../../../assets/scss/mixins';

.home-summary-item {
  padding: 22px;
  background: white;
  border-radius: 14px;
  border: 1px solid #e5e7eb;
  border-left: 4px solid $color-action-background;
  flex: 1 1 0px;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  cursor: default;
  position: relative;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(46, 125, 50, 0.1);
    border-left-color: #1b5e20;
  }

  &[href] {
    cursor: pointer;
    text-decoration: none;
  }

  .heading {
    align-items: center;
    display: flex;
    gap: 16px;
    margin-bottom: 14px;

    > [class^="icon-"] {
      @include icon-box;
      font-size: 24px;
    }
  }

  .header {
    font-size: 22px;
    margin-bottom: 2px;
    line-height: 1;
    font-weight: 800;
    color: #111827;
    letter-spacing: -0.02em;
  }

  .subheader {
    font-size: 11px;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    font-weight: 600;
  }

  .body {
    font-size: 13px;
    line-height: 19px;
    margin-bottom: 0;
    color: #9ca3af;
  }
}
</style>
