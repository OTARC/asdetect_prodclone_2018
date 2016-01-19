angular.module('asdetect.assessment', ['openfb', 'asdetect.child','asdetect.status'])

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

             .state('app.18Massessment', {
                url: "/do18mAssessment/:childId",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/do-18m-assessment.html",
                        controller: "18MAssessmentCtrl"
                    }
                }
            })  


              .state('app.24Massessment', {
                url: "/do24mAssessment/:childId",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/do-24m-assessment.html",
                        controller: "24MAssessmentCtrl"
                    }
                }
            }) 


             .state('app.35Yassessment', {
                url: "/do35yAssessment/:childId",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/do-35y-assessment.html",
                        controller: "35YAssessmentCtrl"
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
            create12m: function(assessmentItem) {
                return $http.post($rootScope.server.url + '/assessment/12m',assessmentItem);
            },
            create18m: function(assessmentItem) {
                return $http.post($rootScope.server.url + '/assessment/18m',assessmentItem);
            },
            create24m: function(assessmentItem) {
                return $http.post($rootScope.server.url + '/assessment/24m',assessmentItem);
            },
            create35y: function(assessmentItem) {
                return $http.post($rootScope.server.url + '/assessment/35y',assessmentItem);
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
            console.log('called Assessment.all()');
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


        $scope.update12m = function () {
            Assessment.create12m($scope.assessment).success(function(data) {
                $ionicPopup.alert({title: '12M Assessment Created', content: 'Is Child At Risk? '+data.externalatrisk__c});
                console.log('scope.child is:'+JSON.stringify($scope.child));
                
                /*
                var initials=$scope.child.childs_initials__c;
                var extid=$scope.child.externalchildid__c;

                Interaction.create({type__c: 'Created 12M Assessment', description__c:"Child - "+initials+" : Angular assessment module",externalchildid__c:extid})
                .success(function(status) {
                    console.log('Interaction recorded.');
                });
*/



            })

            .error(function (err) {
                            console.log("ERROR: "+JSON.stringify(err));
                            $ionicPopup.alert({title: 'Oops', content: err});
                        });

        };

      
        
    
})

  .controller('18MAssessmentCtrl', function ($scope, $rootScope, $stateParams, $ionicPopup, $ionicModal, Status, Child, Assessment, Observation, User, Interaction) {
        
        console.log('reached 18MAssessmentCtrl');
        $scope.assessment={}
        $scope.child = {};
        $scope.observations = Observation.all();
        $scope.panel = 1;
        

        Child.get($stateParams.childId).success(function(child) {
            $scope.child = child;
            console.log('in 18M --'+ JSON.stringify(child) +'--');
            $scope.assessment.externalchildid__c=child.externalchildid__c;
            console.log('scope.assessment='+JSON.stringify($scope.assessment));
        
        });


        $scope.update18m = function () {
            Assessment.create18m($scope.assessment).success(function(data) {
            $ionicPopup.alert({title: '18M Assessment Created', content: 'Is Child At Risk? '+data.externalatrisk__c});

                console.log('scope.child is:'+JSON.stringify($scope.child));
                
/*
                var initials=$scope.child.childs_initials__c;
                var extid=$scope.child.externalchildid__c;

                Interaction.create({type__c: 'Created 18M Assessment', description__c:"Child - "+initials+" : Angular assessment module",externalchildid__c:extid})
                .success(function(status) {
                    console.log('Interaction recorded.');
                });
*/



            })};

      
        
    
})

  .controller('24MAssessmentCtrl', function ($scope, $rootScope, $stateParams, $ionicPopup, $ionicModal, Status, Child, Assessment, Observation, User, Interaction) {
        
        console.log('reached 24MAssessmentCtrl');
        $scope.assessment={}
        $scope.child = {};
        $scope.observations = Observation.all();
        $scope.panel = 1;
        

        Child.get($stateParams.childId).success(function(child) {
            $scope.child = child;
            console.log('in 24M --'+ JSON.stringify(child) +'--');
            $scope.assessment.externalchildid__c=child.externalchildid__c;
            console.log('scope.assessment='+JSON.stringify($scope.assessment));
        
        });


        $scope.update24m = function () {
            Assessment.create24m($scope.assessment).success(function(data) {
            $ionicPopup.alert({title: '24M Assessment Created', content: 'Is Child At Risk? '+data.externalatrisk__c});

            console.log('scope.child is:'+JSON.stringify($scope.child));
                
                
                /*
                var initials=$scope.child.childs_initials__c;
                var extid=$scope.child.externalchildid__c;
                Interaction.create({type__c: 'Created 24M Assessment', description__c:"Child - "+initials+" : Angular assessment module",externalchildid__c:extid})
                .success(function(status) {
                    console.log('Interaction recorded.');
                });
                */



            })};

      
        
    
})


  .controller('35YAssessmentCtrl', function ($scope, $rootScope, $stateParams, $ionicPopup, $ionicModal, Status, Child, Assessment, Observation, User, Interaction) {
        
        console.log('reached 35YAssessmentCtrl');
        $scope.assessment={}
        $scope.child = {};
        $scope.observations = Observation.all();
        $scope.panel = 1;
        

        Child.get($stateParams.childId).success(function(child) {
            $scope.child = child;
            console.log('in 35Y --'+ JSON.stringify(child) +'--');
            $scope.assessment.externalchildid__c=child.externalchildid__c;
            console.log('scope.assessment='+JSON.stringify($scope.assessment));
        
        });


        $scope.update35y = function () {
            Assessment.create35y($scope.assessment).success(function(data) {
                               $ionicPopup.alert({title: '3.5Y Assessment Created', content: 'Is Child At Risk? '+data.externalatrisk__c});

              

              console.log('scope.child is:'+JSON.stringify($scope.child));
                /*
                var initials=$scope.child.childs_initials__c;
                var extid=$scope.child.externalchildid__c;

                Interaction.create({type__c: 'Created 35Y Assessment', description__c:"Child - "+initials+" : Angular assessment module",externalchildid__c:extid})
                .success(function(status) {
                    console.log('Interaction recorded.');
                });

*/




            })};

      
        
    
})










