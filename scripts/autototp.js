const $ = jQuery;
$(document).ready(
  function() {
    $('input').on(
      'keypress',
      function(event) {
        let url;
        let token;
        if (event.which != 14 /* Ctrl+. */) {
          return true;
        }
        let target = event.target;
        chrome.storage.local.get('autototp_token').then((result) => {
          console.log('Read token = ' + JSON.stringify(result))
          token = result.autototp_token;
          chrome.storage.local.get('autototp_url').then((result) => {
            console.log('Read url = ' + JSON.stringify(result));
            url = result.autototp_url
            if (!url) {
              url = prompt('Enter the server URL');
              if (!url) {
                console.log('No URL entered. Cancelled.');
                return;
              }
              chrome.storage.local.set({'autototp_url': url}).then(() => {
                console.log('Stored url ' + url);
              });
            }
            var context = {
              url: url + '/input',
              method: 'POST',
              contentType: 'application/json',
              dataType: 'json',
              data: JSON.stringify({
                  token: token,
                  field: target.id,
                  secret: null
              }),
              success: function(data, text, xhr) {
                if (data.token) {
                  console.log('Got token ' + data.token);
                  chrome.storage.local.set({'autototp_token': data.token}).then(() => {
                    console.log('Stored token ' + data.token);
                  });
                  token = data.token;
                }
                let code = data && data.code || null;
                if (code) {
                  $(target).val(code);
                } else {
                  let secret = prompt('Enter the TOTP secret');
                  if (secret) {
                    console.log('Submit token=' + token);
                    this.data = JSON.stringify({token: token, field: target.id, secret: secret});
                    this.success = function(data, text, xhr) {
                      if (data && data.code) {
                        console.log('target=' + target.id + ': ' + target.val);
                        $(target).val(data.code);
                      }
                    };
                    console.log('this=' + JSON.stringify(this));
                    $.ajax(this);
                  }
                }
              },
              error: function(error) {
                console.log('async error: ' + JSON.stringify(error));
              }
            };
            $.ajax(context);
          })
        })
      }
    )
  }
);
