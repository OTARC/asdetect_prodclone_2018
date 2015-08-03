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


               .state('app.child-detail', {
                url: "/child/:childId",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/child-detail.html",
                        controller: "ChildDetailCtrl"
                    }
                }
            })

                .state('app.add-child', {
                url: "/child-detail",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/add-child.html",
                        controller: "ChildCtrl"
                    }
                }
            })


           

    })


    .factory('Gender', function() {

        var genders = [
            { text: 'Male', value: 'Male' },
            { text: 'Female', value: 'Female' }     
        ];

        return {
            all: function() {
                return genders;
            }
        }
    })

        .factory('Diag', function() {

        var diagnoses = [
            { text: 'PDD', value: 'PDD' },
            { text: 'Aspergers', value: 'Aspergers' },
            { text: 'Autism Spectrum', value: 'Austism Spectrum' }

        ];

        return {
            all: function() {
                return diagnoses;
            }
        }
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


      .controller('ChildEditCtrl', function ($scope, $rootScope, $stateParams, $ionicPopup, $ionicModal, Child, Diag, Gender,User, Status) {
        
        Child.get($stateParams.childId).success(function(child) {
            $scope.child = child;
            $scope.genders = Gender.all();  
            $scope.diagnoses = Diag.all();  

        });

        $scope.submit = function () {
            Child.create($scope.child).success(function() {
                $ionicPopup.alert({title: 'Thank You', content: 'Child record created.'});
            });

       }
    })



      .controller('ChildDetailCtrl', function ($scope, $window, $rootScope, $stateParams, $ionicPopup, S3Uploader, Diag, Child, Gender, User, Status) {

        $scope.genders = Gender.all();  
        $scope.diagnoses = Diag.all();  

        $scope.child = {};

        Child.get($stateParams.childId).success(function(child) {
            $scope.child = child;
        });

    })




 .controller('ChildCtrl', function ($scope, $window, $ionicPopup, S3Uploader, Diag, Child, Gender, User, Status) {

$scope.genders = Gender.all();  
$scope.diagnoses = Diag.all();  


  $scope.child = {};

        $scope.submit = function () {
            Child.create($scope.child).success(function() {
                $ionicPopup.alert({title: 'Thank You', content: 'Child record created.'});
            });
        };
   
    })


