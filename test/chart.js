import Chart from '../src/chart';

const seriesData = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

beforeEach(() => {
	document.body.innerHTML = '<div id="target"></div>';
})

test('create chart static', () => {
	const chart = Chart.create(document.getElementById('target'), {
		title: 'Foo',
		subtitle: 'Bar',
		credits: '',
		xAxis: {},
		yAxis: {},
		series: [{
			data: seriesData
		}]
	});

	expect(chart.series[0].data.length).toBe(10);
})

test('create chart', () => {
	const chart = new Chart(document.getElementById('target'), seriesData)

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
	const chart = new Chart(document.getElementById('target'), seriesData);
	const bar = chart.bar();

	expect(bar.series[0].type).toBe('bar');
})

test('line', () => {
	const chart = new Chart(document.getElementById('target'), seriesData);
	const line = chart.line();
	
	expect(line.series[0].type).toBe('line');
})

test.only('scatter', () => {
	const chart = new Chart(document.getElementById('target'), seriesData);
	const scatter = chart.scatter();

	expect(scatter.series[0].type).toBe('scatter');
})

test('networkgraph', () => {
	const chart = new Chart(document.getElementById('target'), seriesData);
	const networkgraph = chart.networkgraph();
	
	expect(networkgraph.series[0].type).toBe('networkgraph');
})
