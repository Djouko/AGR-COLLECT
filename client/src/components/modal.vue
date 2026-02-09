<!-- This component should not use v-bind:class on the .modal element. Bootstrap
may add the `in` class to the element, and the checkScroll() method may add the
`has-scroll` class. -->
<template>
  <teleport-if-exists to="#modals">
    <div ref="el" v-bind="$attrs" class="modal" tabindex="-1"
      :data-backdrop="backdrop ? 'static' : 'false'" data-keyboard="false"
      role="dialog" :aria-labelledby="titleId" @mousedown="modalMousedown"
      @click="modalClick" @keydown.esc="hideIfCan" @focusout="refocus">
      <div class="modal-dialog" :class="sizeClass" role="document">
        <div class="modal-content">
          <div class="modal-top-actions">
            <button type="button" class="close" :aria-disabled="!hideable"
              :aria-label="$t('action.close')" @click="hideIfCan">
              <span aria-hidden="true">&times;</span>
            </button>
            <div class="modal-banner"><slot name="banner"></slot></div>
          </div>
          <div class="modal-header">
            <h4 :id="titleId" class="modal-title"><slot name="title"></slot></h4>
          </div>
          <div ref="body" class="modal-body">
            <template v-if="state">
              <RedAlert v-show="redAlert.state"/>
            </template>
            <slot name="body"></slot>
          </div>
        </div>
      </div>
    </div>
  </teleport-if-exists>
</template>

<script>
let id = 0;
</script>
<script setup>
import { computed, inject, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import 'bootstrap/js/modal';

import RedAlert from './red-alert.vue';
import TeleportIfExists from './teleport-if-exists.vue';

import { noop } from '../util/util';

/*
We manually toggle the modal:

  - If the `backdrop` prop is `true`, we specify data-backdrop="static" rather
    than "true". We also add our own event listeners.
  - We specify data-keyboard="false" and add our own event listener.

We do this for two reasons:

  - It simplifies communication with the parent component: the modal hides only
    after the parent component sets the `state` prop to `false`.
  - It is needed to implement the `hideable` prop.
*/

defineOptions({
  inheritAttrs: false
});
const props = defineProps({
  state: Boolean,
  hideable: Boolean,
  size: {
    type: String,
    default: 'normal'
  },
  backdrop: Boolean
});
const emit = defineEmits(['shown', 'hide', 'resize', 'mutate']);

const { toast, redAlert, openModal } = inject('container');

const el = ref(null);
const body = ref(null);

let bs;
onMounted(() => {
  if (el.value.closest('body') != null) {
    const wrapper = $(el.value);
    bs = wrapper.modal.bind(wrapper);
  } else {
    bs = noop;
  }
});

/*
Showing a modal hides alerts, both `toast` and `redAlert`. A modal is a new
floating element, so as we show it, we hide any alert floating at the bottom of
the screen.

While shown, modals are never expected to call toast.show(). The toast would be
shown outside the modal. However, modals frequently call redAlert.show()
(perhaps indirectly, e.g., when handling request errors). The `redAlert` will be
shown at the top of the modal body.

When a modal is hidden, we hide `redAlert`. Otherwise, it would move to the
bottom of the screen.

We do not similarly hide `toast` when a modal is hidden. A modal is not expected
to call toast.show(), so if there is a toast when a modal is hidden, it must be
from something external to the modal. For example, it could be a toast about
upcoming session expiration. We don't want to hide such a toast when hiding the
modal.

This logic is tested in tests of the Alerts component. See the Alerts component
for related comments.
*/
watch(() => props.state, (state) => {
  redAlert.hide();
  if (state) toast.hide();
});

const checkScroll = () => {
  /* Before checking whether the modal overflows the viewport, we add the
  has-scroll class. The default assumption is that the modal may overflow. It's
  necessary to add the class, because if the modal currently doesn't have the
  class, and its content has just changed, it could be that its content doesn't
  overflow the viewport, yet does flow underneath .modal-actions. In that case,
  once we add the class, .modal-actions will be repositioned, and the content
  will start to overflow the viewport: the modal will be allowed to scroll as it
  should. */
  el.value.classList.add('has-scroll');
  if (el.value.scrollHeight === el.value.clientHeight)
    el.value.classList.remove('has-scroll');
};

let bodyHeight = 0;
const handleHeightChange = () => {
  checkScroll();
  const newHeight = body.value.getBoundingClientRect().height;
  if (newHeight !== bodyHeight) {
    bs('handleUpdate');
    bodyHeight = newHeight;
    emit('resize', newHeight);
  }
};
const handleWindowResize = () => {
  if (props.state && props.size === 'full') handleHeightChange();
};

let ignoreMutation = false;
const observer = new MutationObserver(() => {
  if (!props.state) return;
  handleHeightChange();
  if (!ignoreMutation) {
    emit('mutate');
    ignoreMutation = true;
    nextTick(() => { ignoreMutation = false; });
  }
});

const show = () => {
  bs('show');
  checkScroll();
  bodyHeight = body.value.getBoundingClientRect().height;
  observer.observe(body.value, {
    subtree: true,
    childList: true,
    attributes: true,
    characterData: true
  });
  window.addEventListener('resize', handleWindowResize);
  emit('shown');
  emit('resize', bodyHeight);
  openModal.shown(el.value);
};
const removeSelection = () => {
  const selection = getSelection();
  const { anchorNode } = selection;
  if (anchorNode != null && el.value.contains(anchorNode))
    selection.removeAllRanges();
};
const hide = () => {
  observer.disconnect();
  bs('hide');
  el.value.classList.remove('has-scroll');
  bodyHeight = 0;
  window.removeEventListener('resize', handleWindowResize);
  removeSelection();
  emit('resize', 0);
  openModal.hidden();
};
watch(() => props.state, (state) => {
  if (state)
    show();
  else
    hide();
});
onMounted(() => { if (props.state) show(); });
onBeforeUnmount(() => { if (props.state) hide(); });

const hideIfCan = () => { if (props.hideable) emit('hide'); };

const sizeClass = computed(() => {
  switch (props.size) {
    case 'large': return 'modal-lg';
    case 'full': return 'modal-full';
    default: return null; // 'normal'
  }
});

let mousedownOutsideDialog = false;
const modalMousedown = (event) => {
  mousedownOutsideDialog = event.target === event.currentTarget;
};
const modalClick = (event) => {
  const mouseupOutsideDialog = event.target === event.currentTarget;
  if (mousedownOutsideDialog && mouseupOutsideDialog) hideIfCan();
};

const refocus = () => {
  /* As the user moves from one element in the modal to another, there may be
  the briefest moment when neither element is focused. We should not refocus the
  modal in that moment, because the second element will soon receive focus, and
  focusing the .modal element would prevent that. Thus, we use setTimeout() to
  give the second element time to receive focus. (Using nextTick() instead of
  setTimeout() didn't work.) */
  setTimeout(() => {
    if (!props.state || el.value == null) return;
    if (document.activeElement != null &&
      document.activeElement.closest('.modal') === el.value)
      return;
    el.value.focus();
  });
};

id += 1;
const titleId = `modal-title${id}`;
</script>

<style lang="scss">
@import '../assets/scss/mixins';

$modal-radius: 12px;

.modal-dialog {
  margin: 10vh auto;

  .modal-content {
    border: none;
    border-radius: $modal-radius;
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.18), 0 4px 12px rgba(0, 0, 0, 0.08);
    overflow: hidden;

    .modal-top-actions {

      .modal-banner {
        display: contents;
        width: 100%;
        padding: 0px;
        margin: 0px;

        &>* {
          border-top-left-radius: $modal-radius;
          border-top-right-radius: $modal-radius;
        }

        img {
          width: 100%;
          border-bottom: 1px solid #e5e7eb;
        }
      }

      .close { @include modal-close; }
    }

    .modal-header {
      border-bottom: 0px;
      color: #111827;
      padding: $padding-modal-header;
      padding-bottom: $padding-modal-content-spacing;

      h4 {
        @include text-overflow-ellipsis;
        font-size: 20px;
        font-weight: 700;
        letter-spacing: -0.01em;
      }
    }

    .modal-body {
      padding: $padding-modal-body;
      padding-block: 0px;

      .modal-introduction:not(:has(+ .modal-actions)) {
        margin-bottom: $padding-modal-content-spacing;
      }

      p {
        max-width: 100%;
        margin: 0 0 $padding-modal-content-spacing;
        color: #6b7280;
        line-height: 1.6;

        &:last-child,
        &:has(+ .modal-actions) {
          margin-bottom: 0;
        }
      }

      .form-group {
        &:has(+ .modal-actions) {
        margin-bottom: 0px;
        }
      }

      .modal-actions {
        margin-left: -$padding-modal-body;
        margin-right: -$padding-modal-body;

        background: #f9fafb;
        border-top: 1px solid #e5e7eb;
        border-bottom-left-radius: $modal-radius;
        border-bottom-right-radius: $modal-radius;
        padding: $padding-modal-actions;
        text-align: right;
      }
    }

    .modal-body:not(:has(.modal-actions)) {
      padding-block-end: calc($padding-modal-body / 2);
    }
  }
}



.modal-full {
  $margin: 40px;
  margin: $margin 0 $margin $margin;
  width: calc(100vw - #{2 * $margin + 10px});

  .modal-body { min-height: calc(100vh - #{2 * $margin + 100px}); }

  .modal:not(.has-scroll) & .modal-actions {
    bottom: 0;
    left: 0;
    margin: 0;
    position: absolute;
    width: 100%;
  }
}

.modal-warnings, .modal-introduction {
  ul {
    @include text-list;

    margin-left: -5px;
  }
}

.modal-warnings {
  background-color: #fff8e1;
  border-radius: 8px;
  margin-bottom: 15px;
  padding: 15px;

  :last-child {
    margin-bottom: 0;
  }
}
</style>
