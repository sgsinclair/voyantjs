import Categories from '../src/categories';


beforeAll(() => {
})

beforeEach(() => {
})

test('categories', () => {
	const categories = new Categories();
	categories.addCategory('foo');
	expect(Object.keys(categories.getCategories()).length).toBe(1);
	expect(categories.getCategoryTerms('foo')).toBeDefined();

	categories.renameCategory('foo', 'bar');
	expect(categories.getCategoryTerms('foo')).toBeUndefined();
	expect(categories.getCategoryTerms('bar')).toBeDefined();

	categories.addTerm('bar', 'baz');
	categories.addTerm('bar', 'qux');

	categories.removeTerm('bar', 'baz');
	expect(categories.getCategoryForTerm('qux')).toBe('bar');

	categories.addTerm('foo2', 'qux');
	expect(categories.getCategoriesForTerm('qux').length).toBe(2);

	categories.setCategoryRanking('foo2', 0);
	expect(categories.getCategoryRanking('bar')).toBe(1);
})

test('features', () => {
	const categories = new Categories();
	categories.addFeature('color', '#ff6700');
	expect(categories.getFeatures()['color']).toBeDefined();

	expect(categories.getCategoryFeature('foo', 'color')).toBe('#ff6700');

	categories.addCategory('foo');
	categories.setCategoryFeature('foo', 'color', '#000000');
	expect(categories.getCategoryFeature('foo', 'color')).toBe('#000000');

	categories.removeFeature('color');
	
	const data = categories.getCategoryExportData();
	expect(Object.keys(data.features).length).toBe(0);
})