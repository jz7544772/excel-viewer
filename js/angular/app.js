var IntroApp = angular.module("IntroApp", ["ngRoute", "IntroControllers", "IntroServices", "IntroDirectives"]);

IntroApp.config(["$routeProvider", "$locationProvider", function($routeProvider, $locationProvider) {
	$routeProvider
	.when("/", {
		templateUrl: "/partials/HomePage.html",
		controller: "HomePageCtrl"
	})
	.when("/users/:username/:visibility/:documentName", {
		templateUrl: "/partials/ExcelContent.html",
		controller: "ExcelContentCtrl"
	})
	.when("/users/:username", {
		templateUrl: "/partials/UploadPanel.html",
		controller: "UploadPanelCtrl"
	})
	.otherwise({
        redirectTo: '/'
     });

	$locationProvider.html5Mode({enabled: true, requireBase: false});
}]);