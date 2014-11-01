'use strict';

/**
 * @ngdoc function
 * @name recApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the recApp
 */

angular.module('ngDrupal', []) 
    .provider('ngDrupal', function() {
        // In the provider function, you cannot inject any
        // service or factory. This can only be done at the
        // "$get" method.
     
        this.hostname = '';
        this.endpoint = '';

        this.$get = function($q, $http, Restangular) {

            var SITE_ROOT = this.hostname;
            var SERVICES_ENDPOINT = this.endpoint;
            var REST_PATH = SITE_ROOT + SERVICES_ENDPOINT + '/';
            Restangular.setBaseUrl(REST_PATH);
            Restangular.setDefaultHttpFields({withCredentials: true});
            //console.log(REST_PATH);
            return {

                getCsrfToken: function() {
                    
                    var deferred = $q.defer();
                    $http({
                        url: SITE_ROOT + 'services/session/token',
                        method: 'GET',
                        withCredentials: true
                    }).success(function(data /*, status, headers, config*/) {
                        $http.defaults.headers.common['X-CSRF-Token'] = data;
                        deferred.resolve(data);
                    }).error(function(data /*, status, headers, config*/) {
                        deferred.reject(data);
                    });
                    return deferred.promise;
                },

                systemConnect: function() {
                    
                    var deferred = $q.defer();
                    var url = REST_PATH + 'system/connect';
                    this.getCsrfToken().then(function() {
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
                },

                logout: function() {
                    
                    var that = this;
                    var deferred = $q.defer();
                    var url = REST_PATH + 'user/logout';
                    
                    $http({
                        url: url,
                        method: 'POST',
                        withCredentials: true
                    })
                    .success(function(data /*, status, headers, config */) { 
                        that.getCsrfToken().then(function() {
                            deferred.resolve(data);
                        });
                        
                    })
                    .error(function(data /*, status, headers, config */) {
                        deferred.reject(data);
                    });
                    
                    return deferred.promise;
                },

                login: function (username, password) {
                    
                    var that = this;
                    var deferred = $q.defer();
                    var url = REST_PATH + 'user/login';
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
                        that.getCsrfToken().then(function() {
                            deferred.resolve(data);
                        });
                        
                    })
                    .error(function(data /*, status, headers, config */) {
                        deferred.reject(data);
                    });
                    
                    return deferred.promise;
                },

                nodeFactory: function() {

                  return Restangular.all('node');
                }




            }
        };
     
        this.config = function(options) {
            this.hostname = options.hostname;
            this.endpoint = options.endpoint;
        };
});