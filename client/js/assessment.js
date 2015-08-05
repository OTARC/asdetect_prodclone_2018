angular.module('nibs.child', ['openfb', 'nibs.status', 'nibs.activity', 'nibs.wallet'])

    // Routes
    .config(function ($stateProvider) {

        $stateProvider

            .state('app.assessment', {
                url: "/assessment",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/assessment-list.html",
                        controller: "AssessmentListCtrl"
                    }
                }
            })           

    })

    
       
    // Services
    .factory('Assessment', function ($http, $rootScope) {
        return {
            all: function() {
                return $http.get($rootScope.server.url + '/assessment');
            }
        };
    })

    //Controllers
    .controller('AssessmentListCtrl', function ($scope, $rootScope, $ionicPopup, $ionicModal, Assessment, User) {
        Child.all().success(function(assessment) {
            $scope.assessment = assessment;
        });

       
    })



