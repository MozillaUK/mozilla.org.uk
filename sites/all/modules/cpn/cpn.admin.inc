<?php

/**
 * Settings form.
 */
function cpn_settings($form, &$form_state) {
  $form['cpn_syntax_highlighting'] = array(
    '#title' => t('Syntax Highlighting'),
    '#type' => 'radios',
    '#options' => array(
      0 => t('None'),
    ),
    '#default_value' => variable_get('cpn_syntax_highlighting', 0),
  );

  // Add CodeMirror as a syntax highlighting option if available.
  if (is_file('sites/all/libraries/codemirror/lib/codemirror.js')) {
    $form['cpn_syntax_highlighting']['#options']['codemirror'] = 'CodeMirror 2';
  }
  else {
    drupal_set_message(t('Syntax highlighting requires <a href="@url">CodeMirror 2</a>. Download it, rename the folder "codemirror", and place it at "sites/all/libraries". Then return to this page and enable syntax highlighting.', array('@url' => 'http://codemirror.net/')), 'warning', FALSE);
  }

  $form['cpn_path'] = array(
    '#title' => t('File storage path'),
    '#type' => 'textfield',
    '#default_value' => variable_get('cpn_path', 'public://cpn'),
    '#description' => t('The path where Code per Node will store files. Note: changing this path will cause the old path to move to the new path, overwriting the new path, if it exists.'),
  );

  $form['#submit'][] = 'cpn_settings_submit';
  return system_settings_form($form);
}

/**
 * Settings form - submit callback.
 */
function cpn_settings_submit($form, &$form_state) {
  // Trim slashes from the path.
  $form_state['values']['cpn_path'] = trim($form_state['values']['cpn_path'], '/');

  // If the path changed, notify that the folder must be moved.
  $old_path = variable_get('cpn_path', 'public://cpn');
  if ($form_state['values']['cpn_path'] != $old_path and file_exists($old_path)) {
    drupal_set_message(t('The file storage path has changed; thus, the contents of %old_path must manually be moved to %new_path.', array(
      '%old_path' => $old_path,
      '%new_path' => $form_state['values']['cpn_path'],
    )), 'warning');
  }
}
