require('jest-fetch-mock').enableMocks()

const Highcharts = require('highcharts')
require('highcharts/modules/networkgraph')(Highcharts)
require('highcharts/modules/data')(Highcharts)

global.Highcharts = Highcharts
