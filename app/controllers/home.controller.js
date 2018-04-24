'use strict';

angular.module('brackEm')
    .controller('HomeController', ["$scope", "$firebase", "$location", "DataService", function ($scope, $firebase, $location, DataService) {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                DataService.getFeaturedBracket()
                    .then(function (response) {
                        $scope.bracket = response;
                    })
                    .catch(function (err) {
                        $scope.showError(err);
                    })
            } else {
                $scope.bracket = {};
            }
        });

        $scope.getCurrentBracket = function () {
            return $scope.bracket;
        }

        $scope.addBracketToList = function () {
            DataService.getBracketList()
                .then(function (response) {
                    var matchFound = false;
                    var bracketList = response;
                    angular.forEach(bracketList, function (value) {
                        if (value.id == $scope.bracket.id) {
                            $scope.showInfo('You already have this bracket added!');
                            matchFound = true;
                        }
                    })

                    if (!matchFound) {
                        bracketList.$add($scope.bracket);
                        $location.path("/brackets");
                    }
                })
                .catch(function (err) {
                    $scope.showError(err);
                })
        }
    }]);
