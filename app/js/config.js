'use strict';

/* Configuration options */

var ottappConfig = angular.module('ottapp.config', [])

ottappConfig.constant('ES_URL', 'https://www.overthetop.in/api')
    .constant('APP_VERSION', '0.0.1');
