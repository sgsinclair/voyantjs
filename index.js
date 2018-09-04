// THIS IS AN EARLY ALPHA VERSION, PLEASE ASSUME THAT THIS API WILL CHANGE!!

export let voyantUrl = "https://voyant-tools.org";

export let tromboneUrl = voyantUrl+"/trombone";

export function load(config) {
	return Corpus.load(config);
}

export function id(config, api) {
	return Corpus.load(config).then(corpus => corpus.id(api || config));
}

export function metadata(config, api) {
	return Corpus.load(config).then(corpus => corpus.metadata(api || config));
}

export function summary(config, api) {
	return Corpus.load(config).then(corpus => corpus.summary(api || config));
}

export function titles(config, api) {
	return Corpus.load(config).then(corpus => corpus.titles(api || config));
}

export function text(config, api) {
	return Corpus.load(config).then(corpus => corpus.text(api || config));	
}

export function texts(config, api) {
	return Corpus.load(config).then(corpus => corpus.texts(api || config));	
}

export function terms(config, api) {
	return Corpus.load(config).then(corpus => corpus.terms(api || config));
}

export function contexts(config, api) {
	return Corpus.load(config).then(corpus => corpus.contexts(api || config));
}

export function collocates(config, api) {
	return Corpus.load(config).then(corpus => corpus.collocates(api || config));
}

export function phrases(config, api) {
	return Corpus.load(config).then(corpus => corpus.phrases(api || config));
}

export function correlations(config, api) {
	return Corpus.load(config).then(corpus => corpus.correlations(api || config));
}

export function htmltool(tool, config, api) {
	return Corpus.load(config).then(corpus => corpus.htmltool(tool, api || config));
}

function trombone(config, params) {
	let  url = new URL(config && config.trombone ? config.trombone : tromboneUrl);
	Object.keys(config || {}).forEach(key => url.searchParams.append(key, config[key]))
	Object.keys(params || {}).forEach(key => url.searchParams.append(key, params[key]))
	return fetch(url).then(response => response.json())
}

function isDocumentsMode(config) {
	return config && ((config.mode && config.mode=="documents") || config.documents);
}

export class Corpus {
	constructor(id) {
		this.corpusid = id;
	}
	id() {
		let me = this
		return new Promise(resolve => resolve(me.corpusid));
	}
	metadata(config, params) {
		return trombone(config, {
			tool: isDocumentsMode(config) ? "corpus.DocumentsMetadata" : "corpus.CorpusMetadata",
			corpus: this.corpusid
		})
		.then(data => isDocumentsMode(config) ? data.documentsMetadata.documents : data.corpus.metadata)
	}
	
	summary(config) {
		return this.metadata().then(data => {
			// TODO: make this a template
			return `This corpus has ${data.documentsCount} documents with ${data.lexicalTokensCount} total words and ${data.lexicalTypesCount} unique word forms.`
		})
	}
	
	titles(config) {
		return this.metadata(Object.assign({documents: true}, config))
			.then(metadata => metadata.map(doc => doc.title))
	}
	
	text(config) {
		return this.texts(config).then(data => data.join("\n"))
	}
	
	texts(config) {
		return trombone(config, {
			tool: "corpus.CorpusTexts",
			corpus: this.corpusid
		}).then(data => data.texts.texts)
		
	}

	contexts(config) {
		return trombone(config, {
			tool: "corpus.DocumentContexts",
			corpus: this.corpusid
		}).then(data => data.documentContexts.contexts)
	}
	
	collocates(config) {
		return trombone(config, {
			tool: "corpus.CorpusCollocates",
			corpus: this.corpusid
		}).then(data => data.corpusCollocates.collocates)
	}

	phrases(config) {
		return trombone(config, {
			tool: isDocumentsMode(config) ? "corpus.DocumentNgrams" : "corpus.CorpusNgrams",
			corpus: this.corpusid
		}).then(data => isDocumentsMode(config) ? data.documentNgrams.ngrams : data.corpusNgrams.ngrams)
	}
	
	correlations(config) {
		return trombone(config, {
			tool: isDocumentsMode(config) ? "corpus.DocumentTermCorrelations" : "corpus.CorpusTermCorrelations",
			corpus: this.corpusid
		}).then(data => data.termCorrelations.correlations)
	}
	
	terms(config) {
		return trombone(config, {
			tool: isDocumentsMode(config) ? "corpus.DocumentTerms" : "corpus.CorpusTerms",
			corpus: this.corpusid
		}).then(data => isDocumentsMode(config) ? data.documentTerms.terms : data.corpusTerms.terms)
	}
	
	htmltool(tool, config) {
		let me = this;
		return new Promise((resolve, reject) => {

			let html='<iframe ';

			// construct attributes of iframe
			let defaultAttributes = {
				width: undefined,
				height: undefined,
				style: "width: 90%; height: 400px"
			}
			for (let attr in defaultAttributes) {
				var val = config[attr] || defaultAttributes[attr];
				if (val) {
					html+=' '+attr+'="'+val+'"';
				}
			}

			// construct src URL
			var url = new URL((config && config.voyantUrl ? config.voyantUrl : voyantUrl) + "/tool/"+tool+"/");
			url.searchParams.append("corpus", me.corpusid);
			
			// add API values from config (some may be ignored)
			Object.keys(config || {}).forEach(key => {
				if (key!="input" && !(key in defaultAttributes)) {
					url.searchParams.append(key, config[key])
				}
			});
			
			html+=' src="'+url+'"></iframe>'
			resolve(html);
		})
	}
	
	static load(config) {
		return new Promise(function(resolve, reject) {
			if (config instanceof Corpus) {
				resolve(config);
			} else if (typeof config == "string" && config.length>0 && /\W/.test(config)==false) {
				resolve(new Corpus(config)); 
			} else if (typeof config == "object" && config.corpus) {
				resolve(new Corpus(config.corpus))
			} else {
				if (typeof config == "string") {config = {input: config}}
				if (config && config.input) {
					trombone(config, {tool: "corpus.CorpusMetadata"})
					.then(data => resolve(new Corpus(data.corpus.metadata.id)))
				}
			}
		});
	}
}