import Chart from '../src/chart';

test('create chart static', () => {
	document.body.innerHTML = '<div id="target"></div>';

	const chart = Chart.create(document.getElementById('target'), {
		title: 'Foo',
		subtitle: 'Bar',
		credits: '',
		xAxis: {},
		yAxis: {},
		series: [{
			data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
		}]
	});

	expect(chart.series[0].data.length).toBe(10);
})

test('create chart', () => {
	document.body.innerHTML = '<div id="target"></div>';

	const chart = new Chart(document.getElementById('target'), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9])

	expect(chart.data.length).toBe(10);
})

test('setDefaultChartType', () => {
	const config = {
		chart: {}
	};
	Chart.setDefaultChartType(config, 'line');
	expect(config.chart.type).toBe('line')
})

test('bar', () => {
	const chart = new Chart();
	chart.bar();

	expect(chart).toHaveProperty('bar');
})

test('line', () => {
	const chart = new Chart();
	chart.line();
	
	expect(chart).toHaveProperty('line');
})

test('scatter', () => {
	const chart = new Chart();
	chart.scatter();
	
	expect(chart).toHaveProperty('scatter');
})
