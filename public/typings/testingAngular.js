var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope, $http) {
    $http({url: '/userinfo', method: 'GET', params: {user:localStorage.getItem('user')}}).then(function(response) {
        $scope.user = response.data;
       

    });
  
});