(function(document) {
  'use strict';

  // Grab a reference to our auto-binding template
  // and give it some initial binding values
  // Learn more about auto-binding templates at http://goo.gl/Dx1u2g
  var app = document.querySelector('#app');

  app.feedUrls = [
    { url: "http://www.lemonde.fr/pixels/rss_full.xml", alias: "Pixels - Le Monde" },
    { url: "http://www.lemonde.fr/international/rss_full.xml", alias: "International - Le Monde" },
    { url: "http://www.lemonde.fr/politique/rss_full.xml", alias: "Politique - Le Monde" },
    { url: "http://www.lemonde.fr/economie/rss_full.xml", alias: "Économie - Le Monde" },
    { url: "http://www.lemonde.fr/sciences/rss_full.xml", alias: "Sciences - Le Monde" },
  ];

})(document);
