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


               .state('app.add-child', {
                url: "/add-child",
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

        .factory('Diagnosis', function() {

        var diagnoses = [
            { text: 'Austism Spectrum Disorder', value: 'Austism Spectrum Disorder' },
           { text: 'Aspergers Syndrome/Disorder', value: 'Aspergers Syndrome/Disorder' },     
            { text: 'PDD', value: 'PDD' }     
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


    .controller('ChildCtrl', function ($scope, $window, $ionicPopup, S3Uploader, Child, Gender, User, Status) {

  $scope.genders = Gender.all();  

  $scope.diagnoses = Diagnosis.all();  

  $scope.child = {};

        $scope.submit = function () {
            Child.create($scope.child).success(function() {
                $ionicPopup.alert({title: 'Thank You', content: 'Child record created.'});
            });
        };
   
    });


