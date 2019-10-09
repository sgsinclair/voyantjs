import * as Chart from '../src/chart';

test('chart', () => {
	document.body.innerHTML = '<div id="target"></div>';

	const chart = Chart.chart(document.getElementById('target'), {
		series: [{
			data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
		}]
	});

	expect(chart.series[0].data.length).toBe(10);
})
