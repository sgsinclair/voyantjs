import "../node_modules/highcharts/highcharts.js"

export function chart(target, config) {
	
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
	
	console.warn(config)
	return Highcharts.chart(target, config);
}

export function setDefaultChartType(config, type) {
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


class Chart {
    constructor(target, data) {
	    this.target = target;
	    this.data = data;
    }
	chart(target, config) {
		Highcharts.chart(target, config);
	}
    bar(config) {
    }
    line(config) {
    }
    scatter(config) {
    }
}