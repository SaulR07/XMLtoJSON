const http = require("http");
const fs = require("fs");

//Dependencia para gestionar el archivo
const formidable = require("formidable");

var parseString = require("xml2js").parseString;

const hostname = "127.0.0.1";
const port = 3000;

const server = http.createServer((req, res) => {
	if (req.url == "/") {
		fs.readFile("views/index.html", (error, page) => {
			if (error) {
				res.statusCode = 404;
				res.writeHead(404);
				res.write("Page not found");
			} else {
				res.statusCode = 200;
				res.writeHead(200, {"Content-Type": "text/html"});
				res.write(page);
			}
			res.end();
		});
	} else if (req.url == "/upload" && req.method.toLowerCase() === "post") {
		var form = new formidable.IncomingForm();
		form.parse(req, (error, fields, files) => {
			res.write("File uploaded");
			read(files.file[0].filepath);
			res.end();
		});
	}
});

function read(filePath) {
	const readableStream = fs.createReadStream(filePath, "utf8");

	readableStream.on("error", function (error) {
		console.log(`error: ${error.message}`);
	});

	readableStream.on("data", (chunk) => {
		console.log(chunk);
		parseString(chunk, function (err, result) {
			console.dir(result);
		});
	});
}

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});
