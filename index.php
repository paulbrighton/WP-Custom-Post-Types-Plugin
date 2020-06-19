<?php

/*
Plugin Name: _themename _pluginname
Plugin URI:
Author: Paul Brighton
Author URI: http://www.yummypixels.co.uk/
Description: Adding Custom Post Types for _themename
Version: 1.0.0
License: GNU General Public License version 3.0 & Envato Regular/Extended License
License URI: http://www.gnu.org/licenses/gpl-3.0.html & http://themeforest.net/licenses
Text Domain: _themename-_pluginname
Domain Path: /languages
*/

if( !defined('WPINC')) {
  die;
}

require_once 'includes/portfolio-post-type.php';
require_once 'includes/project-type-tax.php';
require_once 'includes/skills-tax.php';

function _themename__pluginname_activate() {
  _themename__pluginname_setup_post_type();
  _themename__pluginname_register_skills_tax();
  _themename__pluginname_register_project_type_tax();
  flush_rewrite_rules();
}

register_activation_hook(__FILE__, '_themename__pluginname_activate');

function _themename__pluginname_deactivate() {
  unregister_post_type('_themename_portfolio');
  unregister_taxonomy('_themename_project_type');
  unregister_taxonomy('_themename_skills');
  flush_rewrite_rules();
}

register_deactivation_hook(__FILE__, '_themename__pluginname_deactivate');