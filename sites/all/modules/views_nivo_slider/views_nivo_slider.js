(function ($) {

Drupal.behaviors.views_nivo_sliderBehavior = {
  attach: function (context) {
    $('.views-nivo-slider:not(.nivo-slider-processed)', context).each(function() {
      var id = $(this).attr('id');
      var vns = $(this);
      var cfg = Drupal.settings.views_nivo_slider[id];

      // Fix sizes
      vns.data('hmax', 0).data('wmax', 0);
      $('img', vns).each(function () {
        $(this).load(function() {
          hmax =  (vns.data('hmax') > $(this).height()) ? vns.data('hmax') : $(this).height();
          wmax =  (vns.data('wmax') > $(this).width()) ? vns.data('wmax') : $(this).width();

          vns.width(wmax).height(hmax).data('hmax', hmax).data('wmax', wmax);
        });
      });

      vns.nivoSlider(cfg);
    })
    .addClass('nivo-slider-processed');
  }
};

})(jQuery);

