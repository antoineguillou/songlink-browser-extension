var createMessage = function(text){
  var el = document.createElement('div');
  var textnode = document.createTextNode(text);
  el.appendChild(textnode);
  el.id = "songlink_message";

  Object.assign(el.style,{
    backgroundColor: '#fff',
    border: '1px solid #DAD9DA',
    boxShadow: '0 1px 2px 0 rgba(0,0,0,.05)',
    color: '#3D4043',
    font: '400 14px/18px Helvetica, Arial, serif',
    padding: '10px 15px',
    opacity: '0',
    position: 'fixed',
    right: '10px',
    top: '10px',
    transition: 'opacity .3s ease',
    zIndex: '9999'
  });

  document.body.appendChild(el);
  setTimeout(function(){
    el.style.opacity = '1';
  }, 100);
  setTimeout(function(){
    el.style.opacity = '0';
    setTimeout(function(){
      document.body.removeChild(el);
    }, 350);
  }, 2000);
}
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  if (msg.action == 'message') {
    createMessage(msg.message);
    sendResponse();
  }
});
