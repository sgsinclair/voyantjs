/**
 * A helper for working with the Voyant Notebook app.
 * @memberof Spyral
 */
class Util {

	/**
	 * Generates a random ID of the specified length.
	 * @param {number} len The length of the ID to generate?
	 * @returns {string}
	 */
	static id(len = 8) {
		// based on https://stackoverflow.com/a/13403498
		const times = Math.ceil(len / 11);
		let id = '';
		for (let i = 0; i < times; i++) {
			id += Math.random().toString(36).substring(2); // the result of this is 11 characters long
		}
		return id.substring(0, len);
	}

	/**
	 * 
	 * @param {array|object|string} contents 
	 * @returns {string}
	 */
	static toString(contents) {
		if (contents.constructor === Array || contents.constructor===Object) {
			contents = JSON.stringify(contents);
			if (contents.length>500) {
				contents = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/><path d="M0 0h24v24H0z" fill="none"/></svg>'+contents.substring(0,500)+" <a href=''>+</a><div style='display: none'>"+contents.substring(501)+"</div>";
			}
		}
		return contents.toString();
	}

	/**
	 * 
	 * @param {string} before 
	 * @param {string} more 
	 * @param {string} after 
	 */
	static more(before, more, after) {
		return before + '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/><path d="M0 0h24v24H0z" fill="none"/></svg>'+more.substring(0,500)+" <a href=''>+</a><div style='display: none'>"+more.substring(501)+"</div>" + after;

	}
}

export default Util
