var IntroControllers = angular.module("IntroControllers", ["ngCookies"]);



IntroControllers.controller("HomePageCtrl", ["$scope", "$http", "$location", "$cookies", function($scope, $http, $location, $cookies) {
	$scope.LoginFailure = false;
	$scope.performLogin = function() {
		$http.post("/login", $scope.Login).success(function (data) {
			//login success
			if(data) {
				$scope.Login = null;
				$scope.LoginFailure = false;
				$cookies.username = data; //set cookie for login user
				$location.path("/users/" + data);
			}

			//login fails
			else {
				$scope.LoginFailure = true;
			}
		});
	}

	$scope.performSignUp = function() {
		$http.post("/signup", $scope.SignUp).success(function (data) {
			console.log(data);
			$scope.SignUp = null;
		});
	}
}]);






IntroControllers.controller("ExcelContentCtrl", ["$scope", "$routeParams", "XLSX", "$cookies", "$location", function($scope, $routeParams, XLSX, $cookies, $location) {
	$scope.documentName = $routeParams.documentName;
	$scope.username = $cookies.username;

	var fileExtensionIndex = $scope.documentName.indexOf(".xlsx");
	if($scope.documentName.indexOf(".xlsx") !== -1) {
		$scope.documentName = $scope.documentName.slice(0,fileExtensionIndex);
	}

	var desiredPath = $location.path();
	var actualPath = "/users/" + $scope.username + "/" + $routeParams.visibility + "/" + $scope.documentName + ".xlsx";

	if($routeParams.visibility==="private" && desiredPath!==actualPath) {
		$location.url("/users/" + $scope.username);
	}

	XLSX.readExcelFile($routeParams.username, $routeParams.visibility, $scope.documentName).success(function(content) {
		var resultArry = content.data;
		if(resultArry){
			$scope.fields = resultArry.shift();
			$scope.people = resultArry;
		}
		//console.log($scope.fields);
	});

	$scope.currentEdit = {}; //Controls which info block is currenly under editing
	$scope.swithInfoEdit = function(parentIndex, index) {
		if($scope.currentEdit.p==parentIndex && $scope.currentEdit.i==index) {
			$scope.currentEdit = {};
		}

		else{
			$scope.currentEdit.p = parentIndex;
			$scope.currentEdit.i = index;
		}
		
		console.log($scope.currentEdit);
	}

	$scope.updateInfoValue = function(updateInfoValue) {
		$scope.people[$scope.currentEdit.p][$scope.currentEdit.i] = updateInfoValue;
		$scope.currentEdit = {};
	}
}]);







IntroControllers.controller("UploadPanelCtrl", ["$scope", "$location", "XLSX", "$cookies", "$http", "$routeParams", function($scope, $location, XLSX, $cookies, $http, $routeParams) {
	var desiredPath = $location.path();
	$scope.username = desiredPath.substring(desiredPath.lastIndexOf("/")+1, desiredPath.length);
	var actualPath = "/users/" + $cookies.username;
	//block undefined users, ends the logics right away
	if( ($cookies.username === undefined) || (desiredPath !== actualPath) ) {
		$scope.visitor = true;
	}

	XLSX.readExcelFolder($routeParams.username).success(function(content) {
		$scope.myPrivateFiles = content.privateFiles;
		$scope.myPublicFiles = content.publicFiles;
		//console.log(content);
	});

	var inputField = document.getElementById("excelFileInputField");
	var formData = new FormData();

	$scope.location = $location;

	angular.element(inputField).on("change", function() {
		$scope.$apply(function () {
			$scope.chosenFiles = _.toArray(inputField.files);
		});
		//console.log($scope.chosenFiles);
	});

	$scope.removeChosenFile = function(index) {
		$scope.chosenFiles.splice(index,1);
	}

	$scope.uploadExcelFile = function() {
		for(var i=0; i<$scope.chosenFiles.length; i++) {
			formData.append("files", $scope.chosenFiles[i]);
			$scope.myPrivateFiles.push($scope.chosenFiles[i].name);
		}
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "/users/" + $scope.username + "/private/", true);
       	xhr.send(formData);


       	$scope.chosenFiles.length = 0;
	}

	$scope.shareExcelFile = function(index) {
		var chosenFilename = $scope.myPrivateFiles[index];
		$http.post("/shareExcel", {username: $cookies.username, filename: chosenFilename}).success(function(data) {
			$scope.myPrivateFiles.splice(index,1);
			$scope.myPublicFiles.push(chosenFilename);
		});
	}

	$scope.unshareExcelFile = function(index) {
		var chosenFilename = $scope.myPublicFiles[index];
		$http.post("/unshareExcel", {username: $cookies.username, filename: chosenFilename}).success(function(data) {
			$scope.myPublicFiles.splice(index,1);
			$scope.myPrivateFiles.push(chosenFilename);
		});
	}
}]);
