<template>
  <div v-if="loading">
    Loading…
  </div>
  <div v-else-if="error">
    Error {{error}}
  </div>
  <div v-else>
    <a :href="link">
      <h3 class="news-feed-title">
        <template v-if="!alias">
          <img :src="image"/>
          <span>{{title}}</span>
        </template>
        <template v-else>
          <span>{{alias}}</span>
        </template>
      </h3>
    </a>
    <span>{{description}}</span>

    <div class="list">
      <news-item v-for="(item, index) in items" :item="item" :key="index"></news-item>
    </div>
  </div>
</template>

<script>
  import NewsItem from '@/components/news-item';

  export default {
    name: 'news-feed',
    components: {
      NewsItem,
    },
    data() {
      return {
        loading: true,
        error: null,
        title: null,
        description: null,
        link: null,
        items: [],
      };
    },
    props: {
      url: {
        type: String,
        required: true,
      },
      alias: {
        type: String,
      },
    },
    mounted() {
      this.load();
    },
    methods: {
      load() {
        this.loading = true;
        return fetch(this.url).then((response) => {
          if (!response.ok) {
            throw new Error(`Status ${response.status}`);
          }
          return response.text().then(text => new DOMParser().parseFromString(text, 'text/xml')).then((rss) => {
            console.log(rss);
            this.title = rss.querySelector('channel > title').innerHTML;
            this.image = rss.querySelector('channel > image > url').textContent;
            this.description = rss.querySelector('channel > description').innerHTML;
            this.link = Array.prototype.slice.call(rss.querySelectorAll('channel > link')).filter(e => !e.namespaceURI)[0].textContent;
            this.items = Array.prototype.slice.call(rss.querySelectorAll('channel > item'));
            console.log(this.items);
          });
        }).catch((error) => {
          this.error = error;
        })
        .then(() => {
          this.loading = false;
        });
      },
    },
  };

  // TODO AJAX
</script>
