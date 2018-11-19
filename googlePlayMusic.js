chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  if (msg.action == 'get_googlemusic_id') {
    var albumId = document.querySelector("td[data-col=album]").getAttribute('data-matched-id');

    sendResponse({
        id: albumId
    });
  }
});
