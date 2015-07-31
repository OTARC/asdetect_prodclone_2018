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


               .state('app.edit-child', {
                url: "/edit-child",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/add-child.html",
                        controller: "ChildCtrl"
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
            get: function(childId) {
                return $http.get($rootScope.server.url + '/child/' + childId);
            },
            create: function(childItem) {
                return $http.post($rootScope.server.url + '/child',childItem);
            }
        };
    })

    //Controllers
    .controller('ChildListCtrl', function ($scope, $rootScope, $ionicPopup, $ionicModal, Child, User) {
        Child.all().success(function(children) {
            $scope.children = children;
        });

       
    })


    .controller('ChildCtrl', function ($scope, $window, $ionicPopup, S3Uploader, Child, User, Status) {

        
  $scope.child = {};

        $scope.submit = function () {
            Child.create($scope.child).success(function() {
                $ionicPopup.alert({title: 'Thank You', content: 'Child record created.'});
            });
        };
   
    });


