import CategoriesManager from '../src/categories';


beforeAll(() => {
})

beforeEach(() => {
})

test('categories', () => {
	CategoriesManager.addCategory('foo');
	expect(Object.keys(CategoriesManager.getCategories()).length).toBe(1);
	expect(CategoriesManager.getCategoryTerms('foo')).toBeDefined();

	CategoriesManager.renameCategory('foo', 'bar');
	expect(CategoriesManager.getCategoryTerms('foo')).toBeUndefined();
	expect(CategoriesManager.getCategoryTerms('bar')).toBeDefined();

	CategoriesManager.addTerm('bar', 'baz');
	CategoriesManager.addTerm('bar', 'qux');

	CategoriesManager.removeTerm('bar', 'baz');
	expect(CategoriesManager.getCategoryForTerm('qux')).toBe('bar');
})

test('features', () => {
	CategoriesManager.addFeature('color', '#ff6700');
	expect(CategoriesManager.getFeatures()['color']).toBeDefined();

	expect(CategoriesManager.getCategoryFeature('foo', 'color')).toBe('#ff6700');

	CategoriesManager.addCategory('foo');
	CategoriesManager.setCategoryFeature('foo', 'color', '#000000');
	expect(CategoriesManager.getCategoryFeature('foo', 'color')).toBe('#000000');

	CategoriesManager.removeFeature('color');
	
	const data = CategoriesManager.getCategoryExportData();
	expect(Object.keys(data.features).length).toBe(0);
})