"use strict";
//const cscApp = angular.module('cscApp', ['ngRoute']);
const cscApp = angular.module('cscApp', ['ionic', 'ngRoute', 'ngCordova']);
//const apiUrl = 'http://ec2-54-153-28-110.us-west-1.compute.amazonaws.com:3000/api';
const apiUrl = 'http://ec2-52-33-179-13.us-west-2.compute.amazonaws.com:8989/api';
//const apiUrl = 'https://cs496-kevinto.c9.io:8080/api';

// configure routes
cscApp.config(function($routeProvider) {
    $routeProvider
      .when('/', {
          templateUrl : 'gardens.html',
          controller  : 'gardenController'
      })
      .when('/gardenCrops', {
          templateUrl : 'gardenCrops.html',
          controller  : 'gardenCropsController'
      })
      //.when('/users', {
      //    templateUrl : 'users.html',
      //    controller  : 'userController'
      //})
      .when('/logout', {
          controller  : 'logoutController'
      })
    .when('/login', {
          templateUrl : 'index.html',
          controller : 'loginController'
      })
//    .when('/login', {
//          templateUrl : 'login.html',
//          controller : 'loginController'
//      })
});

// create the controller and inject Angular's $scope
cscApp.controller('mainController', function($scope) {
});

cscApp.controller('logoutController', function($scope, $window, $location) {
    $scope.logoutUser = () => {
        console.log('in logoutuser');
        $window.localStorage.setItem('token', null);
        $window.location.href = 'index.html';
    };
});

cscApp.controller('loginController', function($scope, $http, $window, $location) {
    $scope.loginUser = () => {
        console.log('loginUser');
        $scope.credentials = {
            username: $scope.login.username,
            passwordHash: $scope.login.passwordHash
        };

        $window.localStorage.setItem('username', $scope.login.username);
       
        $http.post(apiUrl + '/users/authenticate', $scope.credentials)
            .then(function success(response) {
                console.log(response);
                if(response.data.success == true){
                    $window.localStorage.setItem('token', response.data.token);
                    $window.location.href = 'main.html';
                } else {
                    $scope.invalidMessage = true; console.log('invalid');
                }
            });
    }
});

cscApp.controller('gardenController', function($scope, $http, $location,
            $window, $cordovaGeolocation) {
  function init () {
      console.log('in init');
      if(typeof $window.localStorage.getItem('token') === 'undefined' || 
          $window.localStorage.getItem('token') == 'null') {
          $window.location.href = '/login.html';
      }
    $http.get(apiUrl + '/gardenCrops').success(response => {
      $scope.gardenCrops = response;
      console.log(response);
    });
    $scope.newGardenCrops = [];
    $scope.newGardenCoordinates = [];
    $scope.editGardenCrops = [];
    $scope.showAddPanel = false;
  }
  let refresh = () => {
      console.log('in refresh');
    $http.get(apiUrl + '/gardens?owner__=' + username).success((response)=>{
      $scope.gardens = response;
      $scope.clearNewGarden();
      $scope.newGardenCrops = [];
      $scope.newGardenCoordinates = [];
      $scope.editGardenCrops = [];
      $scope.showAddPanel = false;
      $scope.selectedGarden = {};
      console.log(response);
    });
  }
  var username = $window.localStorage.getItem('username');
  init();
  refresh();
  
    $scope.getLocation = (collection) => {
      //geolocation 
      function getPosition(callback) {
          console.log('in getPosition');
          var posOptions = {timeout: 20000, enableHighAccuracy: false}
          $cordovaGeolocation.getCurrentPosition(posOptions)
          .then(function(position){
              var where = [];
              collection.push(position.coords.longitude);
              collection.push(position.coords.latitude);
              callback(collection);
          }, function (err) {
              console.log('error:', err);
          });
      }
      var coordinates = getPosition(function(cookie) {
           console.log(cookie);
       });
    }

  $scope.addGarden = () => {
    console.log('addGarden');

     var gardenObject =$scope.newGarden;
     gardenObject.owner = $window.localStorage.getItem('username');
     gardenObject.location = {};
     gardenObject.location.coordinates = $scope.newGardenCoordinates;
     gardenObject.gardenCrops = $scope.newGardenCrops;
    var newGarden = JSON.stringify(gardenObject)

      $http({ method : 'POST',
          url : apiUrl + '/gardens',
          headers : {
              'x-access-token' : $window.localStorage.getItem('token'),
              'Content-Type' : 'application/json'
          },
          data : newGarden
      }).then((success) => refresh());
 }
  $scope.updateGarden = () => {
    $scope.selectedGarden.gardenCrops = $scope.editGardenCrops.slice(0);
    console.log ('updating');
    console.log ($scope.selectedGarden);
        //if (validate($scope.selectedGarden, $scope.invalid) == true)
          var selectedGarden = JSON.stringify($scope.selectedGarden);
          //var selectedGarden = $scope.selectedGarden;
          console.log(selectedGarden);
          var id = $scope.selectedGarden._id;
          $http({
              method : 'PUT',
              url : apiUrl + '/gardens/' + id,
              headers : {
                  'x-access-token' : $window.localStorage.getItem('token'),
                  'Content-Type' : 'application/json'
              },
              data : selectedGarden
          }).then((success) => refresh());
 }
  $scope.removeGarden = id => {
    console.log(id);
    //$http.delete(apiUrl + '/gardens/'+id).then((success) => refresh());
           $http({
              method : 'DELETE',
              url : apiUrl + '/gardens/' + id,
              headers : {
                  'x-access-token' : $window.localStorage.getItem('token'),
                  'Content-Type' : 'application/json'
              },
          }).then((success) => refresh());
    //refresh();
  }
  $scope.clearNewGarden = () => {
    $scope.newGarden = {
      name : "",
      description : "",
    };
  }
  $scope.getTemplate = garden => {
    try {
      if (garden._id === $scope.selectedGarden._id) return 'edit';
      else return 'display';
    } catch (e) {return 'display';}
  };
  $scope.editGarden =  garden => {
    $scope.invalid = {
      name : '',
      phone :'',
      website :''
    }
    console.log('edit clicked');
      $scope.selectedGarden = angular.copy(garden);
      $scope.editGardenCrops = $scope.selectedGarden.gardenCrops.slice(0);;
  };
  
  $scope.addGardenCrop =  (selected, collection) => {
console.log(selected);
console.log(collection);
    for (let item of collection)
      if (item == selected)
        return;
    collection.push (selected);
    console.log(collection);
  }
  $scope.removeGardenCrop = (selected, collection) => {
    for(let i = 0; i < collection.length; i++) {
        if(collection[i] == selected) {
            collection.splice(i, 1);
            break;
        }
    }
    console.log(collection);
  }
});

cscApp.controller('gardenCropsController', function($scope, $http, $location, $window) {
      let refresh = function () {
          if(typeof $window.localStorage.getItem('token') === 'undefined' || 
              $window.localStorage.getItem('token') == 'null') {
              $window.location.href = '/login.html';
          }
        $http.get(apiUrl + '/gardenCrops').success(response => {
          $scope.gardenCrops = response;
          $scope.newCrop = "";
          $scope.newCropNote = "";
          $scope.newCropNotes= [];
          $scope.selectedCrop = {};
          $scope.selectedCropNote = "";
          $scope.selectedCropNotes= [];
          $scope.addCropError = {};
          $scope.editCropError = {};
          console.log(response);
        });
      }
      refresh();
      
      $scope.addCrop =  () => {
        console.log('in addCrop');
        console.log($scope.newCropNotes);
        //if (validate({name : $scope.newCrop}, $scope.gardenCrops, $scope.addCropError) == true)
          var name = $scope.newCrop;
          var notes = $scope.newCropNotes;
          $http({
              method : 'POST',
              url : apiUrl + '/gardenCrops',
              headers : {
                  'x-access-token' : $window.localStorage.getItem('token'),
                  'Content-Type' : 'application/json'
              },
              data : {name, notes}
          }).then((success) => refresh());
      }

      $scope.updateCrop = id => {
        if (validate($scope.selectedCrop, $scope.gardenCrops, $scope.editCropError) == true)
          var name = $scope.selectedCrop.name;
          var notes = $scope.selectedCropNotes;
          $http({
              method : 'PUT',
              url : apiUrl + '/gardenCrops/' + id,
              headers : {
                  'x-access-token' : $window.localStorage.getItem('token'),
                  'Content-Type' : 'application/json'
              },
              data : {name, notes}
          }).then((success) => refresh());
      }

      $scope.removeCrop = id => {
        console.log(id);
          $http({
              method : 'DELETE',
              url : apiUrl + '/gardenCrops/' + id,
              headers : {
                  'x-access-token' : $window.localStorage.getItem('token'),
                  'Content-Type' : 'application/json'
              },
          }).then((success) => refresh());
      }
      // gets the template to ng-include for a table row / item
      $scope.getCropTemplate =  crop => {
          return (crop._id === $scope.selectedCrop._id) ? 'editCrop' : 'displayCrop';
      };
      $scope.editCrop =  crop => {
        console.log('edit clicked '+ crop.name);
          $scope.selectedCrop= angular.copy(crop);
          $scope.selectedCropNotes = $scope.selectedCrop.item.slice(0);;
          console.log ($scope.selectedCrop.name);
      };
      function validate (item, collection, errorField) {
        console.log('validating');
        if (item.name == "" || item.name == undefined) {
          errorField.text = "Category cannot be blank";
          return false;
        }
        return true;
      }
    //$scope.addNote =  (newNote, collection) => {
    //$scope.addCropNote =  (newNote, collection) => {
    $scope.addNote =  (newNote, collection) => {
        console.log(newNote);
        console.log(collection);
        for (let item of collection)
          if (item == newNote)
            return;
        collection.push (newNote);
        console.log(collection);
    }
    $scope.removeNote = (newNote, collection) => {
        for(let i = 0; i < collection.length; i++) {
            if(collection[i] == newNote) {
                collection.splice(i, 1);
                break;
            }
        }
        console.log(collection);
    }
});

cscApp.controller('userController', function($scope, $http, $window, $location) {
  //function init () {
  //    if(typeof $window.localStorage.getItem('token') === 'undefined' || 
  //        $window.localStorage.getItem('token') == 'null') {
  //        $window.location.href = '/login.html';
  //    }
  //  $http.get(apiUrl + '/users').success(response => {
  //    $scope.users = response;
  //    console.log(response);
  //  });
  //  $scope.newUser = [];
  //  $scope.editUser = [];
  //  $scope.showAddPanel = false;
  //}
  let refresh = () => {
      if(typeof $window.localStorage.getItem('token') === 'undefined' || 
          $window.localStorage.getItem('token') == 'null') {
          $window.location.href = '/login.html';
      }
      console.log('userRefresh');
      $http.get(apiUrl + '/users').success((response)=>{
      $scope.users = response;
      $scope.clearNewUser();
      $scope.selectedUser = {};
      console.log(response);
    });
  }
  //init();
  refresh();
  $scope.addUser = () => {
    $scope.invalidAdd = {
      username : '',
      passwordHash :''
    }
      //$http.post(apiUrl + '/users', $scope.newUser, config).then((success) => refresh());
      var newUser = JSON.stringify($scope.newUser);
      console.log($window.localStorage.getItem('token'));
      console.log(newUser);
      $http({
          method : 'POST',
          url : apiUrl + '/users',
          headers : {
              'x-access-token' : $window.localStorage.getItem('token'),
              'Content-Type' : 'application/json'
          },
          data : newUser 
      }).then((success) => refresh());

      //$http(req);
  }
  $scope.updateUser = () => {
    console.log ('updating');
    console.log ($scope.selectedUser);
        //if (validate($scope.selectedGarden, $scope.invalid) == true)
          //$http.put(apiUrl + '/users/'+$scope.selectedUser._id, $scope.selectedUser).then((success) => refresh());
          var userID = $scope.selectedUser._id;
          var selectedUser = JSON.stringify($scope.selectedUser);
          $http({
              method : 'PUT',
              url : apiUrl + '/users/' + userID,
              headers : {
                  'x-access-token' : $window.localStorage.getItem('token'),
                  'Content-Type' : 'application/json'
              },
              data : selectedUser 
          }).then((success) => refresh());

  }
  $scope.removeUser = id => {
    console.log(id);
    //$http.delete(apiUrl + '/users/'+id).then((success) => refresh());
          $http({
              method : 'DELETE',
              url : apiUrl + '/users/' + id,
              headers : {
                  'x-access-token' : $window.localStorage.getItem('token'),
                  'Content-Type' : 'application/json'
              },
          }).then((success) => refresh());
  }
  $scope.clearNewUser = () => {
    $scope.newUser = {
      username : "",
      passwordHash : ""
    };
  }
  $scope.getTemplate = user => {
    try {
      if (user._id === $scope.selectedUser._id) return 'edit';
      else return 'display';
    } catch (e) {return 'display';}
  };
  $scope.editUser = user => {
    $scope.invalid = {
      username : "",
      passwordHash : ""
    }
    console.log('edit clicked');
      $scope.selectedUser = angular.copy(user);
  };
  //function validate(garden, errorMessage) {
  //    return true;
  //    console.log('validating');
  //    console.log(user);
  //    errorMessage.username = '';
  //    errorMessage.passwordHash = '';

  //    let returnValue = true;
  //    if (user.username == '') {
  //      errorMessage.username = 'Username cannot be blank.';
  //      returnValue = false;
  //    }
  //    for (let u of $scope.users) {
  //      if (user._id == u._id)
  //        continue;
  //      if (user.username == u.username) {
  //        errorMessage.username = u.username +' is already in the database.';
  //        returnValue = false;
  //      }
  //    }
  //    return returnValue;
  //}
});


