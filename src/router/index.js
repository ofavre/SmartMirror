import Vue from 'vue';
import Router from 'vue-router';
import NewsList from '@/components/news-list';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'news-list',
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
