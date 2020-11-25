var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope, $http) {
    $http.get('/new').then(function(response) {
        console.log(response)
        $scope.name = response.data.name;
        $scope.age = response.data.age;
    });
  
});