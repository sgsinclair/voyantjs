import Util from '../src/util';

import * as Mocks from './mocks/corpus';

beforeAll(() => {
})

beforeEach(() => {
})

test('id', () => {
	const id = Util.id(16);
	expect(id.length).toBe(16);
})

test('toString short', () => {
	const string = Util.toString(['foo', 'bar']);
	expect(string).toBe('["foo","bar"]');
})

test('toString long', () => {
	const string = Util.toString(Mocks.DocumentsMetadata);
	expect(string).toMatch('<svg');
})

test('more', () => {
	const string = Util.more('foo', Util.toString(Mocks.DocumentsMetadata), 'bar');
	expect(string).toMatch('foo<svg');
})
