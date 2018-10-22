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

    if(tabs[0].url.indexOf('play.google.com/music') > -1){
      var re = /\/album\/(\S+?)\//g;
      var match = re.exec(tabs[0].url);
      if(match){
        var id = match[1];
        var shareurl = "https://play.google.com/music/m/"+id;
        copyToClipboard('https://song.link/'+shareurl);
      }
    } else if(tabs[0].url.indexOf('open.spotify.com') > -1){
      var re = /\/album\/([a-zA-Z0-9]+)/g;
      var match = re.exec(tabs[0].url);
      var id = match[1];
      var shareurl = "https://open.spotify.com/album/"+id;
      copyToClipboard('https://song.link/'+shareurl);
    } else if(tabs[0].url.indexOf('deezer.com') > -1){
      var re = /\/album\/([a-zA-Z0-9]+)/g;
      var match = re.exec(tabs[0].url);
      var id = match[1];
      var shareurl = "https://www.deezer.com/en/album/"+id;
      copyToClipboard('https://song.link/'+shareurl);
    } else if(tabs[0].url.indexOf('itunes.apple.com') > -1){
      var re = /\/album\/\S+\/([a-zA-Z0-9]+)/g;
      var match = re.exec(tabs[0].url);
      var id = match[1];
      var shareurl = "https://itunes.apple.com/album/"+id;
      copyToClipboard('https://song.link/'+shareurl);
    } else if(tabs[0].url.indexOf('youtube.com/watch') > -1){
      copyToClipboard('https://song.link/'+tabs[0].url);
    }
  });

});
