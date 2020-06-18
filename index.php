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

