import { createApp } from 'vue';

// The global styles must be imported before any component so that they precede
// components' styles.
import './styles';

import App from './components/app.vue';

import createContainer from './container';
import vTooltip from './directives/tooltip';
// ./jquery must be imported before any of Bootstrap's JavaScript plugins,
// because the plugins require jQuery.
import './jquery';
import './bootstrap';

createApp(App)
  .use(createContainer())
  .directive('tooltip', vTooltip)
  .mount('#app');
