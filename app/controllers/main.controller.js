'use strict';

angular.module('brackEm')
    .controller('MainController', function ($scope, $firebaseAuth, $timeout, $location) {
        $scope.currentUser = null;
        $scope.doneLoading = false;
        $scope.activeTab = $location.path();

        $scope.setCurrentUser = function (user) {
            $scope.currentUser = user;
        }

        firebase.auth().onAuthStateChanged(function (user) {
            $scope.setCurrentUser(user);
        });

        $scope.showError = function (error) {
            $scope.errorVisible = true;
            if (error.code) {
                $scope.errorText = error.code + ": " + error.message;
            } else {
                $scope.errorText = error.message;
            }
        }

        $scope.showInfo = function (message) {
            $scope.infoVisible = true;
            $scope.infoText = message;
        }

        $scope.showSuccess = function (message) {
            $scope.successVisible = true;
            $scope.successText = message;
        }

        $scope.switchBool = function (alertName) {
            $scope[alertName] = !$scope[alertName];
        }

        $scope.refreshUser = function () {
            console.log(JSON.stringify($scope.currentUser));
        }

        $scope.isActiveTab = function (tabName) {
            return $scope.activeTab == tabName;
        }

        $scope.navBarClick = function (activeTab) {
            $scope.activeTab = activeTab;
        }

        $scope.emailLogin = function (email, pass) {
            firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
                $scope.showError(error);
            });

            $location.path("/home");
        }

        $scope.googleLogin = function () {
            var provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithPopup(provider).then(function (result) {
                $scope.setCurrentUser(result.user);
                $scope.apiToken = result.credential.accessToken;
                $location.path("/home");
            }).catch(function (error) {
                $scope.showError(error);
            });
        }

        $scope.facebookSignIn = function () {
            var provider = new firebase.auth.FacebookAuthProvider();
            firebase.auth().signInWithPopup(provider).then(function (result) {
                $scope.setCurrentUser(result.user);
                $scope.apiToken = result.credential.accessToken;
                $location.path("/home");
            }).catch(function (error) {
                $scope.showError(error);
            });
        };

        $scope.twitterSignIn = function () {
            var provider = new firebase.auth.TwitterAuthProvider();
            firebase.auth().signInWithPopup(provider).then(function (result) {
                $scope.setCurrentUser(result.user);
                $scope.apiToken = result.credential.accessToken;
                $location.path("/home");
            }).catch(function (error) {
                $scope.showError(error);
            });
        };

        $scope.resetPassword = function () {
            $scope.authObj.$resetPassword({
                email: "my@email.com"
            }).then(function () {
                $scope.showInfo("Password reset email sent");
            }).catch(function (error) {
                $scope.showError(error);
            });
        }

        $scope.signOut = function () {
            firebase.auth().signOut().then(function () {
                $scope.setCurrentUser(null);
                $location.path("/signIn");
            }).catch(function (error) {
                $scope.showError(error);
            });
        }

        $scope.createAccount = function (email, password) {
            firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
                $scope.showError(error);
            });
            $location.path("/home");
        }

        $timeout(function () {
            $scope.doneLoading = true;
            if ($scope.currentUser == null) {
                $scope.activeTab = '';
                $location.path("/signIn");
            }
            $("#body").css("overflow", "scroll");
        }, 2000);
    });
