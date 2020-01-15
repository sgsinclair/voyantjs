import Loader from './loader';

function isDocumentsMode(config) {
	return config && ((config.mode && config.mode === "documents") || config.documents);
}

/**
 * Class representing a Corpus.
 * @memberof Spyral
 * @class
 */
class Corpus {
	/**
	 * Create a new Corpus using the specified Corpus ID
	 * @constructor
	 * @param {string} id The Corpus ID
	 */
	constructor(id) {
		this.corpusid = id;
	}

	static Loader = Loader;

	static setBaseUrl(baseUrl) {
		Loader.setBaseUrl(baseUrl);
	}

	/**
	 * Get the ID
	 * @return {string} The ID
	 */
	id() {
		let me = this
		return new Promise(resolve => resolve(me.corpusid));
	}

	/**
	 * Create a Corpus and return the ID
	 * @param {object} config 
	 * @param {object} api 
	 */
	static id(config, api) {
		return Corpus.load(config).then(corpus => corpus.id(api || config));
	}

	/**
	 * Load the metadata
	 * @param {*} config 
	 * @param {*} params 
	 */
	metadata(config, params) {
		return Loader.trombone(config, {
			tool: isDocumentsMode(config) ? "corpus.DocumentsMetadata" : "corpus.CorpusMetadata",
			corpus: this.corpusid
		})
		.then(data => isDocumentsMode(config) ? data.documentsMetadata.documents : data.corpus.metadata)
	}

	/**
	 * Create a Corpus and return the metadata
	 * @param {*} config 
	 * @param {*} api 
	 */
	static metadata(config, api) {
		return Corpus.load(config).then(corpus => corpus.metadata(api || config));
	}
	
	summary(config) {
		return this.metadata().then(data => {
			// TODO: make this a template
			return `This corpus (${data.alias ? data.alias : data.id}) has ${data.documentsCount.toLocaleString()} documents with ${data.lexicalTokensCount.toLocaleString()} total words and ${data.lexicalTypesCount.toLocaleString()} unique word forms.`
		})
	}

	/**
	 * Create a Corpus and return the summary
	 * @param {*} config 
	 * @param {*} api 
	 */
	static summary(config, api) {
		return Corpus.load(config).then(corpus => corpus.summary(api || config));
	}
	
	titles(config) {
		return Loader.trombone(config, {
			tool: "corpus.DocumentsMetadata",
			corpus: this.corpusid
		})
		.then(data => data.documentsMetadata.documents.map(doc => doc.title))
	}

	/**
	 * Create a Corpus and return the titles
	 * @param {*} config 
	 * @param {*} api 
	 */
	static titles(config, api) {
		return Corpus.load(config).then(corpus => corpus.titles(api || config));
	}
	
	/**
	 * Get the text
	 * @param {*} config 
	 */
	text(config) {
		return this.texts(config).then(data => data.join("\n"))
	}

	/**
	 * Create a Corpus and return the text
	 * @param {*} config 
	 * @param {*} api 
	 */
	static text(config, api) {
		return Corpus.load(config).then(corpus => corpus.text(api || config));	
	}
	
	texts(config) {
		return Loader.trombone(config, {
			tool: "corpus.CorpusTexts",
			corpus: this.corpusid
		}).then(data => data.texts.texts)
	}

	/**
	 * Create a Corpus and return the texts
	 * @param {*} config 
	 * @param {*} api 
	 */
	static texts(config, api) {
		return Corpus.load(config).then(corpus => corpus.texts(api || config));	
	}
	
	terms(config) {
		return Loader.trombone(config, {
			tool: isDocumentsMode(config) ? "corpus.DocumentTerms" : "corpus.CorpusTerms",
			corpus: this.corpusid
		}).then(data => isDocumentsMode(config) ? data.documentTerms.terms : data.corpusTerms.terms)
	}

	/**
	 * Create a Corpus and return the terms
	 * @param {*} config 
	 * @param {*} api 
	 */
	static terms(config, api) {
		return Corpus.load(config).then(corpus => corpus.terms(api || config));
	}
	
	tokens(config) {
		return Loader.trombone(config, {
			tool: "corpus.DocumentTokens",
			corpus: this.corpusid
		}).then(data => data.documentTokens.tokens)
	}

	/**
	 * Create a Corpus and return the tokens
	 * @param {*} config 
	 * @param {*} api 
	 */
	static tokens(config, api) {
		return Corpus.load(config).then(corpus => corpus.tokens(api || config));
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

	/**
	 * Create a Corpus and return the words
	 * @param {object} config 
	 * @param {object} api 
	 */
	static words(config, api) {
		return Corpus.load(config).then(corpus => corpus.words(api || config));
	}
	
	contexts(config) {
		if ((!config || !config.query) && console) {console.warn("No query provided for contexts request.")}
		return Loader.trombone(config, {
			tool: "corpus.DocumentContexts",
			corpus: this.corpusid
		}).then(data => data.documentContexts.contexts)
	}
	
	/**
	 * Create a Corpus and return the contexts
	 * @param {object} config 
	 * @param {object} api 
	 */
	static contexts(config, api) {
		return Corpus.load(config).then(corpus => corpus.contexts(api || config));
	}
	
	collocates(config) {
		if ((!config || !config.query) && console) {console.warn("No query provided for collocates request.")}
		return Loader.trombone(config, {
			tool: "corpus.CorpusCollocates",
			corpus: this.corpusid
		}).then(data => data.corpusCollocates.collocates)
	}
	
	/**
	 * Create a Corpus and return the collocates
	 * @param {object} config 
	 * @param {object} api 
	 */
	static collocates(config, api) {
		return Corpus.load(config).then(corpus => corpus.collocates(api || config));
	}

	phrases(config) {
		return Loader.trombone(config, {
			tool: isDocumentsMode(config) ? "corpus.DocumentNgrams" : "corpus.CorpusNgrams",
			corpus: this.corpusid
		}).then(data => isDocumentsMode(config) ? data.documentNgrams.ngrams : data.corpusNgrams.ngrams)
	}
	
	/**
	 * Create a Corpus and return the phrases
	 * @param {object} config 
	 * @param {object} api 
	 */
	static phrases(config, api) {
		return Corpus.load(config).then(corpus => corpus.phrases(api || config));
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
	
	/**
	 * Create a Corpus and return the correlations
	 * @param {object} config 
	 * @param {object} api 
	 */
	static correlations(config, api) {
		return Corpus.load(config).then(corpus => corpus.correlations(api || config));
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

	/**
	 * Create a Corpus and return the tool
	 * @param {*} target 
	 * @param {*} tool 
	 * @param {*} config 
	 * @param {*} api 
	 */
	static tool(target, tool, config, api) {
		return Corpus.load(config).then(corpus => corpus.tool(target, tool, api || config));
	}

	htmltool(html, tool, config) {
		return new Promise((resolve,reject) => {
			this.tool(undefined, tool, config).then(out => resolve(html`${out}`));
		});
	}

	/**
	 * Create a Corpus and return the html tool
	 * @param {*} html 
	 * @param {*} tool 
	 * @param {*} config 
	 * @param {*} api 
	 */
	static htmltool(html, tool, config, api) {
		return Corpus.load(config).then(corpus => corpus.htmltool(html, tool, api || config));
	}

	toString() {
		return this.summary()
	}
		
	/**
	 * Create a new Corpus using the provided config
	 * @param {object} config 
	 */
	static create(config) {
		return Corpus.load(config);
	}

	/**
	 * Load a Corpus using the provided config
	 * @param {object} config The Corpus config
	 */
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

export default Corpus
