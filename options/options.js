// Saves options to chrome.storage
const saveOptions = () => {
  console.log('saveOptions()');
  const server_url = document.getElementById('server_url').value;
  const server_token = document.getElementById('server_token').value;
  chrome.storage.sync.set(
    { server_url: server_url, server_token: server_token},
    () => {
      // Update status
      const status = document.getElementById('status');
      status.textContent = 'Options saved';
      setTimeout(() => {
        status.textContent = '';
      }, 750);
    }
  );
};

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
const restoreOptions = () => {
  chrome.storage.sync.get(
    {server_url: 'https://', server_token: ''},
    (items) => {
      console.log('restoreOptions()');
      document.getElementById('server_url').value = items.server_url;
      document.getElementById('server_token').value = items.server_token;
    }
  );
};

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save_button').addEventListener('click', saveOptions);
console.log('options.js loaded');
