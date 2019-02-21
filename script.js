var options = {}

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
      buttonActions('https://song.link/'+encodeURI(shareurl));
    }
  });
}

// Spotify
var getSpotifyURL = function(tabs){
  var url = tabs[0].url;
  var re = /\/album\/([a-zA-Z0-9]+)/g;
  var match = re.exec(url);
  var id = match[1];
  var shareurl = "https://open.spotify.com/album/"+id;
  buttonActions('https://song.link/'+encodeURI(shareurl));
}

// Apple Music
var getAppleMusicURL = function(tabs){
  var url = tabs[0].url;
  var re = /\/album\/\S+\/([a-zA-Z0-9]+)/g;
  var match = re.exec(url);
  var id = match[1];
  var shareurl = "https://itunes.apple.com/album/"+id;
  buttonActions('https://song.link/'+encodeURI(shareurl));
}

// Deezer
var getDeezerURL = function(tabs){
  var url = tabs[0].url;
  var re = /\/album\/([a-zA-Z0-9]+)/g;
  var match = re.exec(url);
  var id = match[1];
  var shareurl = "https://www.deezer.com/en/album/"+id;
  buttonActions('https://song.link/'+encodeURI(shareurl));
}

// Use full URL
var getCurrentUrl = function(tabs){
  var url = tabs[0].url;
  buttonActions('https://song.link/'+encodeURI(url));
}

chrome.browserAction.onClicked.addListener(function(tab){
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
