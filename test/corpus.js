import * as Corpus from '../src/corpus';

import * as Mocks from './mocks/corpus';

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
	fetch.once(JSON.stringify(Mocks.CorpusMetadata));
	return corpus.metadata().then(data => {
		expect(data.alias).toBe(undefined);
		expect(data.documentsCount).toBe(8);
		expect(data.languageCodes[0]).toBe('en');
	})
})

test('summary', () => {
	fetch.once(JSON.stringify(Mocks.CorpusMetadata));
	return corpus.summary().then(data => {
		expect(data).toBe('This corpus (austen) has 8 documents with 810710 total words and 15834 unique word forms.')
	})
})

test('titles', () => {
	fetch.once(JSON.stringify(Mocks.DocumentsMetadata));
	return corpus.titles().then(data => {
		expect(data.length).toBe(8);
		expect(data[0]).toBe('121-0');
	})
})

test('text', () => {
	fetch.once(JSON.stringify(Mocks.CorpusTextsLimit100));
	return corpus.text().then(data => {
		expect(data.length).toBe(807);
		expect(data.indexOf('Jane Austen')).toBe(58);
	})
})

test('texts', () => {
	fetch.once(JSON.stringify(Mocks.CorpusTextsLimit100));
	return corpus.texts().then(data => {
		expect(data.length).toBe(8);
		expect(data[0].indexOf('Northanger Abbey')).toBe(37);
	})
})

test('terms', () => {
	fetch.once(JSON.stringify(Mocks.CorpusTermsLimit10));
	return corpus.terms().then(data => {
		expect(data.length).toBe(10);
		expect(data[0].term).toBe('the');
		expect(data[0].rawFreq).toBe(29869);
	})
})

test('tokens', () => {
	fetch.once(JSON.stringify(Mocks.DocumentTokensLimit10));
	return corpus.tokens().then(data => {
		expect(data.length).toBe(21);
		expect(data[4].term).toBe('Project');
		expect(data[4].rawFreq).toBe(87);
	})
})

test('words', () => {
	fetch.once(JSON.stringify(Mocks.DocumentTokensLimit10NoOthers));
	return corpus.words().then(data => {
		expect(data.length).toBe(10);
		expect(data[6].term).toBe('Abbey');
		expect(data[6].rawFreq).toBe(44);
	})
})

test('contexts no query', () => {
	fetch.once(JSON.stringify(Mocks.DocumentContextsNoQuery));
	return corpus.contexts().then(data => {
		expect(data.length).toBe(0);
	})
})

test('contexts love query', () => {
	fetch.once(JSON.stringify(Mocks.DocumentContextsLoveQuery));
	return corpus.contexts({query: 'love'}).then(data => {
		expect(data.length).toBe(10);
		expect(data[0].term).toBe('love');
		expect(data[0].position).toBe(923);
	})
})

test('collocates no query', () => {
	fetch.once(JSON.stringify(Mocks.CorpusCollocatesNoQuery));
	return corpus.collocates().then(data => {
		expect(data.length).toBe(0);
	})
})

test('collocates love query', () => {
	fetch.once(JSON.stringify(Mocks.CorpusCollocatesLoveQuery));
	return corpus.collocates({query: 'love'}).then(data => {
		expect(data.length).toBe(10);
		expect(data[0].term).toBe('love');
		expect(data[0].contextTerm).toBe('and');
	})
})

test('phrases', () => {
	fetch.once(JSON.stringify(Mocks.CorpusNgramsLimit10));
	return corpus.phrases().then(data => {
		expect(data.length).toBe(10);
		expect(data[0].term).toBe('of the');
		expect(data[0].length).toBe(2);
		expect(data[0].rawFreq).toBe(3430);
	})
})

test('correlations', () => {
	fetch.once(JSON.stringify(Mocks.CorpusTermCorrelationsLoveQuery));
	return corpus.correlations({query: 'love'}).then(data => {
		expect(data.length).toBe(10);
		expect(data[0].source.term).toBe('the');
		expect(data[0].target.term).toBe('love');
		expect(data[0].correlation).toBe(0.22016151);
		expect(data[0].significance).toBe(0.6003425);
	})
})
