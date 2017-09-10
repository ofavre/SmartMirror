<template>
  <a class="no-decoration" :href="link" @click.prevent="openArticle">
    <v-card height="100%">
      <v-card-media :src="enclosureUrl" height="3em"></v-card-media>
      <v-card-title>
        <div class="title news-item-title">{{title}}</div>
        <div class="news-item-date">{{fromNow(pubDate)}}</div>
      </v-card-title>
      <v-card-text>
        <div class="news-item-description">{{description}}</div>
      </v-card-text>
    </v-card>
  </a>
</template>

<script>
  import * as moment from 'moment';

  export default {
    name: 'news-item',
    props: {
      item: {
        type: Element,
      },
    },
    data() {
      return {
        link: null,
        enclosureUrl: null,
        title: null,
        description: null,
        pubDate: null, // Date
        readable: null, // Object
      };
    },
    mounted() {
      this.link = this.item.querySelector('link').textContent;
      const enclosure = this.item.querySelector('enclosure');
      this.enclosureUrl = (enclosure && enclosure.getAttribute('url')) || null;
      this.title = this.item.querySelector('title').innerHTML;
      const description = this.item.querySelector('description').textContent;
      this.description = new DOMParser().parseFromString(description, 'text/html').body.textContent;
      this.pubDate = this.item.querySelector('pubDate').innerHTML;
    },
    methods: {
      openArticle(event) {
        console.log(event);
      },
      fromNow(pubDate) {
        return moment(new Date(pubDate)).fromNow();
      },
    },
  };
</script>

<style>
  A.no-decoration {
    text-decoration: none;
  }
  .news-item-title {
    margin-top: .25em;
    max-height: 3em;
    overflow-y: hidden;
  }
  .card__title {
    position: relative;
  }
  .news-item-date {
    position: absolute;
    top: 0;
    right: 0;
  }
  .card__text {
    padding-top: 0 !important;
  }
  .news-item-description {
    line-height: 1.1em;
    max-height: 4em;
    overflow-y: hidden;
  }
</style>
