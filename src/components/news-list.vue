<template>
  <div class="news">
    <h1>News</h1>
    <news-feed :url="feed.url" :alias="feed.alias" v-for="(feed, index) in feeds" :key="index"></news-feed>
  </div>
</template>

<script>
  import NewsFeed from '@/components/news-feed';

  export default {
    name: 'news-list',
    components: {
      NewsFeed,
    },
    props: {
      feeds: {
        type: Array,
        required: true,
      },
    },
  };
</script>
