<?php
/**
 * @file
 * Contains the base row style plugin.
 */

/**
 * The basic 'fields' row plugin
 *
 * This displays fields one after another, giving options for inline
 * or not.
 *
 * @ingroup views_row_plugins
 */
class views_nivo_slider_plugin_row_nivo_sliderfields extends views_plugin_row {
  function option_definition() {
    $options = parent::option_definition();
    $options['image_field'] = array('default' => '');
    $options['title_field'] = array('default' => '');
    $options['link_field'] = array('default' => '');
    return $options;
  }
  
  function options_form(&$form, &$form_state) {
    parent::options_form($form, $form_state);
  
    // Pre-build all of our option lists for the dials and switches that follow.
    $fields = array('' => t('<None>'));
    foreach ($this->display->handler->get_handlers('field') as $field => $handler) {
      if ($label = $handler->label()) {
        $fields[$field] = $label;
      }
      else {
        $fields[$field] = $handler->ui_name();
      }
    }
   
    $form['image_field'] = array(
      '#type' => 'select',
      '#title' => t('Image field'),
      '#options' => $fields,
      '#default_value' => $this->options['image_field'],
      '#description' => t('Select the field that will be used as the image field.'),
    );

    $form['title_field'] = array(
      '#type' => 'select',
      '#title' => t('Title field'),
      '#options' => $fields,
      '#default_value' => $this->options['title_field'],
      '#description' => t('Select the field that will be used as the title field, if one is required.'),
    );
 
    $form['link_field'] = array(
      '#type' => 'select',
      '#title' => t('Link field'),
      '#options' => $fields,
      '#default_value' => $this->options['link_field'],
      '#description' => t('Select the field that will be used as the link field, if one is required.'),
    );
  }
}
