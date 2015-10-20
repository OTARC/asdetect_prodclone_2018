angular.module('nibs.auth', ['openfb', 'nibs.config', 'nibs.interaction'])

    /*
     * Routes
     */
    .config(function ($stateProvider) {

        $stateProvider

            .state('app.login', {
                url: "/login",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/login.html",
                        controller: "LoginCtrl"
                    }
                }
            })

            .state('app.logout', {
                url: "/logout",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/welcome.html",
                        controller: "LogoutCtrl"
                    }
                }
            })

            .state('app.signup', {
                url: "/signup",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/signup.html",
                        controller: "SignupCtrl"
                    }
                }
            })

            .state('app.resetpassword', {
                url: "/resetpassword",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/resetpassword.html",
                        controller: "ResetPasswordCtrl"
                    }
                }
            })

    })

    /*
     * REST Resources
     */
    .factory('Auth', function ($http, $window, $rootScope) {

        return {
            login: function (user) {
                return $http.post($rootScope.server.url + '/login', user)
                    .success(function (data) {
                        $rootScope.user = data.user;
                        $window.localStorage.user = JSON.stringify(data.user);
                        $window.localStorage.token = data.token;

                        console.log('Subscribing for Push as ' + data.user.email);
                        if (typeof(ETPush) != "undefined") {
                            ETPush.setSubscriberKey(
                                function() {
                                    console.log('setSubscriberKey: success');
                                },
                                function(error) {
                                    alert('Error setting Push Notification subscriber');
                                },
                                data.user.email
                            );
                        }

                    });
            },
            fblogin: function (fbUser) {
                console.log(JSON.stringify(fbUser));
                return $http.post($rootScope.server.url + '/fblogin', {user:fbUser, token: $window.localStorage['fbtoken']})
                    .success(function (data) {
                        $rootScope.user = data.user;
                        $window.localStorage.user = JSON.stringify(data.user);
                        $window.localStorage.token = data.token;

                        console.log('Subscribing for Push as ' + data.user.email);
                        if (typeof(ETPush) != "undefined") {
                            ETPush.setSubscriberKey(
                                function() {
                                    console.log('setSubscriberKey: success');
                                },
                                function(error) {
                                    alert('Error setting Push Notification subscriber');
                                },
                                data.user.email
                            );
                        }

                    });
            },
            logout: function () {
                
return $http.post($rootScope.server.url + '/logout')
                    .success(function (data) {
                        
                        console.log('logged out');
                       

                    });



                //$rootScope.user = undefined;
                //var promise = $http.post($rootScope.server.url + '/logout');
                //$window.localStorage.removeItem('user');
                //$window.localStorage.removeItem('token');
                //return promise;
            },
            signup: function (user) {
                return $http.post($rootScope.server.url + '/signup', user);
            },
             resetpassword: function (user) {
                return $http.post($rootScope.server.url + '/resetpassword', user);
            }

        }
    })

    /*
     * Controllers
     */
    .controller('LoginCtrl', function ($scope, $rootScope, $state, $window, $location, $ionicViewService, $ionicPopup, $ionicModal, Auth, Interaction, OpenFB) {

        $ionicModal.fromTemplateUrl('templates/server-url-setting.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });
        $scope.openAppDialog = function() {
            $scope.modal.show();
        };

        $scope.$on('modal.hidden', function(event) {
            $window.localStorage.setItem('serverURL', $rootScope.server.url);
        });

        $window.localStorage.removeItem('user');
        $window.localStorage.removeItem('token');

        $scope.user = {};

        $scope.login = function () {

            Auth.login($scope.user)
                .success(function (data) {

            /*
             Interaction.create({type__c: "Logged in", description__c:"Called from Angular nibs.auth",externalchildid__c:""})
                .success(function(status) {
                    console.log('Interaction recorded.');
                });
            */

                    $state.go("app.profile");
                })
                .error(function (err) {
                    $ionicPopup.alert({title: 'Oops', content: err});
                });
        };

        $scope.facebookLogin = function () {

            OpenFB.login('email, publish_actions').then(
                function () {
                    OpenFB.get('/me', {fields: 'id,first_name,last_name,email,picture,birthday,gender'})
                        .success(function (fbUser) {
                            Auth.fblogin(fbUser)
                                .success(function (data) {
                                    $state.go("app.profile");
                                    setTimeout(function () {
                                        $ionicViewService.clearHistory();
                                    });
                                })
                                .error(function (err) {
                                    console.log(JSON.stringify(err));
                                    $ionicPopup.alert({title: 'Oops', content: err});
                                })
                        })
                        .error(function () {
                            $ionicPopup.alert({title: 'Oops', content: "The Facebook login failed"});
                        });
                },
                function () {
                    $ionicPopup.alert({title: 'Oops', content: "The Facebook login failed"});
                });
        };

    })

    .controller('LogoutCtrl', function ($scope, $rootScope, $window, Auth, Interaction) {

            /*
               Interaction.create({type__c: "Logged out", description__c:"Called from Angular nibs.auth",externalchildid__c:""})
               .success(function(status) {
                console.log('Interaction recorded.');
            });
            */

            Auth.logout()
            .success(function (data) {
               $rootScope.user = null;
               $window.localStorage.removeItem('user');
               $window.localStorage.removeItem('token');
           })
            .error(function (err) {
                console.log('Error logging out');
            });


     })




     .controller('ResetPasswordCtrl', function ($scope, $state, $ionicPopup, $rootScope, $window, Auth, Interaction) {

            /*
               Interaction.create({type__c: "Logged out", description__c:"Called from Angular nibs.auth",externalchildid__c:""})
               .success(function(status) {
                console.log('Interaction recorded.');
            });
            */

 $scope.user = {};

   $scope.resetpassword = function () {
           
            Auth.resetpassword($scope.user)
                .success(function (data) {
                     $ionicPopup.alert({title: 'Reset Password', content: "Check your email"});
                });
        };



     })

    .controller('SignupCtrl', function ($scope, $state, $ionicPopup, Auth, OpenFB) {

        $scope.user = {};

        $scope.signup = function () {
            if ($scope.user.password !== $scope.user.password2) {
                $ionicPopup.alert({title: 'Oops', content: "passwords don't match"});
                return;
            }
            Auth.signup($scope.user)
                .success(function (data) {
                    $state.go("app.login");
                });
        };

        $scope.facebookLogin = function () {

            OpenFB.login('email, publish_actions').then(
                function () {
                    OpenFB.get('/me', {fields: 'id,first_name,last_name,email,picture,birthday,gender'})
                        .success(function (fbUser) {
                            Auth.fblogin(fbUser)
                                .success(function (data) {
                                    $state.go("app.profile");
                                    setTimeout(function () {
                                        $ionicViewService.clearHistory();
                                    });
                                })
                                .error(function (err) {
                                    $ionicPopup.alert({title: 'Oops', content: err});
                                })
                        })
                        .error(function () {
                            $ionicPopup.alert({title: 'Oops', content: "The Facebook login failed"});
                        });
                },
                function () {
                    $ionicPopup.alert({title: 'Oops', content: "The Facebook login failed"});
                });
        };

    });
