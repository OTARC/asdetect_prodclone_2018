angular.module('nibs.interaction', [])

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
            create: function(interaction) {
                return $http.post($rootScope.server.url + '/interactions/', interaction);
            },
            deleteAll: function() {
                return $http.delete($rootScope.server.url + '/interactions');
            }
        };
    })

    //Controllers
    .controller('InteractionCtrl', function ($scope, $state, Interaction) {
        Interaction.all().success(function(interactions) {
            $scope.interactions = interactions;
        });

        $scope.doRefresh = function() {
            Interaction.all().success(function(interactions) {
                $scope.interactions = interactions;
                $scope.$broadcast('scroll.refreshComplete');
            });
        };

    });