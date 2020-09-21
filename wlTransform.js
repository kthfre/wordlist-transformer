const fs = require('fs');

(function run(arg, hand) {
		let parameterPattern = /^\s*(--output\s+[a-zA-Z0-9\._/-]+\s*|--file\s+[a-zA-Z0-9\._/-]+\s*|--prepend\s+[^\n]+|--append\s+[^\n]+|--split\s*|--filter\s*){1,6}\s*$/;
		let params = {inData: "", outData: "", options: ""};

		for (let i = 2; i < arg.length; i++) {
			params.options += arg[i] + " ";
		}

		params.options = params.options.slice(0, params.options.length - 1);
console.log(parameterPattern.exec(params.options)[0])
		if (!parameterPattern.test(params.options)) {
			console.error("Hablas no espanol. Ingles, por favor.");
			return;
		}

		params.inData = hand().read(params);

		if (params.options.indexOf("split") !== -1) {
			hand().split(params);
		}

		if (params.options.indexOf("filter") !== -1) {
			hand().filter(params);
		}

		if (params.options.indexOf("prepend") !== -1) {
			hand().prepend(params);
		}


		if (params.options.indexOf("append") !== -1) {
			hand().append(params);
		}

        hand().write(params);


})(process.argv, handler)

 function handler() {
	let h = {};

	h.split = function(params) {
		let pattern = /(([^:]*):([^:]*)\n)/;
		let index = 0;
		let res = "";

		while (pattern.test(params.inData.slice(index))) {
			res = pattern.exec(params.inData.slice(index))

			params.outData += res[2] + '\n' + res[3] + '\n';
			index += res[0].length;
		}
	}

	h.filter = function(params) {
		let pattern = /([^\n]+)\n/;
		let exists = [];
		let index = 0;
		let res = "";

		while (pattern.test(params.outData.slice(index))) {
			res = pattern.exec(params.outData.slice(index));

			if (exists.indexOf(res[1]) === -1) {
				exists.push(res[1]);
			}

			index += res[0].length;
		}

		params.outData = "";

		for (let i = 0; i < exists.length; i++) {
			params.outData += exists[i] + '\n';
		}
	}

	h.prepend = function(params, add) {
		this.pend(params, 'pre');
	}

	h.append = function(params, add) {
		this.pend(params, 'ap');
	}

	h.pend = function(params, type) {
		let pattern = /([^\n]+)\n/;
		let list = [];
		let index = 0;
		let res = "";
		let partRes = "";

		while (pattern.test(params.outData.slice(index))) {
			res = pattern.exec(params.outData.slice(index));

			if (list.indexOf(res[1]) === -1) {
				list.push(res[1]);
			}

			index += res[0].length;
		}

		params.outData = "";

		if (type === 'pre') {
			let part = /--prepend\s+([^\n\s]+)/;

			partRes = part.exec(params.options);

			for (let i = 0; i < list.length; i++) {
				params.outData += partRes[1] + list[i] + '\n';
			}
		} else if (type === 'ap') {
			let part = /--append\s+([^\n\s]+)/;
			
			partRes = part.exec(params.options);

			for (let i = 0; i < list.length; i++) {
				params.outData += list[i] + partRes[1] + '\n';
			}
		}

	}

	h.write = function(params) {
		let pattern = /--output\s+([a-zA-Z0-9\._/-]+)\s*/;
		let res = pattern.exec(params.options);
		let output = "";

		if (!res) {
			if (params.file.lastIndexOf("/") !== -1) {
				let last = params.file.lastIndexOf(".");

				if (params.file.lastIndexOf("/") < last) {
					output = params.file.slice(0, last) + "_output" + params.file.slice(last);
				} else {
					output = params.file + "_output";
				}
			} else {
				let last = params.file.lastIndexOf(".");

				if (last !== -1) {
					output = params.file.slice(0, last) + "_output" + params.file.slice(last);
				} else {
					output = params.file + "_output";
				}
			}
		}

        fs.writeFile(output, params.outData, function(e) {
        	e ? console.error("That's a no can do; " + e.message) : console.log("File saved successfully.");
        });
	}

	h.read = function(params) {
		let pattern = /--file\s+([a-zA-Z0-9\._/-]+)\s*/;
		let res = pattern.exec(params.options);
		params.file = res[1];

		return fs.readFileSync(params.file, 'utf8')
	}

	return h;
}