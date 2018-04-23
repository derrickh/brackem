'use strict';

var brackEm = angular.module('brackEm', ['ngRoute', 'firebase', 'smart-table']);

brackEm.directive('fullscreenDialog', function () {
    return {
        controller: 'MainController',
        restrict: 'E',
        replace: true,
        transclude: true,
        template: '<div class="dialog-container"><ng-transclude></ng-transclude></div>'
    }
});

brackEm.directive('ngConfirmClick', [
        function () {
        return {
            link: function (scope, element, attr) {
                var msg = attr.ngConfirmClick || "Are you sure?";
                var clickAction = attr.confirmedClick;
                element.bind('click', function (event) {
                    if (window.confirm(msg)) {
                        scope.$eval(clickAction)
                    }
                });
            }
        };
    }
]);

brackEm.config(function ($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix('');

    $routeProvider
        .when('/home', {
            templateUrl: 'views/home.view.html',
            controller: 'HomeController'
        })
        .when('/brackets', {
            templateUrl: 'views/bracket-list.view.html',
            controller: 'BracketListController'
        })
        .when('/search', {
            templateUrl: 'views/search.view.html',
            controller: 'SearchController'
        })
        .when('/profile', {
            templateUrl: 'views/profile.view.html',
            controller: 'ProfileController'
        })
        .when('/signIn', {
            templateUrl: 'views/sign-in.view.html',
            controller: 'SignInController'
        })
        .when('/signUp', {
            templateUrl: 'views/sign-up.view.html',
            controller: 'SignUpController'
        })
        .when('/loading', {
            templateUrl: 'views/loading.view.html',
            controller: 'MainController'
        })
        .when('/bracket/:bracketId', {
            template: function (params) {
                return '<bracket bracket-id="' + params.bracketId + '"></bracket>';
            }
        })
        .when('/create', {
            templateUrl: 'views/create.view.html',
            controller: 'CreateController'
        })
        .otherwise({
            redirectTo: '/home'
        });
});
