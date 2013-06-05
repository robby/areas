var fs = require('fs'), path = require('path'), methods = require('methods');

exports.register = function(app) {
	exports.app = app;

	loadRoutes();
};

exports.create = function(basePath, middleware) {
	return area(basePath, middleware);
}

function area(basePath, middleware) {
	var routeMethods = {};

	for(var key in methods) {
		routeMethods[methods[key]] = routeMethod(methods[key], basePath, middleware);
	}
	
	return routeMethods;
}

function routeMethod(methodType, basePath, middleware) {
	return function(url, handler){
		console.log('adding route ' + basePath + url);
		exports.app[methodType](basePath + url, middleware, handler);
	};
}

function loadRoutes(folder){
	if (!folder){
		folder = path.dirname(require.main.filename) + '/areas/';
	}

	fs.readdir(folder, function(err, files){
		if(err) {
			console.warn('unable to load areas');
			return;
		}

		files.forEach(function(file){
			fs.stat(folder + file, function(err, stat){
				if (stat && stat.isDirectory()){
					loadRoutes(folder + '/' + file + '/');
				} else {
					var dot = file.lastIndexOf('.');
					if (file.substr(dot + 1) === 'js'){
						var name = file.substr(0, dot);

						require(folder + name);
					}
				}
			});
		});
	});
}
