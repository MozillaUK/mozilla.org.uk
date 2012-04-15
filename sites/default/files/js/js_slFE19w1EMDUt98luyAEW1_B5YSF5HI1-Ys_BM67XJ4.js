(function ($) {

Drupal.behaviors.browserid = {
  attach: function (context) {
    $(context).find('.browserid-button').show();
    $(context).find('.browserid-button').click(function() {
      navigator.id.getVerifiedEmail(function(assertion) {
        if (assertion) {
          $.post(Drupal.settings.basePath +'index.php?q=browserid/verify&assertion=' + assertion + '&audience=' + window.location.host, function (data) {
            if (data.reload) {
              window.location.reload();
            }
            else if (data.destination) {
              window.location.href = data.destination;
            }
            else {
              alert(Drupal.t('An unknown error occurred while attempting to validate your BrowserID login.'));
            }
          });
        }
      });
    });
  }
}

})(jQuery);
;
