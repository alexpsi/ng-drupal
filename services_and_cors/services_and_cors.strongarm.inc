<?php
/**
 * @file
 * services_and_cors.strongarm.inc
 */

/**
 * Implements hook_strongarm().
 */
function services_and_cors_strongarm() {
  $export = array();

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'cors_domains';
  $strongarm->value = array(
    '*' => '<mirror>|POST,GET,PUT,OPTIONS,DELETE|Accept, Content-Type,X-CSRF-Token|true',
  );
  $export['cors_domains'] = $strongarm;

  return $export;
}
