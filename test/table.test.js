const Table = require('../src/table');

let table;

// empty table
table = Table.create();
test('empty table', () => {
  expect(table.rows()).toBe(0);
});

// array of data
table = Table.create([1]);
console.warn(table)
test('array table', () => {
  expect(table.rows()).toBe(1);
});

