<template>
  <div class="news-item">
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
    <news-reader ref="reader">
      <h3 slot="title">{{readable ? readable.title : 'Loading…'}}</h3>
      <div v-html="readable ? readable.content : 'Loading…'"></div>
    </news-reader>
  </div>
</template>

<script>
  import * as moment from 'moment';
  import readable from '@/readable';
  import NewsReader from '@/components/news-reader';

  export default {
    name: 'news-item',
    components: {
      NewsReader,
    },
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
      getReadable() {
        if (!this.readable) {
          return readable(this.link).then((json) => {
            this.readable = json;
            return json;
          });
        }
        return Promise.resolve(this.readable);
      },
      openArticle() {
        return this.getReadable().then(this.$refs.reader.open);
        // {
        //   "title": "Angry Birds veut s’envoler en Bourse",
        //   "author": null,
        //   "date_published": "2017-09-30T00:00:00.000Z",
        //   "dek": null,
        //   "lead_image_url": "http://s1.lemde.fr/image/2017/09/30/644x322/5194028_3_1d5d_bomb-chuck-et-red-les-personnages-d-angry-b_9e17efe3b497a31bcc72673d6fe977a5.jpg",
        //   "content": "<div><p class=\"txt3 description-article\">Rovio, l&#x2019;&#xE9;diteur finlandais de la s&#xE9;rie de jeux, a fait ses premiers pas en Bourse &#xE0; Helsinki, le 29 septembre.</p><div id=\"articleBody\" class=\"contenu_article js_article_body\"> <figure class=\"illustration_haut\">\n<img width=\"534\" class=\"illu lazy-retina\" src=\"http://s1.lemde.fr/image/2017/09/30/534x0/5194028_7_3b84_bomb-chuck-et-red-les-personnages-d-angry_96bfb301c4cbccbc19c461dca873eedf.jpg\" alt=\"Bomb, Chuck et Red, les personnages d&#x2019;Angry Birds, &#xE0; Helsinki, en mai 2016.\"> <figcaption class=\"legende\"><span class=\"source_image\"></span> </figcaption> </figure> <p>Editrice de la s&#xE9;rie de jeux sur mobile <em>Angry Birds</em>, Rovio a effectu&#xE9;, vendredi 29&#xA0;septembre, ses premiers pas en Bourse, au Nasdaq d&#x2019;Helsinki. Longtemps attendu, ce mouvement valorise la soci&#xE9;t&#xE9; finlandaise &#xE0; plus de 1 milliard de dollars. A court terme, l&#x2019;op&#xE9;ration doit lui permettre de lever 30&#xA0;millions d&#x2019;euros. Une somme que l&#x2019;entreprise entend consacrer &#xE0; de futures acquisitions, notamment en Chine, o&#xF9; elle souhaite d&#xE9;velopper son activit&#xE9;. Selon l&#x2019;un de ses porte-parole, il s&#x2019;agit &#xE9;galement de <em>&#xAB;&#xA0;donner davantage de visibilit&#xE9; &#xE0; Rovio en tant qu&#x2019;acteur majeur du divertissement&#xA0;&#xBB;</em>.</p>\n<p>Cr&#xE9;&#xE9;e en&#xA0;2003, Rovio a chang&#xE9; de dimension avec le succ&#xE8;s retentissant du premier &#xE9;pisode d<em>&#x2019;Angry Birds</em>, lanc&#xE9; en d&#xE9;cembre&#xA0;2009 sur l&#x2019;App Store d&#x2019;Apple, alors que le march&#xE9; des applications mobiles n&#x2019;en &#xE9;tait qu&#x2019;&#xE0; ses balbutiements. Etendue aux autres plates-formes de smartphones, d&#xE9;clin&#xE9;e en de multiples versions (<em>Angry Birds Seasons,</em> <em>Angry Birds Rio</em>, <em>Angry Birds Star Wars</em>&#x2026;), la s&#xE9;rie atteint le milliard de t&#xE9;l&#xE9;chargements d&#xE8;s 2012. A l&#x2019;&#xE9;poque, l&#x2019;id&#xE9;e d&#x2019;une introduction en Bourse est d&#xE9;j&#xE0; &#xE9;voqu&#xE9;e, et la valorisation de l&#x2019;entreprise, estim&#xE9;e &#xE0; 8&#xA0;milliards d&#x2019;euros&#x2026;</p>\nEngouement pour les personnages\n<p><em>&#xAB;&#xA0;Puis le succ&#xE8;s s&#x2019;est d&#xE9;gonfl&#xE9;&#xA0;&#xBB;,</em> explique Laurent Michaud, sp&#xE9;cialiste du march&#xE9; du jeu vid&#xE9;o&#xA0;au sein de l&#x2019;institut Idate&#xA0;: <em>&#xAB;&#xA0;La soci&#xE9;t&#xE9; a cr&#xFB; au rythme du buzz. Elle a surinvesti dans sa croissance, alors que le chiffre d&#x2019;affaires ne suivait pas&#xA0;n&#xE9;cessairement.&#xA0;&#xBB;</em> S&#x2019;appuyant sur l&#x2019;engouement pour ses personnages, elle investit dans la production de contenus vid&#xE9;o pour la t&#xE9;l&#xE9;vision, les produits d&#xE9;riv&#xE9;s et m&#xEA;me les parcs d&#x2019;attractions. Mais les r&#xE9;sultats ne sont pas au rendez-vous. Les revenus s&#x2019;essoufflent et, en&#xA0;2015, la soci&#xE9;t&#xE9; affiche pour la premi&#xE8;re fois des pertes, d&#x2019;un montant de 13&#xA0;millions d&#x2019;euros. La m&#xEA;me ann&#xE9;e, Rovio doit se s&#xE9;parer de 260 employ&#xE9;s, soit 38&#xA0;% de ses effectifs.</p>\n<p><em>&#xAB;&#xA0;A...</em></p> </div></div>",
        //   "next_page_url": null,
        //   "url": "http://www.lemonde.fr/pixels/article/2017/09/30/angry-birds-veut-s-envoler-en-bourse_5194030_4408996.html",
        //   "domain": "www.lemonde.fr",
        //   "excerpt": "Rovio, l’éditeur finlandais de la série de jeux,
        //               a fait ses premiers pas en Bourse à Helsinki, le 29 septembre.",
        //   "word_count": 323,
        //   "direction": "ltr",
        //   "total_pages": 1,
        //   "rendered_pages": 1
        // }
      },
      fromNow(pubDate) {
        return moment(new Date(pubDate)).fromNow();
      },
    },
  };
</script>

<style>
  .news-item {
    display: inline;
  }
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
    max-height: 4.3em;
    overflow-y: hidden;
  }
</style>
