'use strict';

angular.
module('brackEm').
component('bracket', {
    templateUrl: 'components/bracket/bracket.template.html',
    controller: function BracketCompController($scope, $routeParams, DataService) {
        var $ctrl = this;
        $ctrl.$onInit = function () {
            $scope.readOnly = $ctrl.readOnly;

            if (!$ctrl.data) {
                DataService.getBracket($ctrl.bracketId)
                    .then(function (response) {
                        if ($scope.readOnly) {
                            $scope.bracket = response;
                        } else {
                            response.$bindTo($scope, "bracket");
                        }
                    })
                    .catch(function (err) {
                        throw new Error(err);
                    })
            } else {
                $scope.bracket = $ctrl.data;
            }
        }

        $scope.isRoundVisible = function (roundNum) {
            return ($scope.bracket && $scope.bracket.rounds && $scope.bracket.rounds['round' + roundNum] != null);
        }

        $scope.teamClick = function (team, nextRoundIndex) {
            if ($scope.readOnly) {
                return;
            }
            var roundData = $scope.bracket.rounds['round' + (nextRoundIndex + 1)];
            var matchUp = roundData[team.seedId[nextRoundIndex]];

            if (team.positionId[nextRoundIndex] == 0) {
                $scope.removeWinner(matchUp.top.id, team.id, nextRoundIndex, function () {
                    matchUp.top = team;
                });
            } else {
                $scope.removeWinner(matchUp.bottom.id, team.id, nextRoundIndex, function () {
                    matchUp.bottom = team;
                });
            }
        }

        $scope.removeWinner = function (oldWinnerId, teamWinnerId, currentRoundIndex, callback) {
            if (!oldWinnerId || oldWinnerId == 0 || oldWinnerId == teamWinnerId) {
                callback();
                return;
            }

            while (currentRoundIndex >= 0) {
                currentRoundIndex--;

                if ($scope.bracket.rounds.champion == oldWinnerId) {
                    $scope.bracket.rounds.champion = "TBD";
                }

                var roundData = $scope.bracket.rounds['round' + (currentRoundIndex + 1)];

                angular.forEach(roundData, function (value) {
                    if (value.top != 0 && value.top.id == oldWinnerId) {
                        value.top = 0;
                    }

                    if (value.bottom != 0 && value.bottom.id == oldWinnerId) {
                        value.bottom = 0;
                    }
                });
            }

            callback();
        }

        $scope.setChamp = function (team) {
            if ($ctrl.readOnly) {
                return;
            }
            alert('you have ' + team.name + ' winning it all!');
        }

        $scope.tab = 1;

        $scope.setTab = function (newTab) {
            console.log('in in set');
            $scope.tab = newTab;
        };

        $scope.isSet = function (tabNum) {
            return $scope.tab === tabNum;
        };
    },
    bindings: {
        data: '=',
        bracketId: '@',
        readOnly: '<'
    }
});
