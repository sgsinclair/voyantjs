/* global Voyant, Ext, Spyral */

import FileInput from './fileinput';

/**
 * Class embodying Load functionality.
 * @memberof Spyral
 * @class
 */
class Load {
	static baseUrl;

	/**
	 * Set the base URL for use with the Load class
	 * @param {string} baseUrl 
	 */
	static setBaseUrl(baseUrl) {
		this.baseUrl = baseUrl;
	}

	/**
	 * Make a call to trombone
	 * @param {Object} config 
	 * @param {Object} params
	 * @returns {JSON}
	 */
	static trombone(config = {}, params) {
		let url = new URL(config.trombone ? config.trombone : this.baseUrl + 'trombone', window.location.origin);
		delete config.trombone;
		
		let all = { ...config, ...params };
		for (let key in all) {
			if (all[key] === undefined) { delete all[key]; }
		}
		let searchParams = Object.keys(all).map((key) => {
			if (all[key] instanceof Array) {
				return all[key].map((val) => {
					return encodeURIComponent(key) + '=' + encodeURIComponent(val);
				}).join('&');
			} else {
				return encodeURIComponent(key) + '=' + encodeURIComponent(all[key]);
			}
		}).join('&');
		
		if ('method' in all === false) {
			all.method = 'GET';
		}

		let opt = {};
		if (all.method === 'GET') {
			if (searchParams.length < 800) {
				for (let key in all) {
					if (all[key] instanceof Array) {
						all[key].forEach((val) => {
							url.searchParams.append(key, val);	
						});
					} else {
						url.searchParams.set(key, all[key]);
					}
				}
			} else {
				opt = {
					method: 'POST',
					headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
					body: searchParams
				};
			}
		} else if (all.method === 'POST') {
			opt = {
				method: 'POST'
			};
			if ('body' in all) {
				opt.body = all['body'];
			} else {
				opt.headers = { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' };
				opt.body = searchParams;
			}
		} else {
			console.warn('Load.trombone: unsupported method:', all.method);
		}
		
		return fetch(url.toString(), opt).then(response => {
			if (response.ok) {
				return response.json();
			}
			else {
				return response.text().then(text => {
					if (Voyant && Voyant.util && Voyant.util.DetailedError) {
						new Voyant.util.DetailedError({
							msg: '',
							error: text.split(/(\r\n|\r|\n)/).shift(),
							details: text
						}).showMsg();
					} else {
						alert(text.split(/(\r\n|\r|\n)/).shift());
						if (window.console) { console.error(text); }
					}
					throw Error(text);
				});
			}
		});
	}

	/**
	 * Fetch content from a URL, often resolving cross-domain data constraints
	 * @param {string} urlToFetch 
	 * @param {Object} config
	 * @returns {Response}
	 */
	static load(urlToFetch, config) {
		let url = new URL(config && config.trombone ? config.trombone : this.baseUrl + 'trombone');
		url.searchParams.set('fetchData', urlToFetch);
		return fetch(url.toString()).then(response => {
			if (response.ok) {
				return response;
			}
			else {
				return response.text().then(text => {
					if (Voyant && Voyant.util && Voyant.util.DetailedError) {
						new Voyant.util.DetailedError({
							error: text.split(/(\r\n|\r|\n)/).shift(),
							details: text
						}).showMsg();
					} else {
						alert(text.split(/(\r\n|\r|\n)/).shift());
						if (window.console) { console.error(text); }
					}
					throw Error(text);
				});
			}
		}).catch(err => { throw err; });
	}

	/**
	 * Fetch HTML content from a URL
	 * @param {string} url 
	 * @returns {Document}
	 */
	static html(url) {
		return this.text(url).then(text => new DOMParser().parseFromString(text, 'text/html'));
	}

	/**
	 * Fetch XML content from a URL
	 * @param {string} url 
	 * @returns {XMLDocument}
	 */
	static xml(url) {
		return this.text(url).then(text => new DOMParser().parseFromString(text, 'text/xml'));
	}

	/**
	 * Fetch JSON content from a URL
	 * @param {string} url 
	 * @returns {JSON}
	 */
	static json(url) {
		return this.load(url).then(response => response.json());
	}

	/**
	 * Fetch text content from a URL
	 * @param {string} url 
	 * @returns {string}
	 */
	static text(url) {
		return this.load(url).then(response => response.text());
	}

	/**
	 * Create a file input in the target element and returns a Promise that's resolved with the file(s) that is added to the input.
	 * The file is also temporarily stored in the session storage for successive retrieval.
	 * @param {HTMLElement} target The target element to append the input to
	 * @returns {Promise}
	 */
	static files(target = undefined) {
		let hasPreExistingTarget = false;

		function createTarget() {
			if (typeof Spyral !== 'undefined' && Spyral.Notebook && typeof Ext !== 'undefined') {
				const spyralTarget = Spyral.Notebook.getTarget();

				// check for pre-existing target
				const codeWrapper = spyralTarget.closest('.notebook-code-wrapper');
				if (codeWrapper === null) {
					console.warn('Spyral.Load.files: can\'t find CodeEditorWrapper parent');
					target = null;
				} else {
					target = codeWrapper.querySelector('[spyral-temp-doc]');
				}

				if (target === null) {
					// add a component so that vbox layout will be properly calculated
					const resultsCmp = Ext.getCmp(spyralTarget.getAttribute('id'));
					const codeEditorCell = resultsCmp.findParentByType('notebookcodeeditorwrapper');
					const targetConfig = codeEditorCell._getUIComponent('');
					const targetCmp = codeEditorCell.insert(1, targetConfig); // insert after code cell
					codeEditorCell.setHeight(codeEditorCell.getHeight()+80); // need to explicitly adjust height for added component to be visible

					target = targetCmp.getEl().dom;
				} else {
					hasPreExistingTarget = true;
					target = target.parentElement;
				}
			} else {
				target = document.createElement('div');
				target.setAttribute('class', 'target');
				document.body.appendChild(target);
			}
		}

		if (target === undefined) {
			createTarget();
		}

		let promise;
		if (hasPreExistingTarget) {
			promise = new Promise(async(resolve, reject) => {
				const storedFiles = await FileInput.getStoredFiles(target);
				if (storedFiles !== null) {
					resolve(storedFiles);
					return;
				} else {
					// files have been removed so re-create the input
					FileInput.destroy(target);
					createTarget();

					const deleteMsg = 'The previously added files have been deleted. You will need to add new files.';
					if (typeof Voyant !== 'undefined' && typeof Ext !== 'undefined') {
						Ext.ComponentQuery.query('notebook')[0].toastError({
							html: deleteMsg,
							anchor: 'tr'
						});
					} else {
						alert(deleteMsg);
					}
				}
	
				new FileInput(target, resolve, reject);
			});
		} else {
			promise = new Promise((resolve, reject) => {
				new FileInput(target, resolve, reject);
			});
		}
		
		// graft this function to avoid need for then
		promise.setNextBlockFromFiles = function() {
			var args = arguments;
			return this.then(files => {
				return Spyral.Notebook.setNextBlockFromFiles.apply(Load, [files].concat(Array.from(args)));
			});
		};
		
		promise.loadCorpusFromFiles = function() {
			var args = arguments;
			return this.then(files => {
				return Spyral.Corpus.load.apply(Spyral.Corpus, [files].concat(Array.from(args)));
			});
		};
		
		return promise;
		
	}
}

export default Load;
