window.browser = (function () {
  return window.msBrowser ||
    window.browser ||
    window.chrome;
})();

var supportedDomains = [
  'song.link/',
  'itunes.apple.com/',
  'itun.es/',
  'open.spotify.com/track/',
  'open.spotify.com/album/',
  'play.spotify.com/track/',
  'play.spotify.com/album/',
  'youtube.com/watch',
  'youtube.com/embed/',
  'youtu.be/',
  'music.youtube.com/',
  'deezer.com/track/',
  'deezer.com/album/',
  'tidal.com/track/',
  'tidal.com/browse/track/',
  'tidal.com/album/',
  'tidal.com/browse/album/',
  'napster.com',
  'play.google.com/music/',
  'play.google.com/store/',
  'soundcloud.com/',
  'music.amazon.com/albums/',
  'amazon.com/',
  'music.yandex.com/',
  'music.yandex.ru/',
  'spinrilla.com/mixtapes/',
  'spinrilla.com/songs/',
  'pandora.com/'
];

var isSupportedUrl = function(url) {
  return supportedDomains.find(function(supportedDomains) {
    return url.indexOf(supportedDomains) > -1;
  });
};

var updateTabIcon = function(tab) {
  browser.tabs.query({ active: true, lastFocusedWindow: true }, function(tabs) {
    if(tabs[0]){
      var url = tabs[0].url;
      var tabId = tabs[0].id
      if (isSupportedUrl(url)) {
        browser.pageAction.show(tabId);
      }
    }
  });
};

var copyToClipboard = function(text, tabs) {
  var selected = false;
  var el = document.createElement('textarea');
  el.value = text;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9000em';
  document.body.appendChild(el);
  if (document.getSelection().rangeCount > 0) {
    selected = document.getSelection().getRangeAt(0);
  }
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  if (selected) {
    document.getSelection().removeAllRanges();
    document.getSelection().addRange(selected);
  }
  browser.tabs.sendMessage(tabs[0].id, {action: "message", message: "Songlink copied to clipboard"});
};

var doActions = function(url, tabs) {
  browser.storage.sync.get(
    {
      copyToClipboard: true,
      openNewTab: true
    },
    function(items) {
      if (items.copyToClipboard) {
        copyToClipboard(url, tabs);
      }
      if (items.openNewTab) {
        browser.tabs.create({ url: url });
      }
    }
  );
};

var prependUrl = 'https://song.link/';

var getSonglinkUrl = function(url) {
  return prependUrl + encodeURI(url);
};

// Update Icon if URL is valid
browser.tabs.onUpdated.addListener(function(tab) {
  updateTabIcon(tab);
});

// Click action
browser.pageAction.onClicked.addListener(function(tab) {
  browser.tabs.query({ active: true, lastFocusedWindow: true }, function(tabs) {
    var tab = tabs[0];
    var url = tab.url;

    if (url.indexOf('play.google.com/music') > -1) {
      return browser.tabs.sendMessage(
        tab.id,
        { action: 'get_googlemusic_id' },
        function(response) {
          var id = response.id;
          if (id !== null) {
            var gpmUrl = 'https://play.google.com/music/m/' + id;
            var songlinkUrl = getSonglinkUrl(gpmUrl);
            return doActions(songlinkUrl, tabs);
          }
        }
      );
    }

    if (isSupportedUrl(url)) {
      var songlinkUrl = getSonglinkUrl(url);
      return doActions(songlinkUrl, tabs);
    }
  });
});
