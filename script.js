function copyToClipboard(text) {
    var selected = false;
    var el = document.createElement('textarea');
    el.value = text;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
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

    chrome.tabs.create({ url: text });
};

chrome.browserAction.onClicked.addListener(function(tab){
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    var url = tabs[0].url;

    if(tabs[0].url.indexOf('play.google.com/music') > -1){ // Google play Music
      // var re = /\/album\/(\S+?)\//g;
      // var match = re.exec(url);
      // if(match){
      //   var id = match[1];
      //   var shareurl = "https://play.google.com/music/m/"+id;
      //   copyToClipboard('https://song.link/'+encodeURI(shareurl));
      // }
      chrome.tabs.sendMessage(tabs[0].id, {action: "get_googlemusic_id"}, function(response){
        var id = response.id;
        var shareurl = "https://play.google.com/music/m/"+id;
        copyToClipboard('https://song.link/'+encodeURI(shareurl));
      });

    } else if(tabs[0].url.indexOf('open.spotify.com') > -1){ // Spotify
      var re = /\/album\/([a-zA-Z0-9]+)/g;
      var match = re.exec(url);
      var id = match[1];
      var shareurl = "https://open.spotify.com/album/"+id;
      copyToClipboard('https://song.link/'+encodeURI(shareurl));
    } else if(tabs[0].url.indexOf('deezer.com') > -1){ // Deezer
      var re = /\/album\/([a-zA-Z0-9]+)/g;
      var match = re.exec(url);
      var id = match[1];
      var shareurl = "https://www.deezer.com/en/album/"+id;
      copyToClipboard('https://song.link/'+encodeURI(shareurl));
    } else if(tabs[0].url.indexOf('itunes.apple.com') > -1){ // Apple Music
      var re = /\/album\/\S+\/([a-zA-Z0-9]+)/g;
      var match = re.exec(url);
      var id = match[1];
      var shareurl = "https://itunes.apple.com/album/"+id;
      copyToClipboard('https://song.link/'+encodeURI(shareurl));
    } else if(tabs[0].url.indexOf('listen.tidal.com') > -1){ // Tidal
      copyToClipboard('https://song.link/'+encodeURI(url));
    } else if(tabs[0].url.indexOf('soundcloud.com') > -1){ // Soundcloud
      copyToClipboard('https://song.link/'+encodeURI(url));
    } else if(tabs[0].url.indexOf('tidal.com') > -1){ // Tidal
      copyToClipboard('https://song.link/'+encodeURI(url));
    } else if(tabs[0].url.indexOf('pandora.com') > -1){ // Pandora
      copyToClipboard('https://song.link/'+encodeURI(url));
    } else if(tabs[0].url.indexOf('music.yandex.com') > -1){ // Yandex
      copyToClipboard('https://song.link/'+encodeURI(url));
    } else if(tabs[0].url.indexOf('youtube.com/watch') > -1){ // Youtube
      copyToClipboard('https://song.link/'+encodeURI(url));
    }
  });

});
