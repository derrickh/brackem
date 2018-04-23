angular.module('brackEm')
    .controller('CreateController', ["$scope", "$location", "DataService", function ($scope, $location, DataService) {

        $scope.newBracket = {};

        $scope.create = function () {
            var bracket = $scope.newBracket;
            if (!bracket.teamList) {
                $scope.showError({
                    message: 'List of seeds is not populated, populate it and try again'
                });
                return;
            }

            var valArray = bracket.teamList.split('\n');

            if (valArray.length != 4 && valArray.length != 8 && valArray.length != 16) {
                $scope.showError({
                    message: 'Make sure there is one seed per line and try again'
                });
                return;
            }

            if (bracket.randomSeeding) {
                valArray = $scope.knuthShuffle(valArray);
            }

            var seedCount = valArray.length;
            DataService.getEmptyBracketRounds()
                .then(function (rounds) {
                    DataService.getSeedList()
                        .then(function (seeds) {
                            $scope.populateAndSaveNewBracket(bracket, valArray, rounds, seeds);
                        })
                        .catch(function (err) {
                            console.log('error: ' + err);
                            $scope.showError(err);
                        })
                })
                .catch(function (err) {
                    console.log('error: ' + err);
                    $scope.showError({
                        message: 'Error with round retrieval'
                    });
                })
        }

        $scope.populateAndSaveNewBracket = function (bracket, teams, rounds, seeds) {
            if (!rounds || rounds.length == 0) {
                $scope.showError({
                    message: 'Something went wrong with round data retrieval'
                });
                return;
            }

            if (!seeds || seeds.length == 0) {
                $scope.showError({
                    message: 'Something went wrong with seed id retrieval'
                });
                return;
            }

            var seedWithTeams = {};

            angular.forEach(teams, function (value, key) {
                var seed = key + 1;
                var seedData = seeds[seed + 'seed'];
                var seedWithTeam = {
                    seedId: seedData.seedId,
                    positionId: seedData.positionId,
                    id: seed,
                    name: value
                };
                seedWithTeams[seedWithTeam.id + 'Seed'] = seedWithTeam;
            });

            bracket.rounds = {};
            bracket.rounds.round1 = rounds['1round'];
            bracket.rounds.champion = rounds.champion;

            if (bracket.format == "4") {
                var startingRound = bracket.rounds.round2;

                startingRound['A'].top = seedWithTeams['1Seed'];
                startingRound['A'].bottom = seedWithTeams['4Seed'];

                startingRound['B'].top = seedWithTeams['3Seed'];
                startingRound['B'].bottom = seedWithTeams['2Seed'];

                bracket.rounds.round2 = startingRound;
            } else if (bracket.format == "8") {
                var startingRound = bracket.rounds.round3;

                startingRound['A'].top = seedWithTeams['1Seed'];
                startingRound['A'].bottom = seedWithTeams['8Seed'];

                startingRound['B'].top = seedWithTeams['3Seed'];
                startingRound['B'].bottom = seedWithTeams['6Seed'];

                startingRound['C'].top = seedWithTeams['4Seed'];
                startingRound['C'].bottom = seedWithTeams['5Seed'];

                startingRound['C'].top = seedWithTeams['2Seed'];
                startingRound['C'].bottom = seedWithTeams['7Seed'];

                bracket.rounds.round2 = rounds['2round'];
                bracket.rounds.round3 = startingRound;
            } else {
                var startingRound = rounds['4round'];

                startingRound['A'].top = seedWithTeams['1Seed'];
                startingRound['A'].bottom = seedWithTeams['16Seed'];

                startingRound['B'].top = seedWithTeams['9Seed'];
                startingRound['B'].bottom = seedWithTeams['8Seed'];

                startingRound['C'].top = seedWithTeams['5Seed'];
                startingRound['C'].bottom = seedWithTeams['12Seed'];

                startingRound['D'].top = seedWithTeams['13Seed'];
                startingRound['D'].bottom = seedWithTeams['4Seed'];

                startingRound['E'].top = seedWithTeams['3Seed'];
                startingRound['E'].bottom = seedWithTeams['14Seed'];

                startingRound['F'].top = seedWithTeams['6Seed'];
                startingRound['F'].bottom = seedWithTeams['11Seed'];

                startingRound['G'].top = seedWithTeams['7Seed'];
                startingRound['G'].bottom = seedWithTeams['10Seed'];

                startingRound['H'].top = seedWithTeams['15Seed'];
                startingRound['H'].bottom = seedWithTeams['2Seed'];

                bracket.rounds.round2 = rounds['2round'];
                bracket.rounds.round3 = rounds['3round'];
                bracket.rounds.round4 = startingRound;
            }

            bracket.teams = seedWithTeams;

            DataService.createBracket(bracket)
                .then(function (response) {
                    $location.path("/bracket/" + bracket.id);
                })
                .catch(function (err) {
                    console.log('error: ' + err);
                    $scope.showError({
                        message: 'Error with adding bracket to backend'
                    });
                })
        }

        $scope.knuthShuffle = function (array) {
            var currentIndex = array.length,
                temporaryValue, randomIndex;

            while (0 !== currentIndex) {
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;

                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }

            return array;
        }
    }]);
