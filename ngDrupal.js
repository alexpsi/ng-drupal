'use strict';

/**
 * @ngdoc function
 * @name recApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the recApp
 */
angular.module('ngDrupal', []) 
.factory('ngDrupal', function($q, $http, Restangular) {
    
    var ngDrupal = {};

    ngDrupal.setRestPath = function (root, endpoint) {
        
        Restangular.setBaseUrl('http://beta1.iterativ.tk/api');
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
            data: {uid: 3},
            withCredentials: true
        }).success(function(data /*, status, headers, config*/) {
            //localStorage.setItem('X-CSRF-Token', data);
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
            //localStorage.setItem('X-CSRF-Token', '');
            ngDrupal.getCsrfToken().then(function() {
                //$http.defaults.headers.common['X-CSRF-Token'] = data;
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


