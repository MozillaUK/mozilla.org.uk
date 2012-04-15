(function ($) {

Drupal.behaviors.browserid = {
  performLogin: function(context) {
    navigator.id.getVerifiedEmail(function(assertion) {
      if (assertion) {
        $.post(Drupal.settings.basePath +'index.php?q=browserid/verify', {
          'assertion': assertion,
          'audience': window.location.host
        }, function (data) {
          if (data.reload) {
            window.location.reload();
          }
          else if (data.destination) {
            window.location.href = data.destination;
          }
          else {
            alert(Drupal.t('An unknown error occurred while attempting to validate your BrowserID login. After clicking "OK," you will be redirected to a page where you can log in without BrowserID or try logging in with BrowserID again.'));
            window.location.href = Drupal.settings.basePath + 'index.php?q=user/login';
          }
        });
      }
    });
  },
  attach: function (context) {
    $(context).find('.browserid-button').show();
    $(context).find('.browserid-button').click(Drupal.behaviors.browserid.performLogin);

    if (navigator.id) {
      if (Drupal.settings.browserid) {
        navigator.id.sessions = [{ email: Drupal.settings.browserid.email }];
      }
      else {
        navigator.id.sessions = [];
      }

      document.addEventListener('login', function(e) {
        Drupal.behaviors.browserid.performLogin();
      }, false);
      document.addEventListener('logout', function(e) {
        window.location.href = Drupal.settings.basePath + 'index.php?q=user/logout';
      }, false);
    }
  }
}

})(jQuery);
;
