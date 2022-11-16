window.browser = (function () {
  return window.msBrowser ||
    window.browser ||
    window.chrome;
})();

var prependUrl = 'https://song.link/';

var supportedDomains = [
  'song.link',
  'itunes.apple.com',
  'music.apple.com',
  'itun.es',
  'open.spotify.com/track',
  'open.spotify.com/album',
  'play.spotify.com/track',
  'play.spotify.com/album',
  'youtube.com/watch',
  'youtube.com/playlist',
  'youtube.com/embed',
  'youtu.be',
  'music.youtube.com',
  'deezer.com',
  'tidal.com/track',
  'tidal.com/browse/track',
  'tidal.com/album',
  'tidal.com/browse/album',
  'napster.com',
  'soundcloud.com',
  'music.amazon.com/albums',
  'amazon.com',
  'music.yandex.com',
  'music.yandex.ru',
  'spinrilla.com/mixtapes',
  'spinrilla.com/songs',
  'pandora.com'
];

var isSupportedUrl = function(url) {
  return supportedDomains.find(function(supportedDomains) {
    return url.indexOf(supportedDomains) > -1;
  });
};

var getSonglinkUrl = function(url) {
  return prependUrl + encodeURI(url);
};

var navigationActions = function(tab, changeInfo){
  if(changeInfo.url){
    browser.contextMenus.removeAll();
    browser.pageAction.hide(tab);

    if(isSupportedUrl(changeInfo.url)){
      browser.pageAction.show(tab);
      browser.contextMenus.create({
        id: "get-songlink",
        title: "Songlink",
        contexts: ["page", "link"]
      });
    }
  }
}

var copyToClipboard = function(text, tab) {
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
  browser.tabs.sendMessage(tab.id, {action: "message", message: "Songlink copied to clipboard"});
};

var checkUrlType = function(url, tab){
  if (url.indexOf('youtube.com') > -1 || url.indexOf('youtu.be') > -1) {
    return browser.tabs.sendMessage(
      tab.id,
      { action: 'get_youtube_id' },
      function(response) {
        if (response.id) {
          var id = response.id;
          var ytUrl = 'https://youtube.com/watch?v=' + id;
          var songlinkUrl = getSonglinkUrl(ytUrl);
          return doActions(songlinkUrl, tab);
        } else {
          var songlinkUrl = getSonglinkUrl(url);
          return doActions(songlinkUrl, tab);
        }
      }
    );
  } else if (isSupportedUrl(url)) {
    var songlinkUrl = getSonglinkUrl(url);
    return doActions(songlinkUrl, tab);
  } else {
    browser.tabs.sendMessage(tab.id, {action: "message", message: "Not a valid Songlink URL"});
  }
}

var doActions = function(url, tab) {
  browser.storage.sync.get(
    {
      copyToClipboard: true,
      openNewTab: true
    },
    function(items) {
      if (items.copyToClipboard) {
        copyToClipboard(url, tab);
      }
      if (items.openNewTab) {
        browser.tabs.create({ url: url });
      }
    }
  );
};

// Tab update
browser.tabs.onUpdated.addListener(navigationActions);

// Click action
browser.pageAction.onClicked.addListener(function(tab) {
    var url = tab.url;
    checkUrlType(url, tab);
});

// Context menu action
browser.contextMenus.onClicked.addListener(function(e,tab){
  if (e.menuItemId == "get-songlink") {
    if(e.linkUrl){
      checkUrlType(e.linkUrl, tab);
    } else if(e.pageUrl){
      checkUrlType(e.pageUrl, tab);
    }
  }
});
