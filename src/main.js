// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';

Vue.config.productionTip = false;

const feeds = [
  { url: 'http://www.lemonde.fr/pixels/rss_full.xml', alias: 'Pixels - Le Monde' },
  // { url: 'http://www.lemonde.fr/international/rss_full.xml', alias: 'International - Le Monde' },
  // { url: 'http://www.lemonde.fr/politique/rss_full.xml', alias: 'Politique - Le Monde' },
  // { url: 'http://www.lemonde.fr/economie/rss_full.xml', alias: 'Économie - Le Monde' },
  // { url: 'http://www.lemonde.fr/sciences/rss_full.xml', alias: 'Sciences - Le Monde' },
];

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App :feeds="feeds"/>',
  components: { App },
  data: {
    feeds,
  },
});
