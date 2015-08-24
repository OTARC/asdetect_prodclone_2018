angular.module('nibs.assessment', ['openfb', 'nibs.child','nibs.status', 'nibs.activity'])

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
            },
            create: function(assessmentItem) {
                return $http.post($rootScope.server.url + '/assessment/12m',assessmentItem);
            }
        };
    })

 .factory('Observation', function() {

        var observations = [
            { text: 'Typical', value: 'Typical' },
            { text: 'Atypical', value: 'Atypical' }
          
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


    .controller('12MAssessmentCtrl', function ($scope, $rootScope, $stateParams, $ionicPopup, $ionicModal, Status, Child, Assessment, Observation, User, Interaction) {
        
        console.log('reached 12MAssessmentCtrl');
        $scope.assessment={}
        $scope.child = {};
        $scope.observations = Observation.all();
        $scope.panel = 1;
        

        Child.get($stateParams.childId).success(function(child) {
            $scope.child = child;
            console.log('in 12M --'+ JSON.stringify(child) +'--');
            $scope.assessment.externalchildid__c=child.externalchildid__c;
            console.log('scope.assessment='+JSON.stringify($scope.assessment));
        
        });


        $scope.update = function () {
            Assessment.create($scope.assessment).success(function(data) {
                $ionicPopup.alert({title: 'Thank You', content: '12M Child assessment created.'});
                console.log('scope.child is:'+JSON.stringify($scope.child));
                var initials=$scope.child.childs_initials__c;
                var extid=$scope.child.externalchildid__c;

 Interaction.create({type__c: 'Created a 12M Assessment for Child:  '+initials, description__c:"Called from Angular assessment module",externalchildid__c:extid})
                .success(function(status) {
                    console.log('Interaction recorded.');
                });



            })};

            




        
    
})




