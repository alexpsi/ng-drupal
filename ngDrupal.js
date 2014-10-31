'use strict';

/**
 * @ngdoc service
 * @name ngDrupal
 * @description
 * # ngDrupal 
 * Angular service that allows Restangular to connect to a Drupal site utilizing Services 3.5+. 
 * Provides authentication and file upload methods.
 */
angular.module('ngDrupal', []) 
.factory('ngDrupal', function($q, $http, Restangular) {
    
    var ngDrupal = {};

    ngDrupal.setRestPath = function (root, endpoint) {
        
        Restangular.setBaseUrl('HOSTNAME'); //Need to add service configuration
        ngDrupal.SITE_ROOT = root;
        ngDrupal.SERVICES_ENDPOINT = endpoint;
        ngDrupal.REST_PATH = root + endpoint + '/';
        Restangular.setBaseUrl(ngDrupal.REST_PATH);
        Restangular.setDefaultHttpFields({withCredentials: true});

    };

    ngDrupal.getCsrfToken = function() {
        
        var deferred = $q.defer();
        $http({
            url: ngDrupal.SITE_ROOT + 'services/session/token',
            method: 'GET',
            withCredentials: true
        }).success(function(data /*, status, headers, config*/) {
            $http.defaults.headers.common['X-CSRF-Token'] = data;
            deferred.resolve(data);
        }).error(function(data /*, status, headers, config*/) {
            deferred.reject(data);
        });
        
        return deferred.promise;
    };

    ngDrupal.systemConnect = function() {
        var deferred = $q.defer();
        var url = ngDrupal.REST_PATH + 'system/connect';
        ngDrupal.getCsrfToken().then(function() {
            $http({
                url: url,
                method: 'POST',
                withCredentials: true
            })
            .success(function(data /*, status, headers, config */) { 
                deferred.resolve(data.user);
            })
            .error(function(data /*, status, headers, config */) {
                deferred.reject(data);
            });        
        });
        return deferred.promise;
    };


    ngDrupal.logout = function() {
        var deferred = $q.defer();
        var url = ngDrupal.REST_PATH + 'user/logout';
        
        $http({
            url: url,
            method: 'POST',
            withCredentials: true
        })
        .success(function(data /*, status, headers, config */) { 
            ngDrupal.getCsrfToken().then(function() {
                $http.defaults.headers.common['X-CSRF-Token'] = '';
                deferred.resolve(data);
            });
            
        })
        .error(function(data /*, status, headers, config */) {
            deferred.reject(data);
        });
        
        return deferred.promise;
    };

    ngDrupal.login = function (username, password) {
        var deferred = $q.defer();
        var url = ngDrupal.REST_PATH + 'user/login';
        var user = {
          username: username,
          password: password
        };

        $http({
          url: url,
            method: 'POST',
            data: user,
            withCredentials: true,
        })
        .success(function(data /*, status, headers, config */) { 
            ngDrupal.getCsrfToken().then(function() {
                deferred.resolve(data);
            });
            
        })
        .error(function(data /*, status, headers, config */) {
            deferred.reject(data);
        });
        
        return deferred.promise;
    };

    ngDrupal.nodeFactory = function() {
      return Restangular.all('node');
    };

    return ngDrupal;
});


