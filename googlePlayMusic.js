window.browser = (function () {
  return window.msBrowser ||
    window.browser ||
    window.chrome;
})();

browser.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  if (msg.action == 'get_googlemusic_id') {
    var row = document.querySelector('.song-row td[data-col="album"]');
    var albumId = null;

    if(row){
      if(row.getAttribute('data-matched-id')){
        albumId = row.getAttribute('data-matched-id');
      }
    }
    sendResponse({
      id: albumId
    });
  }
});
