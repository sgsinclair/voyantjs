function id(len) {
	len = len || 8;
	// http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
	return Math.random().toString(36).substring(2, 2+len) + Math.random().toString(36).substring(2, 2+len)
}

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
	 * @param {object} config 
	 * @param {object} params
	 * @returns {JSON}
	 */
	static trombone(config = {}, params) {
		let url = new URL(config.trombone ? config.trombone : this.baseUrl + "trombone");
		let all = { ...config, ...params };
		for (var key in all) {
			if (all[key] === undefined) { delete all[key] }
		}
		let searchParams = Object.keys(all).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(all[key])).join("&")
		let opt = {};
		if (searchParams.length < 800 || ("method" in all && all["method"] == "GET")) {
			for (var key in all) { url.searchParams.set(key, all[key]); }
		} else {
			opt = {
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
				body: searchParams
			}
		}
		return fetch(url.toString(), opt).then(response => {
			if (response.ok) {
				return response.json()
			}
			else {
				return response.text().then(text => {
					if (Voyant && Voyant.util && Voyant.util.DetailedError) {
						new Voyant.util.DetailedError({
							msg: "",
							error: text.split(/(\r\n|\r|\n)/).shift(),
							details: text
						}).showMsg();
					} else {
						alert(text.split(/(\r\n|\r|\n)/).shift())
						if (window.console) { console.error(text) }
					}
					throw Error(text);
				});
			}
		})
	}

	/**
	 * Fetch content from a URL, often resolving cross-domain data constraints
	 * @param {string} urlToFetch 
	 * @param {object} config
	 * @returns {Response}
	 */
	static load(urlToFetch, config) {
		let url = new URL(config && config.trombone ? config.trombone : this.baseUrl + "trombone");
		url.searchParams.set("fetchData", urlToFetch);
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
						alert(text.split(/(\r\n|\r|\n)/).shift())
						if (window.console) { console.error(text) }
					}
					throw Error(text);
				});
			}
		}).catch(err => { throw err })
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
	 * Create a file input in the target element and returns a Promise that's resolved with the file that is added to the input.
	 * The file is also temporarily stored in the session storage for successive retrieval.
	 * @param {element} target The target element to append the input to
	 * @returns {Promise}
	 */
	static file(target = undefined) {
		if (target === undefined) {
			if (typeof Spyral !== 'undefined' && Spyral.Notebook) {
				target = Spyral.Notebook.getTarget();
			} else {
				target = document.createElement("div");
				document.body.appendChild(target);
			}
		}
		return new Promise((resolve, reject) => {
			if (target.hasAttribute('spyral-temp-doc')) {
				const storedFile = window.sessionStorage.getItem(target.getAttribute('spyral-temp-doc'));
				if (storedFile !== null) {
					resolve(storedFile);
					return;
				}
			}

			const fileInput = document.createElement('input');
			fileInput.setAttribute('type', 'file');
			fileInput.addEventListener('change', function(event) {
				const fr = new FileReader();
				fr.onload = (e) => {
					const file = e.target.result;
					resolve(file)
					window.sessionStorage.setItem(target.getAttribute('spyral-temp-doc'), file);
				}
				fr.readAsText(this.files[0]);
			}, false);
			target.appendChild(fileInput);
			target.setAttribute('spyral-temp-doc', id(16));
		})
		
	}
}

export default Load
