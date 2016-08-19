var IntroServices = angular.module("IntroServices", []);

IntroServices.factory("XLSX", ["$http", function($http) {
	return {
		readExcelFile: function(username, visibility, fileName) {
			return $http.get("/users/" + username + "/" + visibility + "/" + fileName + "/getContent/");
		},

		readExcelFolder: function(username) {
			return $http.get("/users/" + username + "/getFolderContent");
		}
	}
}]);