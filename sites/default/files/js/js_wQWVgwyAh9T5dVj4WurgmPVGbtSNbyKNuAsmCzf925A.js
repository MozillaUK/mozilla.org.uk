
Drupal.behaviors.feeds = function() {

  // Export form machine-readable JS
  $('.feed-name:not(.processed)').each(function() {
    $('.feed-name')
      .addClass('processed')
      .after(' <small class="feed-id-suffix">&nbsp;</small>');
    if ($('.feed-id').val() === $('.feed-name').val().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/_+/g, '_') || $('.feed-id').val() === '') {
      $('.feed-id').parents('.form-item').hide();
      $('.feed-name').keyup(function() {
        var machine = $(this).val().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/_+/g, '_');
        if (machine !== '_' && machine !== '') {
          $('.feed-id').val(machine);
          $('.feed-id-suffix').empty().append(' Machine name: ' + machine + ' [').append($('<a href="#">'+ Drupal.t('Edit') +'</a>').click(function() {
            $('.feed-id').parents('.form-item').show();
            $('.feed-id-suffix').hide();
            $('.feed-name').unbind('keyup');
            return false;
          })).append(']');
        }
        else {
          $('.feed-id').val(machine);
          $('.feed-id-suffix').text('');
        }
      });
      $('.feed-name').keyup();
    }
  });

  // Hide text in specific input fields.
  $('.hide-text-on-focus').focus(function() {
    $(this).val('');
  });


  // Hide submit buttons of .feeds-ui-hidden-submit class.
  $('input.form-submit.feeds-ui-hidden-submit').hide();

  /**
   * Tune checkboxes on mapping forms.
   * @see feeds_ui_mapping_form() in feeds_ui.admin.inc
   */

  // Attach submit behavior to elements with feeds-ui-trigger-submit class.
  $('.feeds-ui-trigger-submit').click(function() {
    // Use click, not form.submit() - submit() would use the wrong submission
    // handler.
    $('input.form-submit.feeds-ui-hidden-submit').click();
  });

  // Replace checkbox with .feeds-ui-checkbox-link class with a link.
  $('.feeds-ui-checkbox-link:not(.processed)').each(function(i) {
    $(this).addClass('processed').after(
      '<a href="#" onclick="return false;" class="feeds-ui-trigger-remove">' + $('label', this).text() + '</a>'
    ).hide();
  });

  // Check the box and then submit.
  $('.feeds-ui-trigger-remove').click(function() {
    // Use click, not form.submit() - submit() would use the wrong submission
    // handler.
    $(this).prev().children().children().children().attr('checked', 1);
    $('input.form-submit.feeds-ui-hidden-submit').click();
  });

  // Replace radio with .feeds-ui-radio-link class with a link.
  $('.feeds-ui-radio-link:not(.processed)').parent().each(function(i) {
    checked = '';
    if ($(this).children('input').attr('checked')) {
      checked = ' checked';
    }
    $(this).addClass('processed').after(
      '<a href="#" onclick="return false;" class="feeds-ui-check-submit' + checked + '" id="' + $(this).children('input').attr('id') + '">' + $(this).parent().text() + '</a>'
    );
    $(this).hide();
  });

  // Hide the the radio that is selected.
  $('.feeds-ui-check-submit.checked').parent().hide();

  // Check the radio and then submit.
  $('.feeds-ui-check-submit').click(function() {
    // Use click, not form.submit() - submit() would use the wrong submission
    // handler.
    $('#' + $(this).attr('id')).attr('checked', 1);
    $('input.form-submit.feeds-ui-hidden-submit').click();
  });
};
;
(function ($) {

/**
 * Attaches sticky table headers.
 */
Drupal.behaviors.tableHeader = {
  attach: function (context, settings) {
    if (!$.support.positionFixed) {
      return;
    }

    $('table.sticky-enabled', context).once('tableheader', function () {
      $(this).data("drupal-tableheader", new Drupal.tableHeader(this));
    });
  }
};

/**
 * Constructor for the tableHeader object. Provides sticky table headers.
 *
 * @param table
 *   DOM object for the table to add a sticky header to.
 */
Drupal.tableHeader = function (table) {
  var self = this;

  this.originalTable = $(table);
  this.originalHeader = $(table).children('thead');
  this.originalHeaderCells = this.originalHeader.find('> tr > th');

  // Clone the table header so it inherits original jQuery properties. Hide
  // the table to avoid a flash of the header clone upon page load.
  this.stickyTable = $('<table class="sticky-header"/>')
    .insertBefore(this.originalTable)
    .css({ position: 'fixed', top: '0px' });
  this.stickyHeader = this.originalHeader.clone(true)
    .hide()
    .appendTo(this.stickyTable);
  this.stickyHeaderCells = this.stickyHeader.find('> tr > th');

  this.originalTable.addClass('sticky-table');
  $(window)
    .bind('scroll.drupal-tableheader', $.proxy(this, 'eventhandlerRecalculateStickyHeader'))
    .bind('resize.drupal-tableheader', { calculateWidth: true }, $.proxy(this, 'eventhandlerRecalculateStickyHeader'))
    // Make sure the anchor being scrolled into view is not hidden beneath the
    // sticky table header. Adjust the scrollTop if it does.
    .bind('drupalDisplaceAnchor.drupal-tableheader', function () {
      window.scrollBy(0, -self.stickyTable.outerHeight());
    })
    // Make sure the element being focused is not hidden beneath the sticky
    // table header. Adjust the scrollTop if it does.
    .bind('drupalDisplaceFocus.drupal-tableheader', function (event) {
      if (self.stickyVisible && event.clientY < (self.stickyOffsetTop + self.stickyTable.outerHeight()) && event.$target.closest('sticky-header').length === 0) {
        window.scrollBy(0, -self.stickyTable.outerHeight());
      }
    })
    .triggerHandler('resize.drupal-tableheader');

  // We hid the header to avoid it showing up erroneously on page load;
  // we need to unhide it now so that it will show up when expected.
  this.stickyHeader.show();
};

/**
 * Event handler: recalculates position of the sticky table header.
 *
 * @param event
 *   Event being triggered.
 */
Drupal.tableHeader.prototype.eventhandlerRecalculateStickyHeader = function (event) {
  var self = this;
  var calculateWidth = event.data && event.data.calculateWidth;

  // Reset top position of sticky table headers to the current top offset.
  this.stickyOffsetTop = Drupal.settings.tableHeaderOffset ? eval(Drupal.settings.tableHeaderOffset + '()') : 0;
  this.stickyTable.css('top', this.stickyOffsetTop + 'px');

  // Save positioning data.
  var viewHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
  if (calculateWidth || this.viewHeight !== viewHeight) {
    this.viewHeight = viewHeight;
    this.vPosition = this.originalTable.offset().top - 4 - this.stickyOffsetTop;
    this.hPosition = this.originalTable.offset().left;
    this.vLength = this.originalTable[0].clientHeight - 100;
    calculateWidth = true;
  }

  // Track horizontal positioning relative to the viewport and set visibility.
  var hScroll = document.documentElement.scrollLeft || document.body.scrollLeft;
  var vOffset = (document.documentElement.scrollTop || document.body.scrollTop) - this.vPosition;
  this.stickyVisible = vOffset > 0 && vOffset < this.vLength;
  this.stickyTable.css({ left: (-hScroll + this.hPosition) + 'px', visibility: this.stickyVisible ? 'visible' : 'hidden' });

  // Only perform expensive calculations if the sticky header is actually
  // visible or when forced.
  if (this.stickyVisible && (calculateWidth || !this.widthCalculated)) {
    this.widthCalculated = true;
    // Resize header and its cell widths.
    this.stickyHeaderCells.each(function (index) {
      var cellWidth = self.originalHeaderCells.eq(index).css('width');
      // Exception for IE7.
      if (cellWidth == 'auto') {
        cellWidth = self.originalHeaderCells.get(index).clientWidth + 'px';
      }
      $(this).css('width', cellWidth);
    });
    this.stickyTable.css('width', this.originalTable.css('width'));
  }
};

})(jQuery);
;
