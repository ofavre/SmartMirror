<template>
  <a :href="link" @click="openArticle">
    <div class="paper-card news-item">
      <div class="news-item-content">
        <div class="card-content">
          <div class="news-item-title">{{title}}</div>
          <div class="sm-news-date">{{fromNow(pubDate)}}</div>
          <div class="news-item-description">{{description}}</div>
        </div>
      </div>
      <div class="news-item-image" :style="{backgroundImage: 'url('+enclosureUrl+')'}">
      </div>
    </div>
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
