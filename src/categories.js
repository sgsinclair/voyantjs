class Categories {

	constructor() {
		this._categories = {};
		this._features = {};
		this._featureDefaults = {};
	}

	getCategories() {
		return this._categories;
	}

	getCategoryTerms(name) {
		return this._categories[name];
	}
	
	addCategory(name) {
		if (this._categories[name] === undefined) {
			this._categories[name] = [];
		}
	}
	renameCategory(oldName, newName) {
		var terms = this.getCategoryTerms(oldName);
		this.addTerms(newName, terms);
		for (var feature in this._features) {
			var value = this._features[feature][oldName];
			this.setCategoryFeature(newName, feature, value);
		}
		this.removeCategory(oldName);
		
	}
	removeCategory(name) {
		delete this._categories[name];
		for (var feature in this._features) {
			delete this._features[feature][name];
		}
	}
	
	addTerm(category, term) {
		this.addTerms(category, [term]);
	}
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
	removeTerm(category, term) {
		this.removeTerms(category, [term]);
	}
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
	
	getCategoryForTerm(term) {
		for (var category in this._categories) {
			if (this._categories[category].indexOf(term) != -1) {
				return category;
			}
		}
		return undefined;
	}
	getFeatureForTerm(feature, term) {
		return this.getCategoryFeature(this.getCategoryForTerm(term), feature);
	}
	
	getFeatures() {
		return this._features;
	}

	addFeature(name, defaultValue) {
		if (this._features[name] === undefined) {
			this._features[name] = {};
		}
		if (defaultValue !== undefined) {
			this._featureDefaults[name] = defaultValue;
		}
	}
	removeFeature(name) {
		delete this._features[name];
		delete this._featureDefaults[name];
	}
	setCategoryFeature(categoryName, featureName, featureValue) {
		if (this._features[featureName] === undefined) {
			this.addFeature(featureName);
		}
		this._features[featureName][categoryName] = featureValue;
	}
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
	
	getCategoryExportData() {
		return {
			categories: Object.assign({}, this._categories),
			features: Object.assign({}, this._features)
		};
	}
}

export default Categories
