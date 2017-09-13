import Vue from 'vue';
import Router from 'vue-router';
import Vuetify from 'vuetify';
import AsyncComputed from 'vue-async-computed';
import NewsList from '@/components/news-list';
import Weather from '@/components/weather';

import('@/../node_modules/vuetify/dist/vuetify.min.css');

Vue.use(Router);
Vue.use(Vuetify);
Vue.use(AsyncComputed);

const router = new Router({
  routes: [
    {
      path: '/news',
      name: 'news',
      component: NewsList,
      meta: {
        name: 'News',
        icon: 'rss_feed',
      },
      props() {
        return {
          feeds: router.app.feeds,
        };
      },
    },
    {
      path: '/weather',
      name: 'weather',
      component: Weather,
      meta: {
        name: 'Weather',
        icon: 'wb_sunny',
      },
      props() {
        return {
          places: router.app.weatherPlaces,
        };
      },
    },
  ],
});
export default router;
