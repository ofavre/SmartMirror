<template>
  <div class="news-reader--wrapper" v-if="created" v-show="visible" @click.self="shadowClicked">
    <v-layout>
      <v-flex>
        <v-card height="100%">
          <v-card-title primary-title>
            <slot name="title"/>
          </v-card-title>
          <v-card-text>
            <slot name="default"/>
          </v-card-text>
          <v-card-actions>
            <slot name="buttons">
              <v-btn flat @click="close">Close</v-btn>
            </slot>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
  export default {
    name: 'NewsReader',
    data() {
      return {
        created: false,
        visible: false,
      };
    },
    methods: {
      open() {
        this.created = true;
        this.visible = true;
        document.body.classList.add('news-reader-opened');
      },
      close() {
        this.visible = false;
      },
      shadowClicked() {
        this.close();
      },
    },
  };
</script>

<style>
  BODY.news-reader-opened {
    overflow: hidden;
  }
  .news-reader--wrapper {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 10000;
    background-color: rgba(0, 0, 0, 0.75);
    overflow-y: scroll;
    padding: 1em;
  }
  .news-reader--wrapper > .layout {
    max-width: 40em;
    margin: 0 auto;
  }
  .news-reader--wrapper cart__text img {
    max-width: 100%;
  }
</style>
