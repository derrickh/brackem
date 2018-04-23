'use strict';

angular.module('brackEm')
    .controller('HomeController', function ($scope, DataService) {
        $scope.featuredId = '-LAmoCAcGshDN-jXTdFe';

        DataService.getBracket($scope.featuredId)
            .then(function (response) {
                $scope.bracket = response;
            })
            .catch(function (err) {
                $scope.showError(err);
            })

        $scope.addBracketToList = function () {
            DataService.getBracketList()
                .then(function (response) {
                    var bracketList = response;
                    angular.forEach(bracketList, function (value) {
                        if (value.id == $scope.bracket.id) {
                            $scope.showInfo('You already have this bracket added!');
                        }
                    })
                    bracketList.$add($scope.bracket);
                })
                .catch(function (err) {
                    $scope.showError(err);
                })
        }
    });
