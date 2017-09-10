import Vue from 'vue';
import Router from 'vue-router';
import Vuetify from 'vuetify';
import NewsList from '@/components/news-list';

import('@/../node_modules/vuetify/dist/vuetify.min.css');

Vue.use(Router);
Vue.use(Vuetify);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'News',
      component: NewsList,
      props() {
        return {
          feeds: router.app.feeds,
        };
      },
    },
  ],
});
export default router;
