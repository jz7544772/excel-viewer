// declare modules
var express = require("express"),
    fs = require("fs"),
    path = require("path"),
    xlsx = require("node-xlsx"),
    multer = require("multer"),
    bodyParser = require('body-parser');

// declare express app
var app = express();

// middleware
app.use(bodyParser.json());

app.use(multer({
	rename: function (fieldname, filename, req, res) {
		return filename;
	},
	changeDest: function(dest, req, res) {
		// var desiredPath = req.path.substring(0, req.path.indexOf("\\uploadExcel\\"));
		return __dirname + req.path;
	}
}));

app.use(express.static(__dirname + "/"));

// routes
//For HomePage.html==========================================================
app.get("/", function(req, res) {
	res.sendFile(__dirname+"/index.html");
});

app.post("/login", function(req, res) {
	fs.readFile(path.join(__dirname,"users", req.body.username, "info.json"), function(err, data) {
		if(err) {
			res.send();
			console.log(err);
			return;
		}

		var userInfoObj = JSON.parse(data);
		if(req.body.username==userInfoObj.username && req.body.password===userInfoObj.password) {
			console.log("login success");
			res.send(userInfoObj.username);
		}
		else{
			console.log("login fail");
			res.send();
		}
	});
});

app.post("/signup", function(req, res) {
	console.log(req.body);
	fs.mkdirSync(path.join(__dirname,"users", req.body.username));
	fs.mkdirSync(path.join(__dirname,"users", req.body.username, "public"));
	fs.mkdirSync(path.join(__dirname,"users", req.body.username, "private"));
	fs.writeFile(path.join(__dirname,"users", req.body.username, "info.json"), JSON.stringify(req.body), function(err) {
		if(err) throw err;
		console.log("Saved file .../%s/info.json", req.body.username);
	});
	res.send("sign up succuess");
});
//For HomePage.html==========================================================




//For UploadPanel.html=======================================================
app.get("/users/:username", function(req, res) {
	res.sendFile(__dirname+"/index.html");
});

app.get("/users/:username/getFolderContent", function(req, res) {
	
	var privates = fs.readdirSync(path.join(__dirname, "users", req.params.username, "private"));
	var publics = fs.readdirSync(path.join(__dirname, "users", req.params.username, "public"));
	res.json({
		privateFiles: privates,
		publicFiles: publics
	});

	res.end();
});

// app.post("/uploadExcel", function(req, res) {
	//res.end(req.body.username);
	//console.log(req.body.username);
	// console.log(req.files);
// });

app.post("/shareExcel", function(req, res) {
	var username = req.body.username;
	var filename = req.body.filename;

	var oldPath = path.join(__dirname, "users", username, "private", filename);
	var newPath = path.join(__dirname, "users", username, "public", filename);

	fs.rename(oldPath, newPath, function(err) {
		if(err) throw err;
		res.send("file share successful");
	});
});

app.post("/unshareExcel", function(req, res) {
	var username = req.body.username;
	var filename = req.body.filename;

	var oldPath = path.join(__dirname, "users", username, "public", filename);
	var newPath = path.join(__dirname, "users", username, "private", filename);
	

	fs.rename(oldPath, newPath, function(err) {
		if(err) throw err;
		res.send("file unshare successful");
	});
});
//For UploadPanel.html========================================================




//For ExcelContent.html=======================================================
app.get("/users/:username/:visibility/:fileName", function(req, res) {
	res.sendFile(__dirname+"/index.html");
	//console.log(req.path);
});

app.get("/users/:username/:visibility/:fileName/getContent", function(req, res) {
	var filePath = path.join(__dirname, "users", req.params.username, req.params.visibility, req.params.fileName+".xlsx");
	// read from a excel file
	try{
		var xlsxFileObj = xlsx.parse(filePath)[0];
	}

	catch(err){
		res.end("file not found at " + filePath);
		console.log(err);
		return;
	}
	res.json(xlsxFileObj);
});
//For ExcelContent.html=======================================================



// set up server
var server = app.listen(8000, function() {
	console.log("Server is listening on port %d", server.address().port);
});






