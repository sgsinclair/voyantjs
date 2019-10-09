import * as Table from '../src/table';

import * as Mocks from './mocks/table';

const words = ["one", "two", "two", "three", "three", "three"];
const numbers = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [10, 11, 12, 13, 14, 15, 16, 17, 18, 19]];

beforeAll(() => {
})

beforeEach(() => {
	fetch.resetMocks()
})

test('empty table', () => {
	const table = Table.create();
	expect(table.rows()).toBe(0);
	expect(table.columns()).toBe(0);
	expect(() => {
		table.cell(0, 0)
	}).toThrow();
})

test('single value', () => {
	const table = Table.create(1);
	expect(table.rows()).toBe(1);
	expect(table.columns()).toBe(1);
	expect(table.cell(0, 0)).toBe(1);
})

test('multiple values', () => {
	const table = Table.create(1, 2);
	expect(table.rows()).toBe(2);
	expect(table.columns()).toBe(1);
	expect(table.cell(0, 0)).toBe(1);
})

test('multiple values including boolean', () => {
	const table = Table.create(1, 2, true);
	expect(table.rows()).toBe(3);
	expect(table.columns()).toBe(1);
	expect(table.cell(2, 0)).toBe(true);
})

test('config and multiple values', () => {
	const table = Table.create({ headers: ["val"] }, 1, 2, true);
	expect(table.rows()).toBe(3);
	expect(table.columns()).toBe(1);
	expect(table.cell(2, 0)).toBe(true);
})

test('config and multiple values including boolean', () => {
	const table = Table.create({ headers: ["ind", "val"] }, [0, 1], [1, 2], [2, true]);
	expect(table.rows()).toBe(3);
	expect(table.columns()).toBe(2);
	expect(table.cell(2, 1)).toBe(true);
})

test('single array', () => {
	const table = Table.create([1]);
	expect(table.rows()).toBe(1);
	expect(table.columns()).toBe(1);
	expect(table.cell(0, 0)).toBe(1);
})

test('single array with multiple values', () => {
	const table = Table.create([1, 2]);
	expect(table.rows()).toBe(2);
	expect(table.columns()).toBe(1);
	expect(table.cell(0, 0)).toBe(1);
})

test('double array', () => {
	const table = Table.create([[1, 2], [3, 4]]);
	expect(table.rows()).toBe(2);
	expect(table.columns()).toBe(2);
	expect(table.cell(1, 1)).toBe(4);
})

test('single array of strings', () => {
	const table = Table.create(words);
	expect(table.rows()).toBe(6);
	expect(table.columns()).toBe(1);
	expect(table.cell(2, 0)).toBe("two");
})

test('single array to be counted', () => {
	const table = Table.create(words, { count: true });
	expect(table.rows()).toBe(1);
	expect(table.columns()).toBe(3);
	expect(table.cell(0, "two")).toBe(2);
	table.rowSort(); // unchanged
	expect(table.rows()).toBe(1);
	expect(table.columns()).toBe(3);
	expect(table.cell(0, "two")).toBe(2);
	table.rowSort(1); // unchanged
	expect(table.rows()).toBe(1);
	expect(table.columns()).toBe(3);
	expect(table.cell(0, "two")).toBe(2);

	table.columnSort(); // sort by alphabetic order
	expect(table.rows()).toBe(1);
	expect(table.columns()).toBe(3);
	expect(table.cell(0, 0)).toBe(1);
	expect(table.cell(0, 1)).toBe(3);
	expect(table.cell(0, 2)).toBe(2);
	table.setColumn("four", 4, true);
	expect(table.rows()).toBe(1);
	expect(table.columns()).toBe(4);
	expect(table.cell(0, 3)).toBe(4);
	expect(table.cell(0, "four")).toBe(4);
	table.setColumn("five", [5], true);
	expect(table.rows()).toBe(1);
	expect(table.columns()).toBe(5);
	expect(table.cell(0, 4)).toBe(5);
	expect(table.cell(0, "five")).toBe(5);
	expect(table.rowRollingMean(0, 1)[4]).toBe(4.5);
	table.rowRollingMean(0, 1, true);
	expect(table.rows()).toBe(1);
	expect(table.columns()).toBe(5);
	expect(table.cell(0, 4)).toBe(4.5);
	expect(table.cell(0, "five")).toBe(4.5);
})

test('single array to be vertically counted', () => {
	const table = Table.create(words, { count: "vertical", rowKeyColumn: 0, headers: ["item", "count"] });
	expect(table.rows()).toBe(3);
	expect(table.columns()).toBe(2);
	expect(table.cell(0, 0)).toBe("three");
	expect(table.cell(0, 1)).toBe(3);
	expect(table.cell("one", 1)).toBe(1);
	expect(table.cell("one", "count")).toBe(1);
	table.rowSort();
	expect(table.rows()).toBe(3);
	expect(table.columns()).toBe(2);
	expect(table.cell(2, 0)).toBe("two"); // from row 1 to row 2
	table.rowSort("count", { reverse: true });
	expect(table.rows()).toBe(3);
	expect(table.columns()).toBe(2);
	expect(table.cell(2, 0)).toBe("one"); // from row 1 to row 2
	table.rowSort((a, b) => a[0].localeCompare(b[0]));
	expect(table.rows()).toBe(3);
	expect(table.columns()).toBe(2);
	expect(table.cell(2, 0)).toBe("two"); // sorted alphabetically at end
	table.rowSort((a, b) => b.item.localeCompare(a.item), { asObject: true });
	expect(table.rows()).toBe(3);
	expect(table.columns()).toBe(2);
	expect(table.cell(2, 0)).toBe("one"); // reverse sorted alphabetically at end

	table.columnSort(); // sort by column name
	expect(table.rows()).toBe(3);
	expect(table.columns()).toBe(2);
	expect(table.header(0)).toBe("count");
	expect(table.cell(2, 0)).toBe(1); // reverse sorted alphabetically at end
	expect(table.toCsv()).toBe("count,item\n2,two\n3,three\n1,one");
	expect(table.toTsv()).toBe("count\titem\n2\ttwo\n3\tthree\n1\tone");
	expect(table.toString()).toBe("<table class='voyantTable'><thead><tr><th>count</th><th>item</th></tr></thead><tbody><tr><td>2</td><td>two</td></tr><tr><td>3</td><td>three</td></tr><tr><td>1</td><td>one</td></tr></tbody></table>");

	// make sure we get same thing from CSV
	const newTable = Table.create(table.toCsv());
	expect(newTable.rows()).toBe(3);
	expect(newTable.columns()).toBe(2);
	expect(newTable.header(0)).toBe("count");
})

test('calculations', () => {
	const table = Table.create(numbers);
	expect(table.rowMin(0)).toBe(0);
	expect(table.rowMax(0)).toBe(9);
	expect(table.columnMin(0)).toBe(0);
	expect(table.columnMax(0)).toBe(10);
	expect(table.rowSum(0)).toBe(45);
	expect(table.columnSum(0)).toBe(10);
	expect(table.rowMean(0)).toBe(4.5);
	expect(table.columnMean(0)).toBe(5);
	expect(table.rowVariance(0)).toBe(8.25);
	expect(table.columnVariance(0)).toBe(25);
	expect(table.rowStandardDeviation(0)).toBe(2.8722813232690143);
	expect(table.columnStandardDeviation(0)).toBe(5);
	expect(table.rowZScores(0)).toStrictEqual([-1.5666989036012806, -1.2185435916898848, -0.8703882797784892, -0.5222329678670935, -0.17407765595569785, 0.17407765595569785, 0.5222329678670935, 0.8703882797784892, 1.2185435916898848, 1.5666989036012806]);
	expect(table.columnZScores(0)).toStrictEqual([-1, 1]);
})

test('adding rows with chaining', () => {
	const table = Table.create({ headers: ["item", "count"] });
	table.addRow("one", 1).addRow(["two", 2]);
	table.setCell(2, 0, "three").setCell(2, 1, 3);
	expect(table.rows()).toBe(3);
	expect(table.columns()).toBe(2);
	expect(table.cell(0, 0)).toBe("one");
	expect(table.cell(0, 1)).toBe(1);
	expect(table.cell(1, "item")).toBe("two");
	expect(table.cell("three", "count")).toBe(3);

	let rows = table.rows(true);
	expect(rows.length).toBe(3);
	expect(rows[0][0]).toBe("one");
	expect(rows[2][1]).toBe(3);
	rows = table.rows(2); // single
	expect(rows.length).toBe(1);
	expect(rows[0][0]).toBe("three");
	expect(rows[0][1]).toBe(3);
	rows = table.rows(1, 2); // varargs
	expect(rows.length).toBe(2);
	expect(rows[0][0]).toBe("two");
	expect(rows[0][1]).toBe(2);
	rows = table.rows([0, 2]); // array
	expect(rows.length).toBe(2);
	expect(rows[0][0]).toBe("one");
	expect(rows[0][1]).toBe(1);
	rows = table.rows([0, 2], { zip: true }); // array
	expect(rows.length).toBe(2);
	expect(rows[0][0]).toBe("one");
	expect(rows[0][1]).toBe("three");
	expect(rows[1][0]).toBe(1);
	expect(rows[1][1]).toBe(3);

	let counts = table.columnCounts(0);
	expect(counts.one).toBe(1);
	counts = table.columnCounts(1);
	expect(counts["1"]).toBe(1);
	counts = table.rowCounts(0);
	expect(counts.one).toBe(1);
})

test('html target', () => {
	document.body.innerHTML = `
	<div id="table1"></div>
	<div id="table2"></div>`;

	const table = Table.create(words);
	table.html("#table1");
	table.html(document.getElementById("table2"));
	expect(document.querySelectorAll("table").length).toBe(2);
})

test('fetch', () => {
	fetch.once(Mocks.PunctuationNovel);
	return Table.fetch("https://raw.githubusercontent.com/piperandrew/enumerations/master/01_Punctuation/Punctuation_Novel_19C_20C_ByYear.csv").then(table => {
		expect(table.rows()).toBe(199);
		expect(table.columns()).toBe(8);
		expect(table.header(0)).toBe("year");
	})
})
