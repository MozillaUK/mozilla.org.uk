<?php
/**
 * @file
 *  Provide the views nivo slider plugin object with default options and form.
 */

/**
  * Implementation of views_plugin_style().
  */

class views_nivo_slider_style_plugin extends views_plugin_style {

  function option_definition() {
    $options = parent::option_definition();
    unset($options['grouping']);

    $options['imagefield_preset']     = array('default' => '');
    $options['style']                 = array('default'=> 'default');
    $options['effect']                = array('default'=> 'random');
    $options['slices']                = array('default'=> '15');
    $options['animSpeed']             = array('default'=> '500');
    $options['pauseTime']             = array('default'=> '3000');
    $options['directionNav']          = array('default'=> 'true');
    $options['directionNavHide']      = array('default'=> 'true');
    $options['controlNav']            = array('default'=> 'disabled');
    $options['controlNavThumbsField'] = array('default'=> '');
    $options['controlNavThumbsIC']    = array('default'=> '');
    $options['keyboardNav']           = array('default'=> 'true');
    $options['pauseOnHover']          = array('default'=> 'true');
    $options['manualAdvance']         = array('default'=> 'false');
    $options['captionOpacity']        = array('default'=> '0.8');

    return $options;
  }

  function options_form(&$form, &$form_state) {
    parent::options_form($form, $form_state);
    unset($form['grouping']);

    $presets = array();
    foreach (image_styles() as $p) {
      $presets[$p['name']] = $p['name'];
    }
    
    $form['imagefield_preset'] = array(
      '#type' => 'select',
      '#title' => t('Image field style'),
      '#options' => $presets,
      '#default_value' => $this->options['imagefield_preset'],
      '#description' => t('Select the image style to apply on image field.'),
    );

    $form['style'] = array(
      '#type' => 'select',
      '#title' => t('Style'),
      '#default_value' => $this->options['style'],
      '#options' => $this->get_style_options(),
    );

    $form['effect'] = array(
      '#type' => 'select',
      '#title' => t('Effect'),
      '#default_value' => $this->options['effect'],
      '#options' => $this->get_effect_options(),
      '#multiple' => TRUE,
    );

    $form['slices'] = array(
      '#type' => 'textfield',
      '#title' => t('Slices'),
      '#default_value' => $this->options['slices'],
      '#description' => '',
    );

    $form['animSpeed'] = array(
      '#type' => 'textfield',
      '#title' => t('Animation Speed'),
      '#description' => t('Animation speed in milliseconds'),
      '#default_value' => $this->options['animSpeed'],
    );

    $form['pauseTime'] = array(
      '#type' => 'textfield',
      '#title' => t('Pause Time'),
      '#description' => t('Pause time in milliseconds.'),
      '#default_value' => $this->options['pauseTime'],
    );

    $form['directionNav'] = array(
      '#type' => 'select',
      '#title' => t('Direction Navigator'),
      '#default_value' => $this->options['directionNav'],
      '#options' => array('true'=>t('Yes'), 'false' => t('No') ),
    );

    $form['directionNavHide'] = array(
      '#type' => 'select',
      '#title' => t('Direction Navigator Hide'),
      '#description' => t('Only show direction navigator on mouse over.'),
      '#default_value' => $this->options['directionNavHide'],
      '#options' => array('true'=>t('Yes'), 'false' => t('No') ),
      '#dependency' => array('edit-style-options-directionnav' => array('true')),
    );

    $form['controlNav'] = array(
      '#type' => 'select',
      '#title' => t('Control Navigator'),
      '#default_value' => $this->options['controlNav'],
      '#options' => array(
        'disabled' => t('Disabled'),
        'basic' => t('Basic'),
        'thumbsIC' => t('Thumbnails with Image styles'),
        'thumbsField' => t('Thumbnails with Views Field'),
      ),
    );

    $form['controlNavThumbsIC'] = array(
      '#type' => 'select',
      '#title' => t('Image style for use in thumbs'),
      '#default_value' => $this->options['controlNavThumbsIC'],
      '#options' => $presets,
      '#dependency' => array(
        'edit-style-options-controlnav' => array('thumbsIC')
      ),
    );

    $fields = array();
    foreach ($this->display->handler->get_handlers('field') as $field => $handler) {
      if ($label = $handler->label()) {
        $fields[$field] = $label;
      }
      else {
        $fields[$field] = $handler->ui_name();
      }
    }
    unset($fields[$form_state['view']->display_handler->options['row_options']['image_field']]);

    $form['controlNavThumbsICField'] = array(
      '#type' => 'select',
      '#title' => t('Image style for use in thumbs'),
      '#default_value' => $this->options['controlNavThumbsICField'],
      '#options' => array_merge(array('' => t('<None>')), $presets),
      '#dependency' => array(
        'edit-style-options-contronNav' => array('thumbsField')
      ),
    );

    $form['controlNavThumbsField'] = array(
      '#type' => 'select',
      '#title' => t('Field for use in thumbs'),
      '#default_value' => $this->options['controlNavThumbsField'],
      '#options' => $fields,
      '#dependency' => array('edit-style-options-controlnav' => array('thumbsField')),
    );

    $form['keyboardNav'] = array(
      '#type' => 'select',
      '#title' => t('Keyboard Navigator'),
      '#default_value' => $this->options['keyboardNav'],
      '#options' => array('true'=>t('Yes'), 'false' => t('No') ),
    );

    $form['pauseOnHover'] = array(
      '#type' => 'select',
      '#title' => t('Pause on Hover'),
      '#description' => t('Stop animation while hovering.'),
      '#default_value' => $this->options['pauseOnHover'],
      '#options' => array('true'=>t('Yes'), 'false' => t('No') ),
    );

    $form['manualAdvance'] = array(
      '#type' => 'select',
      '#title' => t('Manual Advance'),
      '#description' => t('Force manual transitions.'),
      '#default_value' => $this->options['manualAdvance'],
      '#options' => array('true'=>t('Yes'), 'false' => t('No') ),
    );

    $form['captionOpacity'] = array(
      '#type' => 'textfield',
      '#title' => t('Caption Opacity'),
      '#description' => t('Universal caption opacity.'),
      '#default_value' => $this->options['captionOpacity'],
    );
  }

  function get_style_options() {
    return array(
      'none' => t('None'),
      'default' => t('Default'),
    );
  }

  function get_effect_options(){
    return array(
      'random' => t('Random'),
      'boxRandom' => 'boxRandom',
      'boxRain' => 'boxRain',
      'boxRainReverse' => 'boxRainReverse',
      'boxRainGrow' => 'boxRainGrow',
      'boxRainGrowReverse' => 'boxRainGrowReverse',
      'sliceDown' => 'sliceDown',
      'sliceDownLeft' => 'sliceDownLeft',
      'sliceUp' => 'sliceUp',
      'sliceUpLeft' => 'sliceUpLeft',
      'sliceUpDown' => 'sliceUpDown',
      'sliceUpDownLeft' => 'sliceUpDownLeft',
      'slideInLeft' => 'slideInLeft',
      'slideInRight' => 'slideInRight',
      'fold' => 'fold',
      'fade' => 'fade',
    );
  }
}
