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
        chrome.storage.sync.get(
          {server_url: null, server_token: null},
          (items) => {
            url = items.server_url;
            token = items.server_token;
            if (!token) {
              url = alert('Please enter a server token in the options');
              return;
            }
            if (!url) {
              url = alert('Please enter a server URL in the options');
              return;
            }
            var context = {
              url: url + '/api/v1/input',
              method: 'POST',
              contentType: 'application/json',
              dataType: 'json',
              data: JSON.stringify({
                  userId: token,
                  field: target.id,
                  secret: null
              }),
              success: function(data, text, xhr) {
                let code = data && data.code || null;
                if (code) {
                  $(target).val(code);
                } else {
                  let secret = prompt('Enter the TOTP secret');
                  if (secret) {
                    this.data = JSON.stringify({userId: token, field: target.id, secret: secret});
                    this.success = function(data, text, xhr) {
                      if (data && data.code) {
                        $(target).val(data.code);
                      }
                    };
                    $.ajax(this);
                  }
                }
              },
              error: function(error) {
                alert('The request caused an error');
                console.log('async error:\n' + error.responseText);
              }
            };
            $.ajax(context);
          }
        )
      }
    )
  }
);
