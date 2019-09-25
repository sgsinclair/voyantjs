import * as Corpus from '../src/corpus';

import {CorpusMetadata, DocumentsMetadata, CorpusTextsLimit100} from './mocks/corpus';

const corpusId = 'austen';

let corpus = undefined;

beforeAll(() => {
	Corpus.load({corpus: corpusId}).then(c => corpus = c)
})

beforeEach(() => {
	fetch.resetMocks()
})

test('id', () => {
	return corpus.id().then(id => {
		expect(id).toBe(corpusId)
	})
})

test('metadata', () => {
	fetch.once(JSON.stringify(CorpusMetadata));
	return corpus.metadata().then(data => {
		expect(data.alias).toBe(undefined);
		expect(data.documentsCount).toBe(8);
		expect(data.languageCodes[0]).toBe('en');
	})
})

test('summary', () => {
	fetch.once(JSON.stringify(CorpusMetadata));
	return corpus.summary().then(data => {
		expect(data).toBe('This corpus (austen) has 8 documents with 810710 total words and 15834 unique word forms.')
	})
})

test('titles', () => {
	fetch.once(JSON.stringify(DocumentsMetadata));
	return corpus.titles().then(data => {
		expect(data.length).toBe(8);
		expect(data[0]).toBe('121-0');
	})
})

test('text', () => {
	fetch.once(JSON.stringify(CorpusTextsLimit100));
	return corpus.text().then(data => {
		expect(data.length).toBe(807);
		expect(data.indexOf('Jane Austen')).toBe(58);
	})
})

test('texts', () => {
	fetch.once(JSON.stringify(CorpusTextsLimit100));
	return corpus.texts().then(data => {
		expect(data.length).toBe(8);
		expect(data[0].indexOf('Northanger Abbey')).toBe(37);
	})
})
