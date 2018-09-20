
// this seems like a good balance between a built-in flexible parser and a heavier external parser
// https://lowrey.me/parsing-a-csv-file-in-es6-javascript/
const regex = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
function parseCsvLine(line) {
	let arr = [];
	line.replace(regex, (m0, m1, m2, m3) => {
		if (m1 !== undefined) {
			arr.push(m1.replace(/\\'/g, "'"));
		} else if (m2 !== undefined) {
			arr.push(m2.replace(/\\"/g, "\""));
		} else if (m3 !== undefined) {
			arr.push(m3);
		}
		return "";
	});
	if (/,\s*$/.test(line)) {arr.push("");}
	return arr;
	
}

export function table(data, config) {
	return new Table(data, config);
}

export class Table {

	constructor(data, config) {
		debugger
		this._rows = [];
		this._headers = {};
		
		// first check if we have a string that might be delimited data
		if (data && typeof data == "string") {
			let rows = [];
			let format = config && "format" in config ? config.format : undefined;			
			data.split(/(\r\n|\r|\n)+/).forEach(line => {
				if ((format && format=="tsv") || line.indexOf("\t")>-1) {
					rows.push(line.split(/\t/))
				} else if ((format && format=="csv") || line.indexOf(",")>-1) {
					rows.push(parseCsvLine(line))
				}
			})
			data = rows;
		}

		if (data && typeof data == "array") {
			if (config) {
				if (typeof config == "array") {
					this.setHeaders(config);
				} else if (typeof config == "object") {
					if ("headers" in config) {
						this.setHeaders(config.headers)
					} else if ("hasHeaders" in config && config.hasHeaders) {
						this.setHeaders(data.shift())
					}
				}
			}
			this.addRows(data);
		} else if (data && typeof data == "object") {
			if ("headers" in data && typeof data.headers == "array") {
				this.setHeaders(data.headers);
			} else if ("hasHeaders" in data && "rows" in data) {
				this.setHeaders(data.rows.shift())
			}
			if ("rows" in data && typeof data.rows == "array") {
				this.addRows(data.rows)
			}
		}
	}
	
	addRows(data) {
		data.forEach(row => this.addRow(row), this);
	}
	
	addRow(data) {
		
		// we have multiple arguments, so call again as an array
		if (arguments.length>1) {
			this.addRow(arguments)
		}
		
		// we have a simple array, so we'll just push to the rows
		else if (typeof data == "array") {
			this._rows.push(data);
		}
		
		// we have an object so we'll use the headers
		else if (typeof data == "object") {
			let row = []
			for (column in data) {
				if (!(column in this.headers)) {
					this.headers[column] = this.headers.length;
				}
				row[this.headers[column]] = data[column];
			}
			this._rows.push(row);
		}
		
		else { // hopefully some scalar value
			this._rows.push([data])
		}
	}
	
	rows() {
		return this._rows.length;
	}
	
	static create(config, data) {
		return new Table(config, data);
	}
}
