<?php

/**
 *  Provide the views nivo slider plugin definition.
 */

function views_nivo_slider_views_plugins() {
  return array(
    'module' => 'views_nivo_slider',
    'style' => array(
      'views_nivo_slider' => array(
        'title' => t('Views Nivo Slider'),
        'theme' => 'views_nivo_slider_view',
        'help' => t('Display a view with Nivo Slider.'),
        'handler' => 'views_nivo_slider_style_plugin',
        'uses row plugin' => TRUE,
        'uses options' => TRUE,
        'type' => 'normal',
      ),
    ),
    'row' => array(
      'nivo_sliderfields' => array(
        'title' => t('Views Nivo Slider'),
        'help' => t('Choose the fields to display in Nivo Slider Style.'),
        'handler' => 'views_nivo_slider_plugin_row_nivo_sliderfields',
        'theme' => 'views_nivo_slider_view_nivo_sliderfields',
        'uses fields' => TRUE,
        'uses options' => TRUE,
        'type' => 'normal',
      ),
    ),
  );
}
