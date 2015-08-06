angular.module('nibs.assessment', ['openfb', 'nibs.child','nibs.status', 'nibs.activity', 'nibs.wallet'])

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

            .state('app.12Massessment', {
                url: "/do12mAssessment/:childId",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/do-12m-assessment.html",
                        controller: "12MAssessmentCtrl"
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

 .factory('Observation', function() {

        var observations = [
            { text: 'Typical', value: 'Typical' },
            { text: 'Atypical', value: 'ATypical' }
          
        ];

        return {
            all: function() {
                return observations;
            }
        }
    })

    //Controllers
    .controller('AssessmentListCtrl', function ($scope, $rootScope, $ionicPopup, $ionicModal, Assessment, User) {
        Assessment.all().success(function(assessment) {
            $scope.assessment = assessment;
        });

       
    })


    .controller('12MAssessmentCtrl', function ($scope, $rootScope, $ionicPopup, $ionicModal, Assessment, Observation, User) {
        
        console.log('reached 12MAssessmentCtrl');
        $scope.assessment={}
        $scope.child = {};
        $scope.observations = Observation.all();
        $scope.panel = 1;
        

        Child.get($stateParams.childId).success(function(child) {
            $scope.child = child;
            $scope.assessment.externalchildid=child.externalchildid;
        });


 



        $scope.update = function () {
            //User.update($scope.user).success(function() {
                Status.show('Your profile has been saved.');
            };
        

    

       
    })




