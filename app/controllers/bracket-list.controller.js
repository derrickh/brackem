'use strict';

angular.module('brackEm')
    .controller('BracketListController', ["$scope", "$filter", "$location", "$firebase", "DataService", function ($scope, $filter, $location, $firebase, DataService) {
        $scope.openBracket = function (bracketId) {
            if (!$scope.actionClicked) {
                $location.path("/bracket/" + bracketId);
            }
            $scope.actionClicked = false;
        }

        $scope.shareBracket = function (bracket) {
            alert('share bracket: ' + bracket);
        }

        $scope.printBracket = function (bracket) {
            alert('print bracket: ' + bracket);
        }

        $scope.deleteBracket = function (bracket) {
            $scope.bracketList.$remove(bracket);
        }

        $scope.findBracket = function (bracketId) {
            angular.forEach($scope.bracketList, function (value) {
                if (value.id == bracketId) {
                    return value;
                }
            });
        }

        DataService.getBracketList()
            .then(function (response) {
                $scope.bracketList = response;
            })
            .catch(function (err) {
                throw new Error(err);
            })
    }]);
