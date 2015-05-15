'use strict';

/* App module */

var ottapp = angular.module('ottapp', [
    'ngRoute',
    'ngSanitize',
    'ottapp.config',
    'ottapp.controllers',
    'ottapp.services',
    'ottapp.filters',
    'elasticsearch',
    'angular-loading-bar'
]);

/* Application routing */
ottapp.config(
    ['$routeProvider', '$httpProvider', '$locationProvider',
    function($routeProvider, $httpProvider, $locationProvider) {
    $routeProvider.when('/', {
	      templateUrl: 'partials/home.html?v=0.0.1',
	      controller: 'HomeController'
    });
    
    $routeProvider.when('/search', {
          templateUrl: 'partials/results.html?v=0.0.1',
          controller: 'SearchController'
    });

    $routeProvider.when('/help', {
          templateUrl: 'partials/help.html?v=0.0.1',
    });

    $routeProvider.when('/report/domains', {
        redirectTo: '/domains'
    });
    $routeProvider.when('/domains', {
          templateUrl: 'partials/domains.html?v=0.0.1',
          controller: 'DomainController'
    });

    $routeProvider.when('/stakeholder/:id', {
          templateUrl: 'partials/stakeholder.html?v=0.0.1',
          controller: 'StakeholderController'
    });

    $routeProvider.otherwise({ redirectTo: '/'});

    // Enable cross domain calls
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    // Enable #-less URLs.
    // $locationProvider.html5Mode(true);
}]);

/* Angular-Loading-Bar configuration */
ottapp.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
}]);
