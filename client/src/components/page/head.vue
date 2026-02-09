<template>
  <div id="page-head" class="row">
    <div class="col-xs-12">
      <div id="page-head-title-infonav">
        <div id="page-head-title" class="h1" v-tooltip.text><slot name="title"></slot></div>
        <slot name="infonav"></slot>
      </div>
      <div id="page-description"><slot name="description"></slot></div>
      <ul id="page-head-tabs" class="nav nav-tabs">
        <slot name="tabs"></slot>
      </ul>
    </div>
  </div>
</template>

<script setup>
defineOptions({
  name: 'PageHead'
});
</script>

<style lang="scss">
@import '../../assets/scss/variables';

#page-head {
  background: linear-gradient(180deg, #ffffff 0%, #fafbfc 100%);
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
}

.breadcrumbs + #page-head .h1 {
  margin-top: 0;
  line-height: 1.15;
}

#page-head-title-infonav {
  padding-top: 14px;
  padding-bottom: 16px;
  display: flex;
  align-items: center;
}

#page-head-title {
  overflow-wrap: break-word;
  overflow: hidden;
  color: #111827;
  font-weight: 700;
  letter-spacing: -0.02em;
}

#page-head-body, #page-description {
  color: #6b7280;
  font-size: 14px;
  letter-spacing: -0.01em;
  margin-bottom: 12px;
  line-height: 1.5;
}

#page-head-tabs {
  > li {
    &:only-child {
      display: none;
    }

    > a {
      &, &:hover, &:focus {
        border-bottom-width: 3px;
      }
    }

    &.active > a {
      &, &:hover, &:focus {
        background-color: transparent;
        font-weight: 600;
      }
    }
  }

  .badge { margin-left: 3px; }
}
</style>
