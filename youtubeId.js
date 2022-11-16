window.browser = (function () {
  return window.msBrowser ||
    window.browser ||
    window.chrome;
})();

const idRegex = /(?:https?:\/\/)?(?:(?:www\.)?(?:youtube(?:-nocookie)?|youtube.googleapis)\.com.*(?:v\/|v=|vi=|vi\/|e\/|embed\/|user\/.*\/u\/\d+\/)|youtu\.be\/)([_0-9a-z-]+)/i;

browser.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  if (msg.action == 'get_youtube_id') {
    var albumId;
    var url = window.location.href;
    var test = idRegex.exec(url);
    if(test){
      albumId = test[1];
    }
    sendResponse({
      id: albumId
    });
  }
});
