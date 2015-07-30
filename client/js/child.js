angular.module('nibs.child', ['openfb', 'nibs.status', 'nibs.activity', 'nibs.wallet'])

    // Routes
    .config(function ($stateProvider) {

        $stateProvider

            .state('app.child', {
                url: "/child",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/child-list.html",
                        controller: "ChildListCtrl"
                    }
                }
            })


           

    })

    // Services
    .factory('Child', function ($http, $rootScope) {
        return {
            all: function() {
                return $http.get($rootScope.server.url + '/child');
            },
            get: function(offerId) {
                return $http.get($rootScope.server.url + '/child/' + childId);
            }
        };
    })

    //Controllers
    .controller('ChildListCtrl', function ($scope, $rootScope, $ionicPopup, $ionicModal, Offer, User) {
        Child.all().success(function(children) {
            $scope.children = children;
        });

       
    })


