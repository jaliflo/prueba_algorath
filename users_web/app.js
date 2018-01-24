var app = angular.module('AlgorathTest', []);

app.controller('UsersController', function($http, $timeout, $scope){
    var apiUrl = "http://127.0.0.1:3000/api/users";
    var connectUrl = apiUrl + "/connect";

    var userModel = {
        name: ''
    };
    this.userModel = userModel;

    var selectsModel = {
        select1: '',
        select2: ''
    }
    this.selectsModel = selectsModel;

    var totalUsers = [];

    function getUsers() {
        $http({
            method: 'GET',
            url: apiUrl
        }).then(function(response){
            console.log(JSON.stringify(response));
            totalUsers = [];
            response.data.list.map(function(user){
                totalUsers.push(user.name);
            });

            $scope.select1Users = [];
            $scope.select2Users = [];

            $scope.select1Users = angular.copy(totalUsers);
            $scope.select2Users = angular.copy(totalUsers);
            console.log(JSON.stringify(totalUsers));
        }, function(error){
            console.log(JSON.stringify(error));
        });
    }

    $scope.$watch('users.selectsModel.select1', function(newVal, oldVal){
        console.log(newVal);
        if(newVal !== ''){
            $scope.select2Users = angular.copy(totalUsers);
            var aux = [];
            $scope.select2Users.map(function(name){
                if(name !== newVal){
                    aux.push(name);
                }
            });
            $scope.select2Users = angular.copy(aux);
        }
    });

    $scope.$watch('users.selectsModel.select2', function(newVal, oldVal){
        console.log(newVal);
        if(newVal !== ''){
            $scope.select1Users = angular.copy(totalUsers);
            var aux = [];
            $scope.select1Users.map(function(name){
                if(name !== newVal){
                    aux.push(name);
                }
            });
            $scope.select1Users = angular.copy(aux);
        }
    });

    this.newUser = function() {
        console.log(userModel);
        $http({
            method: 'POST',
            url: apiUrl,
            data: {
                "name": userModel.name
            }
        }).then(function(response){
            console.log(JSON.stringify(response));
            if(response.data.ok){
                console.log('aqui entra');
                $scope.successMessage = true;
                $timeout(function(){
                    $scope.successMessage = false;
                }, 2000);
                getUsers();
            }else if(response.data.err.split(" ")[0] === "E11000"){
                console.log("duplicate");
                $scope.errorMessage = "User alredy exists";
                $timeout(function(){
                    $scope.errorMessage = undefined;
                }, 2000);
            }else {
                $scope.errorMessage = "Error creating user";
                $timeout(function(){
                    $scope.errorMessage = undefined;
                }, 2000);
            }
        }, function(error){
            console.log(JSON.stringify(error));
            $scope.errorMessage = "Error creating user";
            $timeout(function(){
                $scope.errorMessage = undefined;
            }, 2000);
        });
    };

    this.connectUsers = function() {
        console.log(JSON.stringify(this.selectsModel));
        $http({
            method: 'PUT',
            url: connectUrl,
            data: {
                name1: this.selectsModel.select1,
                name2: this.selectsModel.select2
            }
        }).then(function(response){
            console.log(JSON.stringify(response));
        }, function(error){
            console.log(JSON.stringify(error));
        });
    };

    getUsers();
});