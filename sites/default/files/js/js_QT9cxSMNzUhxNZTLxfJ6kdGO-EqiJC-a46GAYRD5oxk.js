
(function ($) {
Drupal.backup_migrate = {
  callbackURL : "",  
  autoAttach  : function() {
    if (Drupal.settings.backup_migrate !== undefined) {
      if ($("#edit-save-settings").length && !$("#edit-save-settings").attr("checked")) {
        // Disable input and hide its description.
        // Set display none instead of using hide(), because hide() doesn't work when parent is hidden.
        $('div.backup-migrate-save-options').css('display', 'none');
      }
  
      $("#edit-save-settings").bind("click", function() {
        if (!$("#edit-save-settings").attr("checked")) {
          $("div.backup-migrate-save-options").slideUp('slow');
        }
        else {
          // Save unchecked; enable input.
          $("div.backup-migrate-save-options").slideDown('slow');
        }
      });
  
      $('#edit-filters-exclude-tables').after('<div class="description backup-migrate-checkbox-link"><a href="javascript:Drupal.backup_migrate.selectToCheckboxes(\''+ 'exclude_tables' +'\');">'+ Drupal.settings.backup_migrate.checkboxLinkText +'</a></div>');
      $('#edit-filters-nodata-tables').after('<div class="description backup-migrate-checkbox-link"><a href="javascript:Drupal.backup_migrate.selectToCheckboxes(\''+ 'nodata_tables' +'\');">'+ Drupal.settings.backup_migrate.checkboxLinkText +'</a></div>');
    }
  },

  processCheckboxes : function(ctxt) {
    $("input.backup-migrate-tables-checkbox", ctxt).each(function() {
      this.do_click = function() {
        if (this.checked) {
          $(this).parent().addClass('checked');
        }
        else {
          $(this).parent().removeClass('checked');
        }
      };
      $(this).bind("click", function() { this.do_click() });
      this.do_click();
    });
  },

  selectToCheckboxes : function(field) {
    var field_id = 'edit-filters-'+ field.replace('_', '-') ;
    var $select = $('#'+ field_id);
    var $checkboxes = $('<div></div>').addClass('backup-migrate-tables-checkboxes');
    $('option', $select).each(function(i) {
      $checkboxes.append('<div class="form-item"><label class="option backup-migrate-table-select"><input type="checkbox" class="backup-migrate-tables-checkbox" id="edit-'+ field_id +'-'+ this.value +'" name="'+ $select.attr('name') +'"'+ (this.selected ? 'checked="checked"' : '') +' value="'+ this.value +'"/>'+this.value+'</label></div>');
    });
    $select.parent().find('.backup-migrate-checkbox-link').remove();
    $select.before($checkboxes);
    $select.hide();
    Drupal.backup_migrate.processCheckboxes($checkboxes);
  }
}

$(document).ready(Drupal.backup_migrate.autoAttach);
})(jQuery);
;
(function ($) {

Drupal.toolbar = Drupal.toolbar || {};

/**
 * Attach toggling behavior and notify the overlay of the toolbar.
 */
Drupal.behaviors.toolbar = {
  attach: function(context) {

    // Set the initial state of the toolbar.
    $('#toolbar', context).once('toolbar', Drupal.toolbar.init);

    // Toggling toolbar drawer.
    $('#toolbar a.toggle', context).once('toolbar-toggle').click(function(e) {
      Drupal.toolbar.toggle();
      // Allow resize event handlers to recalculate sizes/positions.
      $(window).triggerHandler('resize');
      return false;
    });
  }
};

/**
 * Retrieve last saved cookie settings and set up the initial toolbar state.
 */
Drupal.toolbar.init = function() {
  // Retrieve the collapsed status from a stored cookie.
  var collapsed = $.cookie('Drupal.toolbar.collapsed');

  // Expand or collapse the toolbar based on the cookie value.
  if (collapsed == 1) {
    Drupal.toolbar.collapse();
  }
  else {
    Drupal.toolbar.expand();
  }
};

/**
 * Collapse the toolbar.
 */
Drupal.toolbar.collapse = function() {
  var toggle_text = Drupal.t('Show shortcuts');
  $('#toolbar div.toolbar-drawer').addClass('collapsed');
  $('#toolbar a.toggle')
    .removeClass('toggle-active')
    .attr('title',  toggle_text)
    .html(toggle_text);
  $('body').removeClass('toolbar-drawer').css('paddingTop', Drupal.toolbar.height());
  $.cookie(
    'Drupal.toolbar.collapsed',
    1,
    {
      path: Drupal.settings.basePath,
      // The cookie should "never" expire.
      expires: 36500
    }
  );
};

/**
 * Expand the toolbar.
 */
Drupal.toolbar.expand = function() {
  var toggle_text = Drupal.t('Hide shortcuts');
  $('#toolbar div.toolbar-drawer').removeClass('collapsed');
  $('#toolbar a.toggle')
    .addClass('toggle-active')
    .attr('title',  toggle_text)
    .html(toggle_text);
  $('body').addClass('toolbar-drawer').css('paddingTop', Drupal.toolbar.height());
  $.cookie(
    'Drupal.toolbar.collapsed',
    0,
    {
      path: Drupal.settings.basePath,
      // The cookie should "never" expire.
      expires: 36500
    }
  );
};

/**
 * Toggle the toolbar.
 */
Drupal.toolbar.toggle = function() {
  if ($('#toolbar div.toolbar-drawer').hasClass('collapsed')) {
    Drupal.toolbar.expand();
  }
  else {
    Drupal.toolbar.collapse();
  }
};

Drupal.toolbar.height = function() {
  var height = $('#toolbar').outerHeight();
  // In IE, Shadow filter adds some extra height, so we need to remove it from
  // the returned height.
  if ($('#toolbar').css('filter').match(/DXImageTransform\.Microsoft\.Shadow/)) {
    height -= $('#toolbar').get(0).filters.item("DXImageTransform.Microsoft.Shadow").strength;
  }
  return height;
};

})(jQuery);
;
