/**
 * Class representing a Chart.
 * @memberof Spyral
 * @class
 */
class Chart {
	/**
	 * The Highcharts config object
	 * @typedef {object} HighchartsConfig
	 * @property {(string|object)} title
	 * @property {(string|object)} subtitle
	 * @property {object} credits
	 * @property {object} xAxis
	 * @property {object} yAxis
	 * @property {object} chart
	 * @property {array} series
	 * @property {object} plotOptions
	 */

	/**
	 * Construct a new Chart class
	 * @constructor
	 * @param {element} target 
	 * @param {array} data 
	 */
    constructor(target, data) {
	    this.target = target;
	    this.data = data;
	}

	/**
	 * Create a new chart.
	 * See [Highcharts API](https://api.highcharts.com/highcharts/) for full set of config options.
	 * @param {(string|element)} target 
	 * @param {HighchartsConfig} config 
	 * @returns {Highcharts.Chart}
	 */
	create(target, config) {
		return Highcharts.chart(target, config);
	}
	
	/**
	 * Create a new chart.
	 * See [Highcharts API](https://api.highcharts.com/highcharts/) for full set of config options.
	 * @param {(string|element)} target 
	 * @param {HighchartsConfig} config 
	 * @returns {Highcharts.Chart}
	 */
	static create(target, config) {
		// convert title and suppress if not provided
		if ("title" in config) {
			if (typeof config.title == "string") {
				config.title = {text: config.title};
			}
		} else {
			config.title = false;
		}
		
		// convert subtitle and convert if not provided
		if ("subtitle" in config) {
			if (typeof config.subtitle == "string") {
				config.subtitle = {text: config.subtitle};
			}
		} else {
			config.subtitle = false;
		}
		
		// convert credits
		if (!("credits" in config)) {
			config.credits = false;
		}
		
		// suppress xAxis title unless provided
		if (!("xAxis" in config)) {config.xAxis = {}}
		if (!("title" in config.xAxis)) {
			//config.xAxis.title = false;
		}
	
		// suppress xAxis title unless provided
		if (!("yAxis" in config)) {config.yAxis = {}}
		if (!("title" in config.yAxis)) {
			config.yAxis.title = false;
		}
		
		return Highcharts.chart(target, config);
	}

	/**
	 * Sets the default chart type
	 * @param {object} config The chart config object
	 * @param {string} type The type of chart
	 */
	static setDefaultChartType(config, type) {
		if ("type" in config) {
			config.chart.type = config.type;
			delete config.type;
			return
		}
		
		// TODO: check plot options and series?

		if ("chart" in config) {
			if ("type" in config.chart) {return} // already set
		} else {
			config.chart = {}
		}

		config.chart.type = type;
		return config;
	}

	/**
	 * Add the provided data to the config as a series
	 * @param {object} config 
	 * @param {array} data 
	 */
	static setSeriesData(config, data) {
		if (Array.isArray(data)) {
			if (Array.isArray(data[0])) {
				config.series = data.map(subArray => { return {data: subArray} })
			} else {
				config.series = [{data: data}]
			}
		}
	}

	/**
	 * Create a bar chart
	 * @param {object} [config]
	 * @returns {Highcharts.Chart}
	 */
	bar(config={}) {
		Chart.setSeriesData(config, this.data);
		return Chart.bar(this.target, config)
	}
	/**
	 * Create a bar chart
	 * @param {element} target 
	 * @param {object} config 
	 * @returns {Highcharts.Chart}
	 */
    static bar(target, config) {
		Chart.setDefaultChartType(config, 'bar')
		return Highcharts.chart(target, config)
	}

	/**
	 * Create a line chart
	 * @param {object} [config]
	 * @returns {Highcharts.Chart}
	 */
	line(config={}) {
		Chart.setSeriesData(config, this.data);
		return Chart.line(this.target, config)
	}
	/**
	 * Create a line chart
	 * @param {element} target 
	 * @param {object} config 
	 * @returns {Highcharts.Chart}
	 */
    static line(target, config) {
		Chart.setDefaultChartType(config, 'line')
		return Highcharts.chart(target, config)
	}

	/**
	 * Create a scatter plot
	 * @param {object} [config]
	 * @returns {Highcharts.Chart}
	 */
	scatter(config={}) {
		Chart.setSeriesData(config, this.data);
		return Chart.scatter(this.target, config)
	}
	/**
	 * Create a scatter plot
	 * @param {element} target 
	 * @param {object} config 
	 * @returns {Highcharts.Chart}
	 */
    static scatter(target, config) {
		Chart.setDefaultChartType(config, 'scatter')
		return Highcharts.chart(target, config)
	}

	/**
	 * Create a network graph
	 * @param {object} [config]
	 * @returns {Highcharts.Chart}
	 */
	networkgraph(config={}) {
		config.plotOptions = {
			networkgraph: {
				layoutAlgorithm: {
					enableSimulation: true
				},
				keys: ['from', 'to']
			}
		}
		Chart.setSeriesData(config, this.data);

		return Chart.networkgraph(this.target, config)
	}
	/**
	 * Create a network graph
	 * @param {element} target 
	 * @param {object} config 
	 * @returns {Highcharts.Chart}
	 */
	static networkgraph(target, config) {
		Chart.setDefaultChartType(config, 'networkgraph')
		return Highcharts.chart(target, config);
	}
}

export default Chart
