import Load from '../src/load';

import * as Mocks from './mocks/load';

const baseUrl = 'http://localhost:8080/voyant';

beforeAll(() => {
	Load.setBaseUrl(baseUrl);
})

beforeEach(() => {
	fetch.resetMocks()
})

test('set base url', () => {
	expect(Load.baseUrl).toBe(baseUrl);
})

test('trombone get ok', () => {
	fetch.once(JSON.stringify(Mocks.CorpusMetadata));
	return Load.trombone({
		tool: 'corpus.CorpusMetadata',
		corpus: '080469ce65fb3e40168914f4df21116e'
	}).then(data => {
		expect(data).toStrictEqual(Mocks.CorpusMetadata);
	})
})

test('trombone post ok', () => {
	fetch.once(JSON.stringify(Mocks.CorpusMetadata));
	return Load.trombone({
		tool: 'corpus.CorpusMetadata',
		corpus: '080469ce65fb3e40168914f4df21116e',
		aVeryLongParam: Mocks.CorpusError
	}).then(data => {
		expect(data).toStrictEqual(Mocks.CorpusMetadata);
	})
})

test('trombone get error', () => {
	fetch.mockReject(new Error(Mocks.CorpusError));
	return Load.trombone({
		tool: 'corpus.CorpusMetadata',
		corpus: '080469ce65fb3e40168914f4df21116e'
	}).then(() => {}, error => {
		expect(error.toString()).toMatch('A corpus was specified but does not exist');
	})
})

test('static load', () => {
	const textResponse = 'some text';
	fetch.once(textResponse);
	return Load.load('http://foo.bar').then(data => {
		data.text().then(text => {
			expect(text).toBe(textResponse);
		})
	})
})

test('static load error', () => {
	fetch.mockReject(new Error(Mocks.CorpusError));
	return Load.load('http://foo.bar').then(() => {}, error => {
		expect(error.toString()).toMatch('A corpus was specified but does not exist');
	})
})

test('static html', () => {
	const htmlResponse = '<html><head></head><body>foo</body></html>';
	fetch.once(htmlResponse);
	return Load.html('http://foo.bar').then(data => {
		expect(data.documentElement.querySelector('body').textContent).toBe('foo');
	})
})

test('static xml', () => {
	const xmlResponse = '<?xml version="1.0" encoding="UTF-8"?><TEI><text><body>foo</body></text></TEI>';
	fetch.once(xmlResponse);
	return Load.xml('http://foo.bar').then(data => {
		expect(data.documentElement.querySelector('body').textContent).toBe('foo');
	})
})

test('static json', () => {
	fetch.once(JSON.stringify(Mocks.CorpusMetadata));
	return Load.json('http://foo.bar').then(data => {
		expect(data.corpus.metadata.id).toBe('080469ce65fb3e40168914f4df21116e');
	})
})

test('static text', () => {
	const textResponse = 'some text';
	fetch.once(textResponse);
	return Load.text('http://foo.bar').then(data => {
		expect(data).toBe('some text');
	})
})

test('static file', () => {
	Load.file().then(file => {});
	expect(document.querySelector('input[type="file"]')).not.toBe(null);
})
