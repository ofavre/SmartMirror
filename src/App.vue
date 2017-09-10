<template>
  <v-app dark toolbar footer>
    <v-navigation-drawer permanent mini-variant v-model="drawer" enable-resize-watcher overflow>
      <v-list dense>
        <router-link :to="{name: 'news'}" active-class="active">
          <v-list-tile @click="">
            <v-list-tile-action>
              <v-icon>rss_feed</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>News</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </router-link>
        <router-link :to="{name: 'weather'}" active-class="active">
          <v-list-tile @click="">
            <v-list-tile-action>
              <v-icon>wb_sunny</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Weather</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </router-link>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar fixed>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>{{$route.meta.name}}</v-toolbar-title>
    </v-toolbar>
    <main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </main>
    <v-footer><!-- Prevents the real footer from hiding content --></v-footer>
    <v-footer fixed>
      <clock class="time"/>
    </v-footer>
  </v-app>
</template>

<script>
  import Clock from '@/components/clock';

  export default {
    name: 'app',
    components: {
      Clock,
    },
    data() {
      return {
        drawer: false,
      };
    },
    props: {
      feeds: {
        type: Array,
        required: true,
      },
    },
  };
</script>

<style>
  footer > .time {
    position: absolute;
    right: 0;
  }
  .navigation-drawer A {
    text-decoration: none;
  }
  .navigation-drawer A.active {
    text-decoration: underline;
  }
</style>
