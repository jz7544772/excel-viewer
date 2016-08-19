var IntroDirectives = angular.module("IntroDirectives", []);

// IntroDirectives.directive("ngUpload", function() {
// 	return {
// 		restrict: "A",
// 		link: function(scope, element, attr) {
// 			var inputField = $(element).find("input");
// 			var previewWrapper = $(element).find("#filePreveiwWrapper");
// 			var chosenFiles;
// 			var formData = new FormData();

// 			$(inputField).on("change", function() {
// 				chosenFiles = $(inputField).prop("files");
// 				for(var i=0; i<chosenFiles.length; i++) {
// 					formData.append("file", chosenFiles[i]);
// 				}

// 				scope.$apply(function () {
// 					scope.chosenFiles = chosenFiles;
// 				});
// 			});

// 			scope.uploadExcelFile = function(){
// 				var xhr = new XMLHttpRequest();
// 				alert("OK");
// 			}
// 		}
// 	}
// });