var fs = require("fs");

function writeCommand(cmd) {
	return new Promise(function (resolve, reject) {
		var buffer = new Buffer(cmd + "\n");
		var fd = fs.open("/dev/pi-blaster", "w", undefined, function(err, fd) {
			if (err) {
				reject(err);
			} else {
				fs.write(fd, buffer, 0, buffer.length, -1, function(error, written, buffer) {
					if (error) {
						reject(error);
					} else {
						fs.close(fd);
						resolve();
					}
				});
			}
		});
	});
}

function setPwm(gpio, value) {
	return new Promise(function (resolve, reject) {
		writeCommand(gpio + "=" + value).then(function () {
			console.log("GPIO " + gpio + " was set to " + value);
			resolve();
		});
	});
}

function releasePwm(gpio) {
	return new Promise(function (resolve, reject) {
		writeCommand("release " + gpio).then(function () {
			console.log("GPIO " + gpio + " was released")
			resolve();
		});
	});
}

for (var i = 0.01; i <= 0.3; i += 0.01) {
	(() => {
		var value = parseInt(i * 100) / 100;
		setTimeout(() => {
			setPwm(4, value);
		}, value * 20000);
	})();
}

setTimeout(function () {
	releasePwm(4);
}, 10000);