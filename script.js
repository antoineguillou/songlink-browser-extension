var validUrls = [
  'play.google.com/music',
  'open.spotify.com',
  'itunes.apple.com',
  'deezer.com',
  'listen.tidal.com',
  'soundcloud.com',
  'pandora.com/artist/',
  'music.yandex.com',
  'youtube.com/watch'
];
var prependUrl = 'https://song.link/';

var updateTabIcon= function(){
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    var url = tabs[0].url;
    chrome.pageAction.hide(tabs[0].id);
    validUrls.forEach(function(e){
      if(url.indexOf(e) > -1){
        chrome.pageAction.show(tabs[0].id);
      }
    });
  });
}

var copyToClipboard = function(text) {
  var selected = false;
  var el = document.createElement('textarea');
  el.value = text;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9000em';
  document.body.appendChild(el);
  if (document.getSelection().rangeCount > 0) {
    selected = document.getSelection().getRangeAt(0)
  }
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  if (selected) {
    document.getSelection().removeAllRanges();
    document.getSelection().addRange(selected);
  }
};

var buttonActions = function(url){
  chrome.storage.sync.get({
    copyToClipboard: true,
    openNewTab: true
  }, function(items) {
    if(items.copyToClipboard){ copyToClipboard(url); }
    if(items.openNewTab){ chrome.tabs.create({ url: url }); }
  });

}

// Google play Music
var getGPMURL = function(tabs){
  chrome.tabs.sendMessage(tabs[0].id, {action: "get_googlemusic_id"}, function(response){
    var id = response.id;
    if(id !== null){
      var shareurl = "https://play.google.com/music/m/"+id;
      buttonActions(prependUrl+encodeURI(shareurl));
    }
  });
}

// Spotify
var getSpotifyURL = function(tabs){
  var url = tabs[0].url;
  var re = /\/album\/([a-zA-Z0-9]+)/g;
  var match = re.exec(url);
  if(match){
    var id = match[1];
    var shareurl = "https://open.spotify.com/album/"+id;
    buttonActions(prependUrl+encodeURI(shareurl));
  }
}

// Apple Music
var getAppleMusicURL = function(tabs){
  var url = tabs[0].url;
  var re = /\/album\/\S+\/([a-zA-Z0-9]+)/g;
  var match = re.exec(url);
  if(match){
    var id = match[1];
    var shareurl = "https://itunes.apple.com/album/"+id;
    buttonActions(prependUrl+encodeURI(shareurl));
  }
}

// Deezer
var getDeezerURL = function(tabs){
  var url = tabs[0].url;
  var re = /\/album\/([a-zA-Z0-9]+)/g;
  var match = re.exec(url);
  if(match){
    var id = match[1];
    var shareurl = "https://www.deezer.com/en/album/"+id;
    buttonActions(prependUrl+encodeURI(shareurl));
  }
}

// Use full URL
var getCurrentUrl = function(tabs){
  var url = tabs[0].url;
  buttonActions(prependUrl+encodeURI(url));
}

// Update Icon if URL is valid
chrome.tabs.onActivated.addListener(function(tab){
  updateTabIcon();
});

chrome.tabs.onUpdated.addListener(function(tab){
  updateTabIcon();
});

// Click action
chrome.pageAction.onClicked.addListener(function(tab){
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    var url = tabs[0].url;

    if(url.indexOf('play.google.com/music') > -1){
      getGPMURL(tabs);
    } else if(url.indexOf('open.spotify.com') > -1){
      getSpotifyURL(tabs);
    } else if(url.indexOf('itunes.apple.com') > -1){
      getAppleMusicURL(tabs);
    } else if(url.indexOf('deezer.com') > -1){
      getDeezerURL(tabs);
    } else if(url.indexOf('listen.tidal.com/album') > -1 || url.indexOf('listen.tidal.com/track') > -1){
      getCurrentUrl(tabs);
    } else if(url.indexOf('soundcloud.com') > -1){
      getCurrentUrl(tabs);
    } else if(url.indexOf('pandora.com/artist/') > -1){
      getCurrentUrl(tabs);
    } else if(url.indexOf('music.yandex.com/album/') > -1 || url.indexOf('music.yandex.ru/album/') > -1){
      getCurrentUrl(tabs);
    } else if(url.indexOf('youtube.com/watch') > -1){
      getCurrentUrl(tabs);
    }
  });
});
