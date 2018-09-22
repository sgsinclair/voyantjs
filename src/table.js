
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
		this._rows = [];
		this._headers = {};
		this._rowKeyColumnIndex = 0;
		
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
			if ("rowKeyColumn" in data) {
				if (typeof data.rowKeyColumn == "number") {
					if (data.rowKeyColumn < this._headers.length) {
						this._rowKeyColumnIndex = data.rowKeyColumn;
					} else {
						throw "The rowKeyColumn value is higher than the number headers designated: "+data.rowKeyColum;
					}
				} else if (tyepof data.rowKeyColumn == "string") {
					if (data.rowKeyColumn in this._headers) {
						this._rowKeyColumnIndex = this._headers[data.rowKeyColumn];
					} else {
						throw "Unable to find column designated by rowKeyColumn: "+data.rowKeyColumn;
					}
				}
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

		this.setRow(this.rows(), data, true);
	}
	
	setRow(ind, data, create) {
		let rowIndex = this.getRowIndex(ind);
		if (ind>=this.rows() && !create) {
			throw "Attempt to set row values for a row that does note exist: "+ind+". Maybe use addRow() instead?";
		}
		
		
		// we have a simple array, so we'll just push to the rows
		else if (typeof data == "array") {
			if (data.length>this.headers() {
				if (create) {
					for (let i = this.headers(); i<data.length; i++) {
						this.addColumn();
					}
				} else {
					throw "The row that you've created contains more columns than the current table. Maybe use addColunm() first?"
				}
			}
			data.forEach((d,i) => this.setCell(ind, i, d), this);
		}
		
		// we have an object so we'll use the headers
		else if (typeof data == "object") {
			for (column in data) {
				if (!this.hasColumn(column)) {
				}
				this.setCell(rowIndex, column, data[column]);
			}
		}
		
		else { // hopefully some scalar value
			throw "setRow() expects an array or an object, maybe setCell()?"
		}
		
		return this;

	}

	
	
	updateCell(row, column, value, overwrite) {
		let rowIndex = this.getRowIndex(row, true);
		let columnIndex = this.getColumnIndex(column, true);
		let val = this.getCell(rowIndex, columnIndex);
		this.rows[rowIndex][columnIndex] = val && !overwrite ? val+value : value;
	}
	
	setCell(row, column, value) {
		this.updateCell(row,column,value,true);
	}
		
	getRowIndex(ind, create) {
		if (typeof ind == "number") {
			if (ind < this._rows.length) {
				return ind;
			} else if (create) {
				this._rows[ind] = [];
				return ind;
			}
			throw "The requested row does not exist: "+ind
		} else if (typeof ind == "string") {
			if (ind in this._headers) {
				let i = this._rowKeyIndex || 0;
				let row = this._rows.findIndex(r = r[i] === ind);
				if (row) {return row;}
				throw "Unable to find the row named "+ind;
			} else if (create) {
				let arr = [];
				arr[this._rowKeyIndex] = ind;
				this._rows.push(arr);
				return this._rows.length-1;
			}
			throw "Unable to find row named "+ind;
		}
		throw "Please provide a valid row (number or named row)";
	}
	
	getColumnIndex(ind, create) {
		if (typeof ind == "number") {
			if (ind < this._headers.length) {
				return ind;
			} else if (create) {
				this.addColumn(ind)
				return ind;
			}
			throw "The requested column does not exist: "+ind
		} else if (typeof ind == "string") {
			if (ind in this._headers) {
				return this._headers[ind];
			} else if (create) {
				this.addColumn({header: ind});
				return this._headers[ind];
			}
			throw "Unable to find column named "+ind;
		}
		throw "Please provide a valid column (number or named column)";
	}
	
	addColumn(config, ind) {
	
		// determine col
		let col = config && ("header" in config) ? config.header : String(ind ? ind : this._headers.length);
		if (col in this._headers) {
			throw "This column exists already: "+config.header
		}
		let colIndex = this.getColumnIndex(col, true);
		let data = config && ("rows" in config) ? config.rows : (typeof config == "array" ? config : []);
		
		// add data to each row
		this._rows.forEach((r,i) => r[colIndex] = data[i])
	}
	
	/**
	 * This function returns different values depending on the arguments provided.
	 * When there are no arguments, it returns the number of rows in this table.
	 * When the first argument is the boolean value `true` all rows are returned.
	 * When the first argument is a number a slice of the rows is returned and if
	 * the second argument is a number it is treated as the length of the slice to
	 * return (note that it isn't the `end` index like with Array.slice()).
	 */
	rows(start, length) {
		if (start) {
			if (typeof start === "boolean" && start) {
				return this._rows;
			}
			if (typeof start === "number") {
				return this._rows.slice(start, length && typeof length === "number" ? start+length : undefined);
			}
		}
		return this._rows.length;
	}
	
	row(ind, asObj) {
		let row = this._rows[this.getRowIndex(ind)];
		if (asObj) {
			let obj = {};
			for (let key in this._headers) {
				obj[key] = row[this._headers[key]]
			}
			return obj;
		} else {
			return row;
		}
	}
	
	column(ind, asObj) {
		let column = this.getColumnIndex(ind);
		let data = this._rows.forEach(r => r[column]);
		if (asObj) {
			let obj = {};
			this._rows.forEach(r => {
				obj[r[this._rowKeyColumnIndex]] = r[column];
			})
			return obj;
		} else {
			return this._rows.map(r => r[column]);
		}
	}
	
	forEach(fn) {
		this._rows.forEach((r,i) => fn(r,i));
	}
	
	rowMin(ind) {
		Math.min.apply(null, this.row(ind));
	}
	
	rowMax(ind) {
		Math.max.apply(null, this.row(ind));
	}
	
	columnMin(ind) {
		Math.min.apply(null, this.column(ind));
	}
	
	columnMax(ind) {
		Math.max.apply(null, this.column(ind));
	}
	
	rowSum(ind) {
		sum(this.row(ind));
	}
	
	columnSum(ind) {
		sum(this.column(ind));
	}

	rowMean(ind) {
		return mean(this.row(ind));
	}
	
	columnMean(ind) {
		return mean(this.column(ind));
	}
	
	rowRollingMean(ind, neighbors, overwrite) {
		let means = rollingMean(this.row(ind), neighbors);
		if (overwrite) {
			this.setRow(ind, means);
		}
		return means;
	}
	
	columnRollingMean(ind, neighbors) {
		return rollingMean(this.column(ind), neighbors);
	}
	
	rowVariance(ind) {
		return variance(this.row(ind));
	}
	
	columnVariance(ind) {
		return variance(this.column(ind));
	}
	
	rowStandardDeviation(ind) {
		return standardDeviation(this.row(ind));
	}
	
	columnStandardDeviation(ind) {
		return standardDeviation(this.column(ind));
	}
	
	rowZScores(ind) {
		return zScores(this.row(ind));
	}
	
	columnZScores(ind) {
		return zScores(this.column(ind));
	}
	
	static create(config, data) {
		return new Table(config, data);
	}
}

function sum(data) {
	return data.reduce((a,b) => a+b, 0);
}

function mean(data) {
	return sum(data) / data.length;
}

function rollingMean(data, neighbors) {
	// https://stackoverflow.com/questions/41386083/plot-rolling-moving-average-in-d3-js-v4/41388581#41387286
	return data.map((val, idx, arr) => {
		let start = Math.max(0, idx - neighbors), end = idx + neighbors
		let subset = arr.slice(start, end + 1)
		let sum = subset.reduce((a,b) => a + b)
		return sum / subset.length
	});
}

function variance(data) {
	let m = mean(data);
	return mean(data.map(num => Math.pow(num-m, 2)));
}

function standardDeviation(data) {
	return Math.sqrt(variance(data));
}

function zScores(data) {
	let m = mean(data);
	let s = standardDeviation(data);
	return data.map(num => (num-m) / s);
}
