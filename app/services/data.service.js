'use strict';

angular.module('brackEm')
    .factory('DataService', function ($firebaseArray, $firebaseObject, $q) {
        var dataService = {};

        dataService.getBracketList = function () {
            var uid = firebase.auth().currentUser == null ? 0 : firebase.auth().currentUser.uid;
            var deferred = $q.defer();
            var brackets = firebase.database().ref('brackets').orderByChild('createdBy').equalTo(uid);
            var list = $firebaseArray(brackets);
            list.$loaded().then(function (bracketList) {
                deferred.resolve(bracketList);
            });
            return deferred.promise;
        };

        dataService.getBracket = function (bracketId) {
            var deferred = $q.defer();
            var bracket = firebase.database().ref('brackets/' + bracketId);
            var obj = $firebaseObject(bracket);
            obj.$loaded().then(function () {
                deferred.resolve(obj);
            });
            return deferred.promise;
        }

        dataService.createBracket = function (bracket) {
            bracket.createdOn = new Date();
            bracket.createdBy = firebase.auth().currentUser.uid;
            bracket.createdByDisplay = firebase.auth().currentUser.displayName;

            var newPostKey = firebase.database().ref().child('brackets').push().key;
            bracket.id = newPostKey;
            var updates = {};
            updates['/brackets/' + newPostKey] = bracket;
            return firebase.database().ref().update(updates);
        }

        dataService.getFeaturedBracket = function () {
            var deferred = $q.defer();
            var bracket = firebase.database().ref('featured/bracket');
            var obj = $firebaseObject(bracket);
            obj.$loaded().then(function () {
                deferred.resolve(obj);
            });
            return deferred.promise;
        }

        dataService.setFeaturedBracket = function (bracket) {
            delete bracket.$id;
            delete bracket.$priority;
            delete bracket.$$hashKey;

            var updates = {};
            updates['/featured/bracket'] = bracket;
            return firebase.database().ref().update(updates);
        }

        dataService.getEmptyBracketRounds = function () {
            var deferred = $q.defer();
            var rounds = firebase.database().ref('roundList');
            var fbArray = $firebaseObject(rounds);
            fbArray.$loaded().then(function (list) {
                deferred.resolve(list);
            });
            return deferred.promise;
        }

        dataService.getSeedList = function () {
            var deferred = $q.defer();
            var seeds = firebase.database().ref('seedIdList');
            var fbArray = $firebaseObject(seeds);
            fbArray.$loaded().then(function (list) {
                deferred.resolve(list);
            });
            return deferred.promise;
        }

        return dataService;
    });
