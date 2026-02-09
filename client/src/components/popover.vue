<template>
  <div v-if="target != null" class="popover">
    <div class="popover-content">
      <slot></slot>
    </div>
    <div class="arrow"></div>
  </div>
</template>

<script>
import { arrow, computePosition, flip, inline, offset, shift } from '@floating-ui/dom';

export default {
  name: 'Popover',
  props: {
    target: HTMLElement, // eslint-disable-line vue/require-default-prop
    placement: {
      type: String,
      default: 'right'
    }
  },
  emits: ['hide'],
  watch: {
    target(newTarget) {
      if (newTarget != null) this.$nextTick(this.show);
    }
  },
  mounted() {
    if (this.target != null) this.$nextTick(this.show);

    document.addEventListener('click', this.hideAfterClick, true);
    window.addEventListener('resize', this.hideAfterResize);
    document.addEventListener('keydown', this.hideAfterEsc);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.hideAfterClick, true);
    window.removeEventListener('resize', this.hideAfterResize);
    document.removeEventListener('keydown', this.hideAfterEsc);
  },
  methods: {
    show() {
      const arrowEl = this.$el.querySelector('.arrow');

      computePosition(this.target, this.$el, {
        placement: this.placement,
        middleware: [
          offset(0),
          shift({ padding: 5 }),
          inline(),
          flip({ fallbackPlacements: ['bottom', 'left', 'right', 'top'] }),
          arrow({ element: arrowEl }),
        ]
      })
        .then(({ x, y, placement, strategy, middlewareData }) => {
          const { style } = this.$el;
          style.top = `${y}px`;
          style.left = `${x}px`;
          this.$el.classList.remove(...['top', 'right', 'bottom', 'left']);
          this.$el.classList.add(placement);
          style.position = strategy;

          const side = placement.split('-')[0];
          const staticSide = {
            top: 'bottom',
            right: 'left',
            bottom: 'top',
            left: 'right'
          }[side];

          if (middlewareData.arrow) {
            // eslint-disable-next-line no-shadow
            const { x, y } = middlewareData.arrow;
            Object.assign(arrowEl.style, {
              left: x != null ? `${x + 10}px` : '',
              top: y != null ? `${y + 10}px` : '',
              [staticSide]: y != null ? `${-arrowEl.offsetWidth}px` : `${-arrowEl.offsetHeight}px`
            });
          }
        });
    },
    hideAfterClick(event) {
      if (this.target != null &&
          ((event.target.closest('.popover') == null && !this.target.contains(event.target)) ||
            (event.target.hasAttribute('data-closes-popover'))))
        this.$emit('hide');
    },
    hideAfterResize() {
      if (this.target != null) this.$emit('hide');
    },
    hideAfterEsc({ key }) {
      if (this.target != null && key === 'Escape') this.$emit('hide');
    }
  }
};
</script>

<style lang="scss">
@import '../assets/scss/variables';

.popover {
  display: block;
  border: none;
  box-shadow: $box-shadow-popover;
  font-family: inherit;
  max-width: none;
  padding: 0;
}

.popover-content { padding: 0; }

</style>
