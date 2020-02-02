import Corpus from '../src/corpus';

import * as Mocks from './mocks/corpus';

const corpus = 'austen';

beforeAll(() => {
	Corpus.setBaseUrl('http://localhost:8080/voyant/')
})

beforeEach(() => {
	fetch.resetMocks()
})

test('id', () => {
	return Corpus.id({corpus}).then(id => {
		expect(id).toBe(corpus)
	})
})

test('metadata', () => {
	fetch.once(JSON.stringify(Mocks.CorpusMetadata));
	return Corpus.metadata({corpus}).then(data => {
		expect(data.alias).toBe(undefined);
		expect(data.documentsCount).toBe(8);
		expect(data.languageCodes[0]).toBe('en');
	})
})

test('summary', () => {
	fetch.once(JSON.stringify(Mocks.CorpusMetadata));
	return Corpus.summary({corpus}).then(data => {
		expect(data).toBe('This corpus (austen) has 8 documents with 810,710 total words and 15,834 unique word forms.')
	})
})

test('titles', () => {
	fetch.once(JSON.stringify(Mocks.DocumentsMetadata));
	return Corpus.titles({corpus}).then(data => {
		expect(data.length).toBe(8);
		expect(data[0]).toBe('121-0');
	})
})

test('text', () => {
	fetch.once(JSON.stringify(Mocks.CorpusTextsLimit100));
	return Corpus.text({corpus}).then(data => {
		expect(data.length).toBe(807);
		expect(data.indexOf('Jane Austen')).toBe(58);
	})
})

test('texts', () => {
	fetch.once(JSON.stringify(Mocks.CorpusTextsLimit100));
	return Corpus.texts({corpus}).then(data => {
		expect(data.length).toBe(8);
		expect(data[0].indexOf('Northanger Abbey')).toBe(37);
	})
})

test('terms', () => {
	fetch.once(JSON.stringify(Mocks.CorpusTermsLimit10));
	return Corpus.terms({corpus}).then(data => {
		expect(data.length).toBe(10);
		expect(data[0].term).toBe('the');
		expect(data[0].rawFreq).toBe(29869);
	})
})

test('tokens', () => {
	fetch.once(JSON.stringify(Mocks.DocumentTokensLimit10));
	return Corpus.tokens({corpus}).then(data => {
		expect(data.length).toBe(21);
		expect(data[4].term).toBe('Project');
		expect(data[4].rawFreq).toBe(87);
	})
})

test('words', () => {
	fetch.once(JSON.stringify(Mocks.DocumentTokensLimit10NoOthers));
	return Corpus.words({corpus}).then(data => {
		expect(data.length).toBe(10);
		expect(data[6].term).toBe('Abbey');
		expect(data[6].rawFreq).toBe(44);
	})
})

test('contexts no query', () => {
	fetch.once(JSON.stringify(Mocks.DocumentContextsNoQuery));
	return Corpus.contexts({corpus}).then(data => {
		expect(data.length).toBe(0);
	})
})

test('contexts love query', () => {
	fetch.once(JSON.stringify(Mocks.DocumentContextsLoveQuery));
	return Corpus.contexts({corpus, query: 'love'}).then(data => {
		expect(data.length).toBe(10);
		expect(data[0].term).toBe('love');
		expect(data[0].position).toBe(923);
	})
})

test('collocates no query', () => {
	fetch.once(JSON.stringify(Mocks.CorpusCollocatesNoQuery));
	return Corpus.collocates({corpus}).then(data => {
		expect(data.length).toBe(0);
	})
})

test('collocates love query', () => {
	fetch.once(JSON.stringify(Mocks.CorpusCollocatesLoveQuery));
	return Corpus.collocates({corpus, query: 'love'}).then(data => {
		expect(data.length).toBe(10);
		expect(data[0].term).toBe('love');
		expect(data[0].contextTerm).toBe('and');
	})
})

test('phrases', () => {
	fetch.once(JSON.stringify(Mocks.CorpusNgramsLimit10));
	return Corpus.phrases({corpus}).then(data => {
		expect(data.length).toBe(10);
		expect(data[0].term).toBe('of the');
		expect(data[0].length).toBe(2);
		expect(data[0].rawFreq).toBe(3430);
	})
})

test('correlations', () => {
	fetch.once(JSON.stringify(Mocks.CorpusTermCorrelationsLoveQuery));
	return Corpus.correlations({corpus, query: 'love'}).then(data => {
		expect(data.length).toBe(10);
		expect(data[0].source.term).toBe('the');
		expect(data[0].target.term).toBe('love');
		expect(data[0].correlation).toBe(0.22016151);
		expect(data[0].significance).toBe(0.6003425);
	})
})

test('tool', () => {
	return Corpus.load({corpus}).then((c) => {
		return c.tool('scatterplot').then((url) => {
			expect(url).toContain('scatterplot');
		})
	})
})