import Corpus from '../src/corpus';

import * as Mocks from './mocks/corpus';

const corpusId = 'austen';

beforeAll(() => {
	Corpus.setBaseUrl('http://localhost:8080/voyant/')
})

beforeEach(() => {
	fetch.resetMocks();
})

test('id', () => {
	fetch.once(JSON.stringify(Mocks.CorpusMetadata));
	return Corpus.load(corpusId).then(corpus => {
		corpus.id().then(id => {
			expect(id).toBe(corpusId)
		})
	})
})

test('metadata', () => {
	fetch.once(JSON.stringify(Mocks.CorpusMetadata));
	return Corpus.load(corpusId).then(corpus => {
		corpus.metadata().then(data => {
			expect(data.alias).toBe(undefined);
			expect(data.documentsCount).toBe(8);
			expect(data.languageCodes[0]).toBe('en');
		});
	})
})

test('summary', () => {
	fetch.once(JSON.stringify(Mocks.CorpusMetadata));
	return Corpus.load(corpusId).then(corpus => {
		corpus.summary().then(data => {
			expect(data).toBe('This corpus (austen) has 8 documents with 810,710 total words and 15,834 unique word forms.')
		})
	})
})

//test('titles', () => {
//	fetch.once(JSON.stringify(Mocks.DocumentsMetadata));
//	return Corpus.load(corpusId).then(corpus => {
//		corpus.titles().then(data => {
//			expect(data.length).toBe(8);
//			expect(data[0]).toBe('121-0');
//		});
//	})
//})
//
//test('text', () => {
//	fetch.once(JSON.stringify(Mocks.CorpusTextsLimit100));
//	return Corpus.load(corpusId).then(corpus => {
//		corpus.text().then(data => {
//			expect(data.length).toBe(849);
//			expect(data.indexOf('Jane Austen')).toBe(58);
//		});
//	})
//})
//
//test('texts', () => {
//	fetch.once(JSON.stringify(Mocks.CorpusTextsLimit100));
//	return Corpus.load(corpusId).then(corpus => {
//		corpus.texts().then(data => {
//			expect(data.length).toBe(8);
//			expect(data[0].indexOf('Northanger Abbey')).toBe(37);
//		});
//	})
//})
//
//test('terms', () => {
//	fetch.once(JSON.stringify(Mocks.CorpusTermsLimit10));
//	return Corpus.load(corpusId).then(corpus => {
//		corpus.terms().then(data => {
//			expect(data.length).toBe(10);
//			expect(data[0].term).toBe('the');
//			expect(data[0].rawFreq).toBe(29869);
//		});
//	})
//})
//
//test('tokens', () => {
//	fetch.once(JSON.stringify(Mocks.DocumentTokensLimit10));
//	return Corpus.load(corpusId).then(corpus => {
//		corpus.tokens().then(data => {
//			expect(data.length).toBe(21);
//			expect(data[4].term).toBe('Project');
//			expect(data[4].rawFreq).toBe(87);
//		});
//	})
//})
//
//test('words', () => {
//	fetch.once(JSON.stringify(Mocks.DocumentTokensLimit10NoOthers));
//	return Corpus.load(corpusId).then(corpus => {
//		corpus.words().then(data => {
//			expect(data.length).toBe(10);
//			expect(data[6]).toBe('Abbey');
//		});
//	})
//})
//
//test('contexts no query', () => {
//	fetch.once(JSON.stringify(Mocks.DocumentContextsNoQuery));
//	return Corpus.load(corpusId).then(corpus => {
//		corpus.contexts().then(data => {
//			expect(data.length).toBe(0);
//		});
//	})
//})
//
//test('contexts love query', () => {
//	fetch.once(JSON.stringify(Mocks.DocumentContextsLoveQuery));
//	return Corpus.load(corpusId).then(corpus => {
//		corpus.contexts({query: 'love'}).then(data => {
//			expect(data.length).toBe(10);
//			expect(data[0].term).toBe('love');
//			expect(data[0].position).toBe(923);
//		});
//	})
//})
//
//test('collocates no query', () => {
//	fetch.once(JSON.stringify(Mocks.CorpusCollocatesNoQuery));
//	return Corpus.load(corpusId).then(corpus => {
//		corpus.collocates().then(data => {
//			expect(data.length).toBe(0);
//		});
//	})
//})
//
//test('collocates love query', () => {
//	fetch.once(JSON.stringify(Mocks.CorpusCollocatesLoveQuery));
//	return Corpus.load(corpusId).then(corpus => {
//		corpus.collocates({query: 'love'}).then(data => {
//			expect(data.length).toBe(10);
//			expect(data[0].term).toBe('love');
//			expect(data[0].contextTerm).toBe('and');
//		});
//	})
//})
//
//test('phrases', () => {
//	fetch.once(JSON.stringify(Mocks.CorpusNgramsLimit10));
//	return Corpus.load(corpusId).then(corpus => {
//		corpus.phrases().then(data => {
//			expect(data.length).toBe(10);
//			expect(data[0].term).toBe('of the');
//			expect(data[0].length).toBe(2);
//			expect(data[0].rawFreq).toBe(3430);
//		});
//	})
//})
//
//test('correlations', () => {
//	fetch.once(JSON.stringify(Mocks.CorpusTermCorrelationsLoveQuery));
//	return Corpus.load(corpusId).then(corpus => {
//		corpus.correlations({query: 'love'}).then(data => {
//			expect(data.length).toBe(10);
//			expect(data[0].source.term).toBe('the');
//			expect(data[0].target.term).toBe('love');
//			expect(data[0].correlation).toBe(0.22016151);
//			expect(data[0].significance).toBe(0.6003425);
//		});
//	})
//})
//
//test('ldaTopics', async () => {
//	fetch
//		.once(JSON.stringify(Mocks.Stopwords))
//		.once(JSON.stringify(Mocks.CorpusTextsLimit500));
//	const corpus = await Corpus.load(corpusId);
//	const data = await corpus.ldaTopics({numberTopics: 5});
//	expect(data.length).toBe(5);
//})
//
//test('tool', () => {
//	return Corpus.load(corpusId).then((c) => {
//		return c.tool('scatterplot').then((url) => {
//			expect(url).toContain('scatterplot');
//		})
//	})
//})