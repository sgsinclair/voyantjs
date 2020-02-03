import * as Highcharts from 'highcharts';

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
	 */

	/**
	 * Construct a new Chart class
	 * @constructor
	 * @param {*} target 
	 * @param {*} data 
	 */
    constructor(target, data) {
	    this.target = target;
	    this.data = data;
	}

	/**
	 * Create a new chart.
	 * See {@link https://api.highcharts.com/highcharts/} for full set of config options.
	 * @param {(string|element)} target 
	 * @param {HighchartsConfig} config 
	 * @returns {Highcharts.Chart}
	 */
	create(target, config) {
		return Highcharts.chart(target, config);
	}
	
	/**
	 * Create a new chart
	 * See {@link https://api.highcharts.com/highcharts/} for full set of config options.
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

	static setDefaultChartType(config, type) {
		if ("type" in config) {
			config.chart.type = config.type;
			delete config.type;
			return
		}
		// TODO: check plot options and series?
		if ("chart" in config && "type" in config.chart) {return} // already set
		config.chart.type = type;
		return;
	}

    bar(config) {
    }
    line(config) {
    }
    scatter(config) {
    }
}

export default Chart
