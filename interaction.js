angular.module('asdetect.interaction', [])

    // Routes
    .config(function ($stateProvider) {

        $stateProvider

            .state('app.interaction', {
                url: "/interaction",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/interaction-list.html",
                        controller: "InteractionCtrl"
                    }
                }
            })

    })

    // Services
    .factory('Interaction', function ($http, $rootScope) {
        return {
            all: function() {
                return $http.get($rootScope.server.url + '/interactions');
            },
            create: function(activity) {
                return $http.post($rootScope.server.url + '/interactions/', activity);
            },
            deleteAll: function() {
                return $http.delete($rootScope.server.url + '/interactions');
            }
        };
    })

    //Controllers
    .controller('InteractionCtrl', function ($scope, $state, Activity) {
        Activity.all().success(function(interactions) {
            $scope.interactions = interactions
        });

        $scope.doRefresh = function() {
            Activity.all().success(function(interactions) {
                $scope.interactions = interactions;
                $scope.$broadcast('scroll.refreshComplete');
            });
        };

    });