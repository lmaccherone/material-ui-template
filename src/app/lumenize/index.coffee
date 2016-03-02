###

# Lumenize #

Lumenize provides tools for aggregating data and creating time series and other temporal visualizations.

The primary time-series aggregating functionality is provided by:
  * Lumenize.TimeSeriesCalculator - Sets of single-metric series or group-by series
  * Lumenize.TransitionsCalculator - Counts or sums for items moving from one state to another
  * Lumenize.TimeInStateCalculator - Cumulative amount of time unique work items spend in a particular state

Simple group-by, 2D pivot-table and even multi-dimensional aggregations (OLAP cube) are provided by:
  * Lumenize.OLAPCube - Used by above three Calculators but also useful stand-alone, particularly for hierarchical roll-ups

All of the above use the mathematical and statistical functions provided by:
  * Lumenize.functions - count, sum, standardDeviation, percentile coverage, min, max, etc.

Three transformation functions are provided:
  * Lumenize.arrayOfMaps_To_CSVStyleArray - Used to transform from record to table format
  * Lumenize.csvStyleArray_To_ArrayOfMaps - Used to transform from table to record format
  * Lumenize.arrayOfMaps_To_HighChartsSeries - Used to transform from record format to the format expected by the HighCharts charting library

And last, additional functionality is provided by:
  * Lumenize.histogram - create a histogram of scatter data
  * Lumenize.utils - utility methods used by the rest of Lumenize (type, clone, array/object functions, etc.)

###

exports.utils = require('./utils')

datatransform = require('./dataTransform')
exports.arrayOfMaps_To_CSVStyleArray = datatransform.arrayOfMaps_To_CSVStyleArray
exports.csvStyleArray_To_ArrayOfMaps = datatransform.csvStyleArray_To_ArrayOfMaps
exports.arrayOfMaps_To_HighChartsSeries = datatransform.arrayOfMaps_To_HighChartsSeries
exports.csvString_To_CSVStyleArray = datatransform.csvString_To_CSVStyleArray
exports.csvStyleArray_To_CSVString = datatransform.csvStyleArray_To_CSVString

exports.functions = require('./functions').functions

exports.table = require('./table').table

exports.OLAPCube = require('./OLAPCube').OLAPCube

#exports.histogram = require('./histogram').histogram
#
#exports.multiRegression = require('./multiRegression').multiRegression
#
#exports.anova = require('./anova').anova
#
#exports.distributions = require('./distributions').distributions
#
#exports.BayesianClassifier = require('./Classifier').BayesianClassifier
#exports.Classifier = require('./Classifier').Classifier
#
#exports.Store = require('./Store').Store
#
#exports.RandomPicker = require('./RandomPicker').RandomPicker
