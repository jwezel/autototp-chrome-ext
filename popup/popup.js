callBack = {
  'clearUrl': (event) => {
    chrome.storage.local.remove('autototp_url').then(() => {console.log('TOTP server URL removed')});
  },
  'clearToken': (event) => {
    chrome.storage.local.remove('autototp_token').then(() => {console.log('TOTP token removed')});
  }
}

document.addEventListener('DOMContentLoaded', () => {
  let buttons = document.querySelectorAll('button');
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', callBack[buttons[i].id]);
  }
})
