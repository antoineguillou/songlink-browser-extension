var supportedDomains = [
  'song.link/',
  'itunes.apple.com/',
  'itun.es/',
  'open.spotify.com/track/',
  'open.spotify.com/album/',
  'play.spotify.com/track/',
  'play.spotify.com/album/',

  // no trailing slash here bc most YouTube URLs are of format
  // youtube.com/watch?v=a1b2c3d4
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

var updateTabIcon = function() {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tabs) {
    var url = tabs[0].url;
    chrome.pageAction.hide(tabs[0].id);
    if (isSupportedUrl(url)) {
      chrome.pageAction.show(tabs[0].id);
    }
  });
};

var copyToClipboard = function(text) {
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
};

var doActions = function(url) {
  chrome.storage.sync.get(
    {
      copyToClipboard: true,
      openNewTab: true
    },
    function(items) {
      if (items.copyToClipboard) {
        copyToClipboard(url);
      }
      if (items.openNewTab) {
        chrome.tabs.create({ url: url });
      }
    }
  );
};

var prependUrl = 'https://song.link/';

var getSonglinkUrl = function(url) {
  return prependUrl + encodeURI(url);
};

// Update Icon if URL is valid
chrome.tabs.onActivated.addListener(function(tab) {
  updateTabIcon();
});

chrome.tabs.onUpdated.addListener(function(tab) {
  updateTabIcon();
});

// Click action
chrome.pageAction.onClicked.addListener(function(tab) {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tabs) {
    var tab = tabs[0];
    var url = tab.url;

    if (url.indexOf('play.google.com/music') > -1) {
      return chrome.tabs.sendMessage(
        tab.id,
        { action: 'get_googlemusic_id' },
        function(response) {
          var id = response.id;
          if (id !== null) {
            var gpmUrl = 'https://play.google.com/music/m/' + id;
            var songlinkUrl = getSonglinkUrl(gpmUrl);
            return doActions(songlinkUrl);
          }
        }
      );
    }

    if (isSupportedUrl(url)) {
      var songlinkUrl = getSonglinkUrl(url);
      return doActions(songlinkUrl);
    }
  });
});
