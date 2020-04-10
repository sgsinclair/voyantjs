const CategoriesManager = {

	_categories: {},
	_features: {},
	_featureDefaults: {},

	getCategories: function() {
		return this._categories;
	},

	getCategoryTerms: function(name) {
		return this._categories[name];
	},
	
	addCategory: function(name) {
		if (this._categories[name] === undefined) {
			this._categories[name] = [];
		}
	},
	renameCategory: function(oldName, newName) {
		var terms = this.getCategoryTerms(oldName);
		this.addTerms(newName, terms);
		for (var feature in this._features) {
			var value = this._features[feature][oldName];
			this.setCategoryFeature(newName, feature, value);
		}
		this.removeCategory(oldName);
		
	},
	removeCategory: function(name) {
		delete this._categories[name];
		for (var feature in this._features) {
			delete this._features[feature][name];
		}
	},
	
	addTerm: function(category, term) {
		this.addTerms(category, [term]);
	},
	addTerms: function(category, terms) {
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
	},
	removeTerm: function(category, term) {
		this.removeTerms(category, [term]);
	},
	removeTerms: function(category, terms) {
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
	},
	
	getCategoryForTerm: function(term) {
		for (var category in this._categories) {
			if (this._categories[category].indexOf(term) != -1) {
				return category;
			}
		}
		return undefined;
	},
	getFeatureForTerm: function(feature, term) {
		return this.getCategoryFeature(this.getCategoryForTerm(term), feature);
	},
	
	getFeatures: function() {
		return this._features;
	},

	addFeature: function(name, defaultValue) {
		if (this._features[name] === undefined) {
			this._features[name] = {};
		}
		if (defaultValue !== undefined) {
			this._featureDefaults[name] = defaultValue;
		}
	},
	removeFeature: function(name) {
		delete this._features[name];
		delete this._featureDefaults[name];
	},
	setCategoryFeature: function(categoryName, featureName, featureValue) {
		if (this._features[featureName] === undefined) {
			this.addFeature(featureName);
		}
		this._features[featureName][categoryName] = featureValue;
	},
	getCategoryFeature: function(categoryName, featureName) {
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
	},
	
	getCategoryExportData: function() {
		return {
			categories: Object.assign({}, this._categories),
			features: Object.assign({}, this._features)
		};
	},

	loadCategoryData: function(id) {
		if (Voyant !== undefined && Ext !== undefined) {
			var dfd = new Ext.Deferred();

			Ext.Ajax.request({
				url: Voyant.application.getTromboneUrl(),
				params: {
					tool: 'resource.StoredCategories',
					retrieveResourceId: id,
					failQuietly: false,
					corpus: this.getCorpus() ? this.getCorpus().getId() : undefined
				}
			}).then(function(response) {
				var json = Ext.decode(response.responseText);
				var id = json.storedCategories.id;
				var value = json.storedCategories.resource;
				if (value.length === 0) {
					dfd.reject();
				} else {
					value = Ext.decode(value);
					
					this._categories = value.categories;
					this._features = value.features;
					
					dfd.resolve(value);
				}
			}, function() {
				this.showError("Unable to load categories data: "+id);
				dfd.reject();
			}, null, this);
			
			return dfd.promise;
		}
    },
    
    saveCategoryData: function(data) {
		if (Voyant !== undefined && Ext !== undefined) {
			data = data || this.getCategoryExportData();
			
			var dfd = new Ext.Deferred();
			
			var dataString = Ext.encode(data);
			Ext.Ajax.request({
				url: Voyant.application.getTromboneUrl(),
				params: {
					tool: 'resource.StoredResource',
					storeResource: dataString
				}
			}).then(function(response) {
				var json = Ext.util.JSON.decode(response.responseText);
				var id = json.storedResource.id;
				dfd.resolve(id);
			}, function(response) {
				dfd.reject();
			});
			
			return dfd.promise;
		}
    }
}

export default CategoriesManager
