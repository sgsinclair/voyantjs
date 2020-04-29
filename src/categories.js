/**
 * Class for working with categories and features.
 * Categories are groupings of terms.
 * Features are arbitrary properties (font, color) that are associated with each category.
 * @memberof Spyral
 * @class
 */
class Categories {

	/**
	 * Construct a new Categories class
	 */
	constructor() {
		this._categories = {};
		this._features = {};
		this._featureDefaults = {};
	}

	/**
	 * Get the categories
	 * @returns {object}
	 */
	getCategories() {
		return this._categories;
	}

	/**
	 * Get the terms for a category
	 * @param {string} name 
	 * @returns {array}
	 */
	getCategoryTerms(name) {
		return this._categories[name];
	}
	
	/**
	 * Add a new category
	 * @param {string} name 
	 */
	addCategory(name) {
		if (this._categories[name] === undefined) {
			this._categories[name] = [];
		}
	}

	/**
	 * Rename a category
	 * @param {string} oldName 
	 * @param {string} newName 
	 */
	renameCategory(oldName, newName) {
		var terms = this.getCategoryTerms(oldName);
		this.addTerms(newName, terms);
		for (var feature in this._features) {
			var value = this._features[feature][oldName];
			this.setCategoryFeature(newName, feature, value);
		}
		this.removeCategory(oldName);
		
	}

	/**
	 * Remove a category
	 * @param {string} name 
	 */
	removeCategory(name) {
		delete this._categories[name];
		for (var feature in this._features) {
			delete this._features[feature][name];
		}
	}
	
	/**
	 * Add a term to a category
	 * @param {string} category 
	 * @param {string} term 
	 */
	addTerm(category, term) {
		this.addTerms(category, [term]);
	}

	/**
	 * Add multiple terms to a category
	 * @param {string} category 
	 * @param {array} terms 
	 */
	addTerms(category, terms) {
		if (!Array.isArray(terms)) {
			terms = [terms];
		}
		if (this._categories[category] === undefined) {
			this.addCategory(category);
		}
		for (var i = 0; i < terms.length; i++) {
			var term = terms[i];
			if (this._categories[category].indexOf(term) === -1) {
				this._categories[category].push(term);
			}
		}
	}

	/**
	 * Remove a term from a category
	 * @param {string} category 
	 * @param {string} term 
	 */
	removeTerm(category, term) {
		this.removeTerms(category, [term]);
	}

	/**
	 * Remove multiple terms from a category
	 * @param {string} category 
	 * @param {array} terms 
	 */
	removeTerms(category, terms) {
		if (!Array.isArray(terms)) {
			terms = [terms];
		}
		if (this._categories[category] !== undefined) {
			for (var i = 0; i < terms.length; i++) {
				var term = terms[i];
				var index = this._categories[category].indexOf(term);
				if (index !== -1) {
					this._categories[category].splice(index, 1);
				}
			}
		}
	}
	
	/**
	 * Get the category that a term belongs to
	 * @param {string} term 
	 * @return {object}
	 */
	getCategoryForTerm(term) {
		for (var category in this._categories) {
			if (this._categories[category].indexOf(term) != -1) {
				return category;
			}
		}
		return undefined;
	}

	/**
	 * Get the feature for a term
	 * @param {string} feature 
	 * @param {string} term 
	 * @returns {*}
	 */
	getFeatureForTerm(feature, term) {
		return this.getCategoryFeature(this.getCategoryForTerm(term), feature);
	}
	
	/**
	 * Get the features
	 * @returns {object}
	 */
	getFeatures() {
		return this._features;
	}

	/**
	 * Add a feature
	 * @param {string} name 
	 * @param {*} defaultValue 
	 */
	addFeature(name, defaultValue) {
		if (this._features[name] === undefined) {
			this._features[name] = {};
		}
		if (defaultValue !== undefined) {
			this._featureDefaults[name] = defaultValue;
		}
	}

	/**
	 * Remove a feature
	 * @param {string} name 
	 */
	removeFeature(name) {
		delete this._features[name];
		delete this._featureDefaults[name];
	}

	/**
	 * Set the feature for a category
	 * @param {string} categoryName 
	 * @param {string} featureName 
	 * @param {*} featureValue 
	 */
	setCategoryFeature(categoryName, featureName, featureValue) {
		if (this._features[featureName] === undefined) {
			this.addFeature(featureName);
		}
		this._features[featureName][categoryName] = featureValue;
	}

	/**
	 * Get the feature for a category
	 * @param {string} categoryName 
	 * @param {string} featureName 
	 * @returns {*}
	 */
	getCategoryFeature(categoryName, featureName) {
		var value = undefined;
		if (this._features[featureName] !== undefined) {
			value = this._features[featureName][categoryName];
			if (value === undefined) {
				value = this._featureDefaults[featureName];
				if (typeof value === 'function') {
					value = value();
				}
			}
		}
		return value;
	}
	
	/**
	 * Get a copy of the category and feature data
	 * @return {object}
	 */
	getCategoryExportData() {
		return {
			categories: Object.assign({}, this._categories),
			features: Object.assign({}, this._features)
		};
	}
}

export default Categories
