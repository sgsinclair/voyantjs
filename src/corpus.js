import Loader from './loader';

export function load(config) {
	return Corpus.load(config);
}

export function create(config) {
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

export function tokens(config, api) {
	return Corpus.load(config).then(corpus => corpus.tokens(api || config));
}

export function words(config, api) {
	return Corpus.load(config).then(corpus => corpus.words(api || config));
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

export function tool(target, tool, config, api) {
	return Corpus.load(config).then(corpus => corpus.tool(target, tool, api || config));
}

export function htmltool(html, tool, config, api) {
	return Corpus.load(config).then(corpus => corpus.htmltool(html, tool, api || config));
}

export function setBaseUrl(baseUrl) {
	Loader.setBaseUrl(baseUrl);
}

function isDocumentsMode(config) {
	return config && ((config.mode && config.mode === "documents") || config.documents);
}

export class Corpus {
	constructor(id) {
		this.corpusid = id;
	}

	static Loader = Loader;

	id() {
		let me = this
		return new Promise(resolve => resolve(me.corpusid));
	}
	metadata(config, params) {
		return Loader.trombone(config, {
			tool: isDocumentsMode(config) ? "corpus.DocumentsMetadata" : "corpus.CorpusMetadata",
			corpus: this.corpusid
		})
		.then(data => isDocumentsMode(config) ? data.documentsMetadata.documents : data.corpus.metadata)
	}
	
	summary(config) {
		return this.metadata().then(data => {
			// TODO: make this a template
			return `This corpus (${data.alias ? data.alias : data.id}) has ${data.documentsCount.toLocaleString()} documents with ${data.lexicalTokensCount.toLocaleString()} total words and ${data.lexicalTypesCount.toLocaleString()} unique word forms.`
		})
	}
	
	titles(config) {
		return Loader.trombone(config, {
			tool: "corpus.DocumentsMetadata",
			corpus: this.corpusid
		})
		.then(data => data.documentsMetadata.documents.map(doc => doc.title))
	}
	
	text(config) {
		return this.texts(config).then(data => data.join("\n"))
	}
	
	texts(config) {
		return Loader.trombone(config, {
			tool: "corpus.CorpusTexts",
			corpus: this.corpusid
		}).then(data => data.texts.texts)
	}
	
	terms(config) {
		return Loader.trombone(config, {
			tool: isDocumentsMode(config) ? "corpus.DocumentTerms" : "corpus.CorpusTerms",
			corpus: this.corpusid
		}).then(data => isDocumentsMode(config) ? data.documentTerms.terms : data.corpusTerms.terms)
	}
	
	tokens(config) {
		return Loader.trombone(config, {
			tool: "corpus.DocumentTokens",
			corpus: this.corpusid
		}).then(data => data.documentTokens.tokens)
	}

	words(config = {}) {
		// by default DocumentTokens limits to 50 which probably isn't expected
		if (!("limit" in config)) {config.limit=0;}
		return Loader.trombone(config, {
			tool: "corpus.DocumentTokens",
			noOthers: true,
			corpus: this.corpusid
		}).then(data => data.documentTokens.tokens)
	}
	
	contexts(config) {
		if ((!config || !config.query) && console) {console.warn("No query provided for contexts request.")}
		return Loader.trombone(config, {
			tool: "corpus.DocumentContexts",
			corpus: this.corpusid
		}).then(data => data.documentContexts.contexts)
	}
	
	collocates(config) {
		if ((!config || !config.query) && console) {console.warn("No query provided for collocates request.")}
		return Loader.trombone(config, {
			tool: "corpus.CorpusCollocates",
			corpus: this.corpusid
		}).then(data => data.corpusCollocates.collocates)
	}

	phrases(config) {
		return Loader.trombone(config, {
			tool: isDocumentsMode(config) ? "corpus.DocumentNgrams" : "corpus.CorpusNgrams",
			corpus: this.corpusid
		}).then(data => isDocumentsMode(config) ? data.documentNgrams.ngrams : data.corpusNgrams.ngrams)
	}
	
	correlations(config) {
		if ((!config || !config.query) && console) {
			console.warn("No query provided for correlations request.")
			if (!isDocumentsMode(config)) {
				throw new Error("Unable to run correlations for a corpus without a query.")
			}
		}
		return Loader.trombone(config, {
			tool: isDocumentsMode(config) ? "corpus.DocumentTermCorrelations" : "corpus.CorpusTermCorrelations",
			corpus: this.corpusid
		}).then(data => data.termCorrelations.correlations)
	}
	
	tool(target, tool, config = {}) {
		let me = this;
		return new Promise((resolve, reject) => {

			let out='<iframe ';

			// construct attributes of iframe
			let defaultAttributes = {
				width: undefined,
				height: undefined,
				style: "width: 90%; height: 400px"
			}
			for (let attr in defaultAttributes) {
				var val = config[attr] || defaultAttributes[attr];
				if (val) {
					out+=' '+attr+'="'+val+'"';
				}
			}

			// construct src URL
			var url = new URL((config && config.voyantUrl ? config.voyantUrl : Loader.baseUrl) + "tool/"+tool+"/");
			url.searchParams.append("corpus", me.corpusid);
			
			// add API values from config (some may be ignored)
			Object.keys(config || {}).forEach(key => {
				if (key !=="input" && !(key in defaultAttributes)) {
					url.searchParams.append(key, config[key])
				}
			});
			
			out+=' src="'+url+'"></iframe>'
			
			if (typeof target === "function") {
				resolve(target(out));
			} else {
				if (typeof target === "string") {
					target = document.querySelector(target);
				}
				if (typeof target === "object" && "innerHTML" in target) {
					target.innerHTML = out;
					resolve(out);
				}
			}
			resolve(out); // just return the tag
		})
	}

	htmltool(html, tool, config) {
		return new Promise((resolve,reject) => {
			this.tool(undefined, tool, config).then(out => resolve(html`${out}`));
		});
	}

	toString() {
		return this.summary()
	}
	
	static load(config) {
		const promise = new Promise(function(resolve, reject) {
			if (config instanceof Corpus) {
				resolve(config);
			} else if (typeof config === "string" && config.length>0 && /\W/.test(config)===false) {
				resolve(new Corpus(config)); 
			} else if (typeof config === "object" && config.corpus) {
				resolve(new Corpus(config.corpus))
			} else {
				if (typeof config === "string") {config = {input: config}}
				if (config && config.input) {
					Loader.trombone(config, {tool: "corpus.CorpusMetadata"})
					.then(data => resolve(new Corpus(data.corpus.metadata.id)))
				}
			}
		});

		["id","metadata","summary","titles","text","texts","terms","tokens","words","contexts","collocates","phrases","correlations","tool"].forEach(name => {
			promise[name] = function() {
				var args = arguments
				return promise.then(corpus => {return corpus[name].apply(corpus, args)})
			}
		})
		promise.assign = function(name) {
			this.then(corpus => {window[name] = corpus; return corpus})
		}

		return promise;
	}
}
