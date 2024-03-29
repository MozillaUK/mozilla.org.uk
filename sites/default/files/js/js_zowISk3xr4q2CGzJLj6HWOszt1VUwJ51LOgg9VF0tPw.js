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
(function ($) {

Drupal.behaviors.textarea = {
  attach: function (context, settings) {
    $('.form-textarea-wrapper.resizable', context).once('textarea', function () {
      var staticOffset = null;
      var textarea = $(this).addClass('resizable-textarea').find('textarea');
      var grippie = $('<div class="grippie"></div>').mousedown(startDrag);

      grippie.insertAfter(textarea);

      function startDrag(e) {
        staticOffset = textarea.height() - e.pageY;
        textarea.css('opacity', 0.25);
        $(document).mousemove(performDrag).mouseup(endDrag);
        return false;
      }

      function performDrag(e) {
        textarea.height(Math.max(32, staticOffset + e.pageY) + 'px');
        return false;
      }

      function endDrag(e) {
        $(document).unbind('mousemove', performDrag).unbind('mouseup', endDrag);
        textarea.css('opacity', 1);
      }
    });
  }
};

})(jQuery);
;
(function ($) {

/**
 * Automatically display the guidelines of the selected text format.
 */
Drupal.behaviors.filterGuidelines = {
  attach: function (context) {
    $('.filter-guidelines', context).once('filter-guidelines')
      .find(':header').hide()
      .parents('.filter-wrapper').find('select.filter-list')
      .bind('change', function () {
        $(this).parents('.filter-wrapper')
          .find('.filter-guidelines-item').hide()
          .siblings('.filter-guidelines-' + this.value).show();
      })
      .change();
  }
};

})(jQuery);
;
