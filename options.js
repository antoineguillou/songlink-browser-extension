function save_options() {
  var copyToClipboard = document.getElementById('copyToClipboard').checked;
  var openNewTab = document.getElementById('openNewTab').checked;
  chrome.storage.sync.set({
    copyToClipboard: copyToClipboard,
    openNewTab: openNewTab
  }, function() {
    var status = document.getElementById('status');
    status.textContent = 'Saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

function restore_options() {
  chrome.storage.sync.get({
    copyToClipboard: true,
    openNewTab: true
  }, function(items) {
    document.getElementById('copyToClipboard').checked = items.copyToClipboard;
    document.getElementById('openNewTab').checked = items.openNewTab;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('copyToClipboard').addEventListener('change', save_options);
document.getElementById('openNewTab').addEventListener('change', save_options);
