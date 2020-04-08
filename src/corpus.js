import Load from './load';

function isDocumentsMode(config) {
	return config && ((config.mode && config.mode === "documents") || config.documents);
}

/**
 * The Corpus class in Spyral. Here's a simple example:
 * 
 * 	loadCorpus("Hello World!").summary();
 * 
 * This loads a corpus and returns an asynchronous `Promise`, but all of the methods
 * of Corpus are appended to the Promise, so {@link #summary} will be called
 * once the Corpus promise is fulfilled. It's equivalent to the following:
 *
 * 	loadCorpus("Hello World!").then(corpus -> corpus.summary());
 *
 * The `loadCorpus` method is actually an alias, so the full form of this would actually be something like this:
 * 
 * 	Spyral.Corpus.load("Hello World").then(corpus -> corpus.summary());
 * 
 * But we like our short-cuts, so the first form is the preferred form.
 * 
 * There is a lot of flexibility in how corpora are created, here's a summary of the parameters:
 * 
 * - **sources**: {@link #corpus}, {@link #input}
 * - **formats**:
 * 	- **Text**: {@link #inputRemoveFrom}, {@link #inputRemoveFromAfter}, {@link #inputRemoveUntil}, {@link #inputRemoveUntilAfter}
 * 	- **XML**: {@link #xmlAuthorXpath}, {@link #xmlCollectionXpath}, {@link #xmlContentXpath}, {@link #xmlExtraMetadataXpath}, {@link #xmlKeywordXpath}, {@link #xmlPubPlaceXpath}, {@link #xmlPublisherXpath}, {@link #xmlTitleXpath}
 * 	- **Tables**: {@link #tableAuthor}, {@link #tableContent}, {@link #tableDocuments}, {@link #tableNoHeadersRow}, {@link #tableTitle}
 * - **other**: {@link #inputFormat}, {@link #subTitle}, {@link #title}, {@link #tokenization}

 * @memberof Spyral
 * @class
 */
class Corpus {
	
/**
 * @cfg {String} corpus The ID of a previously created corpus.
 * 
 * A corpus ID can be used to try to retrieve a corpus that has been previously created.
 * Typically the corpus ID is used as a first string argument, with an optional second
 * argument for other parameters (especially those to recreate the corpus if needed).
 * 
 * 		new Corpus("goldbug");
 * 
 * 		new Corpus("goldbug", {
 *			// if corpus ID "goldbug" isn't found, use the input
 * 			input: "https://gist.githubusercontent.com/sgsinclair/84c9da05e9e142af30779cc91440e8c1/raw/goldbug.txt",
 * 			inputRemoveUntil: 'THE GOLD-BUG',
 * 			inputRemoveFrom: 'FOUR BEASTS IN ONE'
 * 		});
 */

/**
 * @cfg {String/String[]} input Input sources for the corpus.
 * 
 * The input sources can be either normal text or URLs (starting with `http`).
 * 
 * Typically input sources are specified as a string or an array in the first argument, with an optional second argument for other parameters.
 * 
 * 		new Corpus("Hello Voyant!"); // one document with this string
 * 
 * 		new Corpus(["Hello Voyant!", "How are you?"]); // two documents with these strings
 * 
 * 		new Corpus("http://hermeneuti.ca/"); // one document from URL
 * 
 * 		new Corpus(["http://hermeneuti.ca/", "https://en.wikipedia.org/wiki/Voyant_Tools"]); // two documents from URLs
 * 
 * 		new Corpus("Hello Voyant!", "http://hermeneuti.ca/"]); // two documents, one from string and one from URL
 * 
 * 		new Corpus("https://gist.githubusercontent.com/sgsinclair/84c9da05e9e142af30779cc91440e8c1/raw/goldbug.txt", {
 * 			inputRemoveUntil: 'THE GOLD-BUG',
 * 			inputRemoveFrom: 'FOUR BEASTS IN ONE'
 * 		});
 * 
 * 		// use a corpus ID but also specify an input source if the corpus can't be found
 * 		new Corpus("goldbug", {
 * 			input: "https://gist.githubusercontent.com/sgsinclair/84c9da05e9e142af30779cc91440e8c1/raw/goldbug.txt",
 * 			inputRemoveUntil: 'THE GOLD-BUG',
 * 			inputRemoveFrom: 'FOUR BEASTS IN ONE'
 * 		});
 */

/**
 * @cfg {String} inputFormat The input format of the corpus (the default is to auto-detect).
 * 
 * The auto-detect format is usually reliable and inputFormat should only be used if the default
 * behaviour isn't desired. Most of the relevant values are used for XML documents:
 * 
 * - **DTOC**: Dynamic Table of Contexts XML format
 * - **HTML**: Hypertext Markup Language
 * - **RSS**: Really Simple Syndication XML format
 * - **TEI**: Text Encoding Initiative XML format
 * - **TEICORPUS**: Text Encoding Initiative Corpus XML format
 * - **TEXT**: plain text
 * - **XML**: treat the document as XML (sometimes overridding auto-detect of XML vocabularies like RSS and TEI)
 * 
 * Other formats include **PDF**, **MSWORD**, **XLSX**, **RTF**, **ODT**, and **ZIP** (but again, these rarely need to be specified).
 */

/**
 * @cfg {String} tableDocuments Determine what is a document in a table (the entire table, by row, by column); only used for table-based documents.
 * 
 * Possible values are:
 * 
 * - **undefined or blank** (default): the entire table is one document
 * - **rows**: each row of the table is a separate document
 * - **columns**: each column of the table is a separate document
 * 
 * See also [Creating a Corpus Tokenization](#!/guide/corpuscreator-section-tables).
 */

/**
 * @cfg {String} tableContent Determine how to extract body content from the table; only used for table-based documents.
 * 
 * Columns are referred to by numbers, the first is column 1 (not 0).
 * You can specify separate columns by using a comma or you can combined the contents of columns/cells by using a plus sign.
 * 
 * Some examples:
 * 
 * - **1**: use column 1
 * - **1,2**: use columns 1 and 2 separately
 * - **1+2,3**: combine columns 1 and two and use column 3 separately
 * 
 * See also [Creating a Corpus Tokenization](#!/guide/corpuscreator-section-tables).
 */

/**
 * @cfg {String} tableAuthor Determine how to extract the author from each document; only used for table-based documents.
 * 
 * Columns are referred to by numbers, the first is column 1 (not 0).
 * You can specify separate columns by using a comma or you can combined the contents of columns/cells by using a plus sign.
 * 
 * Some examples:
 * 
 * - **1**: use column 1
 * - **1,2**: use columns 1 and 2 separately
 * - **1+2,3**: combine columns 1 and two and use column 3 separately
 * 
 * See also [Creating a Corpus Tokenization](#!/guide/corpuscreator-section-tables).
 */

/**
 * @cfg {String} tableTitle Determine how to extract the title from each document; only used for table-based documents.
 * 
 * Columns are referred to by numbers, the first is column 1 (not 0).
 * You can specify separate columns by using a comma or you can combined the contents of columns/cells by using a plus sign.
 * 
 * Some examples:
 * 
 * - **1**: use column 1
 * - **1,2**: use columns 1 and 2 separately
 * - **1+2,3**: combine columns 1 and two and use column 3 separately
 * 
 * See also [Creating a Corpus Tokenization](#!/guide/corpuscreator-section-tables).
 */

/**
 * @cfg {String} tableContent Determine how to extract body content from the table; only used for table-based documents.
 * 
 * Columns are referred to by numbers, the first is column 1 (not 0).
 * You can specify separate columns by using a comma or you can combined the contents of columns/cells by using a plus sign.
 * 
 * Some examples:
 * 
 * - **1**: use column 1
 * - **1,2**: use columns 1 and 2 separately
 * - **1+2,3**: combine columns 1 and two and use column 3 separately
 * 
 * See also [Creating a Corpus Tokenization](#!/guide/corpuscreator-section-tables).
 */

/**
 * @cfg {String} tableNoHeadersRow Determine if the table has a first row of headers; only used for table-based documents.
 * 
 * Provide a value of "true" if there is no header row, otherwise leave it blank or undefined (default).
 * 
 * See also [Creating a Corpus Tokenization](#!/guide/corpuscreator-section-tables).
 */

/**
 * @cfg {String} tokenization The tokenization strategy to use
 * 
 * This should usually be undefined, unless specific behaviour is required. These are the valid values:
 * 
 * - **undefined or blank**: use the default tokenization (which uses Unicode rules for word segmentation)
 * - **wordBoundaries**: use any Unicode character word boundaries for tokenization
 * - **whitespace**: tokenize by whitespace only (punctuation and other characters will be kept with words)
 * 
 * See also [Creating a Corpus Tokenization](#!/guide/corpuscreator-section-tokenization).
 */

/**
 * @cfg {String} xmlContentXpath The XPath expression that defines the location of document content (the body); only used for XML-based documents.
 * 
 * 		new Corpus("<doc><head>Hello world!</head><body>This is Voyant!</body></doc>", {
 * 			 xmlContentXpath: "//body"
 * 		}); // document would be: "This is Voyant!"
 * 
 * See also [Creating a Corpus with XML](#!/guide/corpuscreator-section-xml).
 */

/**
 * @cfg {String} xmlTitleXpath The XPath expression that defines the location of each document's title; only used for XML-based documents.
 * 
 * 		new Corpus("<doc><title>Hello world!</title><body>This is Voyant!</body></doc>", {
 * 			 xmlTitleXpath: "//title"
 * 		}); // title would be: "Hello world!"
 * 
 * See also [Creating a Corpus with XML](#!/guide/corpuscreator-section-xml).
 */

/**
 * @cfg {String} xmlAuthorXpath The XPath expression that defines the location of each document's author; only used for XML-based documents.
 * 
 * 		new Corpus("<doc><author>Stéfan Sinclair</author><body>This is Voyant!</body></doc>", {
 * 			 xmlAuthorXpath: "//author"
 * 		}); // author would be: "Stéfan Sinclair"
 * 
 * See also [Creating a Corpus with XML](#!/guide/corpuscreator-section-xml).
 */

/**
 * @cfg {String} xmlPubPlaceXpath The XPath expression that defines the location of each document's publication place; only used for XML-based documents.
 * 
 * 		new Corpus("<doc><pubPlace>Montreal</pubPlace><body>This is Voyant!</body></doc>", {
 * 			 xmlPubPlaceXpath: "//pubPlace"
 * 		}); // publication place would be: "Montreal"
 * 
 * See also [Creating a Corpus with XML](#!/guide/corpuscreator-section-xml).
 */

/**
 * @cfg {String} xmlPublisherXpath The XPath expression that defines the location of each document's publisher; only used for XML-based documents.
 * 
 * 		new Corpus("<doc><publisher>The Owl</publisher><body>This is Voyant!</body></doc>", {
 * 			 xmlPublisherXpath: "//publisher"
 * 		}); // publisher would be: "The Owl"
 * 
 * See also [Creating a Corpus with XML](#!/guide/corpuscreator-section-xml).
 */

/**
 * @cfg {String} xmlKeywordXpath The XPath expression that defines the location of each document's keywords; only used for XML-based documents.
 * 
 * 		new Corpus("<doc><keyword>text analysis</keyword><body>This is Voyant!</body></doc>", {
 * 			 xmlKeywordXpath: "//keyword"
 * 		}); // publisher would be: "text analysis"
 * 
 * See also [Creating a Corpus with XML](#!/guide/corpuscreator-section-xml).
 */

/**
 * @cfg {String} xmlCollectionXpath The XPath expression that defines the location of each document's collection name; only used for XML-based documents.
 * 
 * 		new Corpus("<doc><collection>documentation</collection><body>This is Voyant!</body></doc>", {
 * 			 xmlCollectionXpath: "//collection"
 * 		}); // publisher would be: "documentation"
 * 
 * See also [Creating a Corpus with XML](#!/guide/corpuscreator-section-xml).
 */

/**
 * @cfg {String} xmlGroupByXpath The XPath expression that defines the location of each document's collection name; only used for XML-based documents.
 * 
 * 		new Corpus("<doc><sp s='Juliet'>Hello!</sp><sp s='Romeo'>Hi!</sp><sp s='Juliet'>Bye!</sp></doc>", {
 * 			 xmlDocumentsXPath: '//sp',
 *           xmlGroupByXpath: "//@s"
 * 		}); // two docs: "Hello! Bye!" (Juliet) and "Hi!" (Romeo)
 * 
 * See also [Creating a Corpus with XML](#!/guide/corpuscreator-section-xml).
 */

/**
 * @cfg {String} xmlExtraMetadataXpath A value that defines the location of other metadata; only used for XML-based documents.
 * 
 * 		new Corpus("<doc><tool>Voyant</tool><phase>1</phase><body>This is Voyant!</body></doc>", {
 * 			 xmlExtraMetadataXpath: "tool=//tool\nphase=//phase"
 * 		}); // tool would be "Voyant" and phase would be "1"
 * 
 * Note that `xmlExtraMetadataXpath` is a bit different from the other XPath expressions in that it's
 * possible to define multiple values (each on its own line) in the form of name=xpath.
 * 
 * See also [Creating a Corpus with XML](#!/guide/corpuscreator-section-xml).
 */

/**
 * @cfg {String} xmlExtractorTemplate Pass the XML document through the XSL template located at the specified URL before extraction (this is ignored in XML-based documents).
 * 
 * This is an advanced parameter that allows you to define a URL of an XSL template that can
 * be called *before* text extraction (in other words, the other XML-based parameters apply
 * after this template has been processed).
 */

/**
 * @cfg {String} inputRemoveUntil Omit text up until the start of the matching regular expression (this is ignored in XML-based documents).
 * 
 * 		new Corpus("Hello world! This is Voyant!", {
 * 			 inputRemoveUntil: "This"
 * 		}); // document would be: "This is Voyant!"
 * 
 * See also [Creating a Corpus with Text](#!/guide/corpuscreator-section-text).
 */

/**
 * @cfg {String} inputRemoveUntilAfter Omit text up until the end of the matching regular expression (this is ignored in XML-based documents).
 * 
 * 		new Corpus("Hello world! This is Voyant!", {
 * 			 inputRemoveUntilAfter: "world!"
 * 		}); // document would be: "This is Voyant!"
 * 
 * See also [Creating a Corpus with Text](#!/guide/corpuscreator-section-text).
 */

/**
 * @cfg {String} inputRemoveFrom Omit text from the start of the matching regular expression (this is ignored in XML-based documents).
 * 
 * 		new Corpus("Hello world! This is Voyant!", {
 * 			 inputRemoveFrom: "This"
 * 		}); // document would be: "Hello world!"
 * 
 * See also [Creating a Corpus with Text](#!/guide/corpuscreator-section-text).
 */

/**
 * @cfg {String} inputRemoveFromAfter Omit text from the end of the matching regular expression (this is ignored in XML-based documents).
 * 
 * 		new Corpus("Hello world! This is Voyant!", {
 * 			 inputRemoveFromAfter: "world!"
 * 		}); // document would be: "Hello world!"
 * 
 * See also [Creating a Corpus with Text](#!/guide/corpuscreator-section-text).
 */

/**
 * @cfg {String} subTitle A sub-title for the corpus.
 * 
 * This is currently not used, except in the Dynamic Table of Contexts skin. Still, it may be worth specifying a subtitle for later use.
 */

/**
 * @cfg {String} title A title for the corpus.
 * 
 * This is currently not used, except in the Dynamic Table of Contexts skin. Still, it may be worth specifying a title for later use.
 */
 
 /**
 * @cfg {String} curatorTsv a simple TSV of paths and labels for the DToC interface
 *
 * The DToC skin allows curation of XML tags and attributes in order to constrain the entries shown in the interface or to provide friendlier labels. This assumes plain text unicode input with one definition per line where the simple XPath expression is separated by a tab from a label.
 *
 *   	 p    	 paragraph
 *   	 ref[@target*="religion"]    	 religion
 *
  * For more information see the DToC documentation on [Curating Tags](http://cwrc.ca/Documentation/public/index.html#DITA_Files-Various_Applications/DToC/CuratingTags.html)
 */
	
	/*
	 * Create a new Corpus using the specified Corpus ID
	 * @constructor
	 * @param {string} id The Corpus ID
	 */
	constructor(id) {
		this.corpusid = id;
	}

	static Load = Load;

	static setBaseUrl(baseUrl) {
		Load.setBaseUrl(baseUrl);
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
		return Load.trombone(config, {
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
		return Load.trombone(config, {
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
		return Load.trombone(config, {
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
		return Load.trombone(config, {
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
		return Load.trombone(config, {
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
		return Load.trombone(config, {
			tool: "corpus.DocumentTokens",
			noOthers: true,
			corpus: this.corpusid
		}).then(data => data.documentTokens.tokens.map(t => t.term))
	}

	/**
	 * Create a Corpus and return an array of lexical forms (words) in document order.
	 * @param {object} config 
	 * @param {object} api 
	 */
	static words(config, api) {
		return Corpus.load(config).then(corpus => corpus.words(api || config));
	}
	
	contexts(config) {
		if ((!config || !config.query) && console) {console.warn("No query provided for contexts request.")}
		return Load.trombone(config, {
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
		return Load.trombone(config, {
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
		return Load.trombone(config, {
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
		return Load.trombone(config, {
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
	
	tool(_tool, config = {}) {
		let me = this;
		return new Promise((resolve, reject) => {
			
			let isTool = function(obj) {return obj && (typeof obj=="string" && /\W/.test(obj)==false) || (typeof obj == "object" && "forTool" in obj)}
			let isConfig = function(obj) {return obj && typeof obj == "object" && !("forTool" in obj)}
			let lastArg = arguments[arguments.length-1];
			config = isConfig(lastArg) ? lastArg : {};
			
			// we have all tools and we'll show them individually
			if (isTool(_tool) && (isTool(lastArg) || isConfig(lastArg))) {
				let defaultAttributes = {
					width: undefined,
					height: undefined,
					style: "width: 350px; height: 350px",
					float: "right"
				}
				let out = "";
				for (let i=0; i<arguments.length; i++) {
					let t = arguments[i];
					if (isTool(t)) {
						if (typeof t == "string") {t = {forTool: t}} // make sure we have object
						
						// build iframe tag
						out+="<iframe ";
						for (let attr in defaultAttributes) {
							var val = (attr in t ? t[attr] : undefined) || (attr in config ? config[attr] : undefined) || (attr in defaultAttributes ? defaultAttributes[attr] : undefined);
							if (val!==undefined) {
								out+=' '+attr+'="'+val+'"';
							}
						}
						
						// build url
						var url = new URL((config && config.voyantUrl ? config.voyantUrl : Load.baseUrl) + "tool/"+t.forTool+"/");
						url.searchParams.append("corpus", me.corpusid);			
						// add API values from config (some may be ignored)
						let all = Object.assign(t,config);
						Object.keys(all).forEach(key => {
							if (key !=="input" && !(key in defaultAttributes)) {
								url.searchParams.append(key, all[key])
							}
						});
						
						// finish tag
						out+=' src="'+url+'"></iframe>'
					}
				}
				return resolve(out);
			} else {
				if (Array.isArray(_tool)) {
					_tool = _tool.join(";")
				}
				
				let defaultAttributes = {
					width: undefined,
					height: undefined,
					style: "width: 90%; height: "+(350*(_tool ? _tool : "").split(";").length)+"px"
				}
				
				// build iframe tag
				let out ="<iframe ";
				for (let attr in defaultAttributes) {
					var val = (attr in config ? config[attr] : undefined) || (attr in defaultAttributes ? defaultAttributes[attr] : undefined);
					if (val!==undefined) {
						out+=' '+attr+'="'+val+'"';
					}
				}

				// build url
				var url = new URL((config && config.voyantUrl ? config.voyantUrl : Load.baseUrl)+(_tool ? ("?view=customset&tableLayout="+_tool) : ""));
				url.searchParams.append("corpus", me.corpusid);			
				// add API values from config (some may be ignored)
				Object.keys(config).forEach(key => {
					if (key !=="input" && !(key in defaultAttributes)) {
						url.searchParams.append(key, config[key])
					}
				});
				resolve(out+" src='"+url+"'></iframe");
			}
		})
	}

	/**
	 * Create a Corpus and return the tool
	 * @param {*} tool 
	 * @param {*} config 
	 * @param {*} api 
	 */
	static tool(tool, config, api) {
		return Corpus.load(config).then(corpus => corpus.tool(tool, config, api));
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
					Load.trombone(config, {tool: "corpus.CorpusMetadata"})
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
