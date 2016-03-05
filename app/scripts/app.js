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

  app.readableify = function(url) {
    return new Promise(function(resolve, reject) {
      jQuery.ajax({
        method: 'GET',
        url: "https://cors-anywhere.herokuapp.com/http://www.readability.com/api/content/v1/parser",
        data: {
          url: url,
          token: 'c63bfc7cd66292cfd16caa30cd8eae0eafa42f47',
        }
      }).done(function(data, textStatus, xhr) {
        resolve(data);
      }).fail(function(xhr, textStatus, error) {
        console.error('Failed to readableify url', url, ':', error);
        resolve(url);
      });
    });
  };

  app.onClickOpenReadableLink = function(event) {
    event.preventDefault();
    var link = event.path.filter(e => e.tagName == 'A')[0];
    var url = link.getAttribute('href');
    var toast = document.createElement('paper-toast');
    Polymer.dom(document.body).appendChild(toast);
    toast.show({ text: 'Opening link…', duration: Infinity });
    app.readableify(url).then(function(dataOrUrl) {
      toast.toggle();
      if (typeof dataOrUrl == 'string') {
        window.location = url;
      } else {
        var data = dataOrUrl;
        console.log(data);
        var dialog = document.createElement('paper-dialog');
        dialog.withBackdrop = true;
        dialog.entryAnimation = 'scale-up-animation';
        dialog.exitAnimation = 'scale-down-animation';
        var title = document.createElement('h2');
        Polymer.dom(title).innerHTML = data.title;
        Polymer.dom(dialog).appendChild(title);
        var scrollable = document.createElement('paper-dialog-scrollable');
        Polymer.dom(scrollable).innerHTML = data.content;
        Polymer.dom(dialog).appendChild(scrollable);
        var buttons = document.createElement('div');
        Polymer.dom(buttons).classList.add('buttons');
        Polymer.dom(dialog).appendChild(buttons);
        var btnOk = document.createElement('paper-button');
        btnOk.dialogDismiss = true;
        btnOk.autofocus = true;
        Polymer.dom(btnOk).textContent = 'OK';
        Polymer.dom(buttons).appendChild(btnOk);
        //dialog.innerHTML = '<h2>' + data.title + '</h2><paper-dialog-scrollable>' + data.content + '</paper-dialog-scrollable><div class="buttons"><paper-button dialog-confirm autofocus>OK</paper-button></div>';
        Polymer.dom(document.body).appendChild(dialog);
        dialog.open();
      }
    });
  };

})(document);
