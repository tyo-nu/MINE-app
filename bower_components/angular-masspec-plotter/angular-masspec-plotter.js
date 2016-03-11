/**
 * Created by sajjan on 7/21/14.
 */

(function () {
	'use strict';

	angular.module('angularMasspecPlotter', [])
		.directive("massSpec", massSpec);

	function massSpec() {
		var directive = {
			restrict: 'E',
			require: 'ngModel',
			priority: 1,
			replace: 'true',
			template: '<div style="width: 100%; height: 100%; display: inline-block;">' +
			'    <div class="masspec" style="width: 100%; height: 100%"></div>' +
			'</div>',

			link: linkFunc
		};

		return directive;
	}

	/**
	 * Our directive link function
	 */
	function linkFunc(scope, element, attrs) {
		// Retrieve and parse the data
		var parsedData = parseData(scope[attrs.ngModel]);
		var data = parsedData.data;
		var annotations = parsedData.annotations;


		// Compute plot limits
		var mzMax = Math.max.apply(Math, data.map(function (x) {
			return x[0];
		}));
		var intensityMax = Math.max.apply(Math, data.map(function (x) {
			return x[1];
		}));

		// Type of plot
		var miniPlot = attrs.hasOwnProperty('mini');


		// Base options
		var options = {
			series: {
				color: '#00f',
				lines: {show: true},
				shadowSize: 0
			},

			grid: {
				labelMargin: 15,

				backgroundColor: '#fff',
				color: '#e2e6e9',

				borderWidth: {top: 0, right: 0, bottom: 1, left: 1},
				borderColor: null
			},

			legend: {show: false}
		};


		// Format plot if a thumbnail version is desired
		if (miniPlot) {
			// Remove tick labels and set plot limits
			options.xaxis = {ticks: false};
			options.yaxis = {min: 0, max: intensityMax, ticks: false};

			// Filter low intensity peaks
			data = data.filter(function (x) {
				return x[1] > 0.05 * intensityMax
			});
		}

		// Otherwise, set up plot selection zoom and tooltips
		else {
			// Set up plot limits
			options.xaxis = {min: 0, max: Math.max(mzMax, 500)};
			options.yaxis = {min: 0, max: intensityMax};

			// Set plot selection mode
			options.selection = {mode: 'x'};

			// Set hoverable plot properties
			options.grid.hoverable = true;
			options.grid.mouseActiveRadius = 10;
		}


		// Find placeholder element and plot the mass spectrum
		var plotData = [];

		for (var i = 0; i < data.length; i++) {
			plotData.push({data: [[data[i][0], 0], data[i]], lines: {show: true}});
		}

		var placeholder = $(element).find(".masspec");
		var plot = $.plot(placeholder, plotData, options);


		// Watch the data source for changes
		scope.$watch(attrs.ngModel, function (v) {
			if (angular.isDefined(v)) {
				parsedData = parseData(v);

				data = parsedData.data;
				annotations = parsedData.annotations;

				var plotData = [];

				for (var i = 0; i < data.length; i++) {
					plotData.push({data: [[data[i][0], 0], data[i]], lines: {show: true}});
				}

				plot.setData(plotData);
				redrawPlot(data, plot, placeholder, !miniPlot);
			}
		}, true);


		// Set up interactivity if this is a full plot
		if (!miniPlot) {
			// Plot annotations
			plotAnnotations(data, plot, placeholder);

			// Define selection zoom functionality
			placeholder.bind('plotselected', function (event, range) {
				// Get maximum intensity in given range
				var maxLocalIntensity = maxIntensityInRange(data, range.xaxis.from, range.xaxis.to);

				// Set x-axis range
				$.each(plot.getXAxes(), function (_, axis) {
					axis.options.min = range.xaxis.from;
					axis.options.max = range.xaxis.to;
				});

				// Set y-axis range
				$.each(plot.getYAxes(), function (_, axis) {
					axis.options.min = 0;
					axis.options.max = maxLocalIntensity;
				});

				// Redraw plot
				plot.setupGrid();
				plot.draw();
				plot.clearSelection();
				plotAnnotations(data, plot, placeholder);
			});

			// Add button to reset selection zooming
			$('<div><i class="fa fa-arrows-alt fa-2x"></i></div>').css({
				'position': 'absolute',
				'top': '10px',
				'right': '10px',
				'cursor': 'pointer',
				'font-size': 'smaller',
				'color': '#000',
				//'background-color': '#eee',
				'padding': '2px'
			}).appendTo(placeholder).click(function (event) {
				event.preventDefault();
				redrawPlot(data, plot, placeholder, true);
			});


			// Define functionality for plot hover / tooltips
			placeholder.bind('plothover', function (event, pos, item) {
				var showTooltip = function (contents) {
					$('canvas').css('cursor', 'pointer');

					var p = plot.pointOffset({x: pos.x, y: pos.y});

					$('<div id="masspec-tooltip">' + contents + '</div>').css({
						'position': 'absolute',
						'top': p.top + 5,
						'left': p.left + 5,
						'font-size': 'smaller',
						'background': '#fff',
						'z-index': '1040',
						'padding': '0.4em 0.6em',
						'border-radius': '0.5em',
						'border': '1px solid #111',
						'white-space': 'nowrap'
					}).appendTo(placeholder);
				};


				// Remove current tooltip and highlight
				$("#masspec-tooltip").remove();
				$('canvas').css('cursor', 'auto');
				plot.unhighlight();


				// If datapoint is selected, show the tooltip
				if (item)
					showTooltip('m/z = ' + item.datapoint[0] + '<br />abundance = ' + item.datapoint[1]);

				// Otherwise, check if line being hovered over
				else {
					// Find nearest ion
					var nearestIon = {
						dist: -1
					};

					var cursor = plot.pointOffset({x: pos.x, y: pos.y});

					$.each(data, function (i, x) {
						var p = plot.pointOffset({x: x[0], y: x[1]});

						if (nearestIon.dist == -1 ||
							(Math.abs(p.left - cursor.left) < nearestIon.dist && pos.y > 0 && pos.y < x[1])) {
							nearestIon.dist = Math.abs(p.left - cursor.left);
							nearestIon.i = i;
							nearestIon.datapoint = x;
						}
					});

					// Set tooltip if we are near an ion peak
					if (nearestIon.dist != -1 && nearestIon.dist < plot.getOptions().grid.mouseActiveRadius)
						showTooltip('m/z = ' + nearestIon.datapoint[0] + '<br />abundance = ' + nearestIon.datapoint[1]);
				}
			});

			// Replot annotations when window is resized
			placeholder.resize(function () {
				plotAnnotations(data, plot, placeholder);
			});
		}
	}

	/**
	 * Find the maximum intensity in the given range+
	 * @param data
	 * @param min
	 * @param max
	 * @returns {number}
	 */
	function maxIntensityInRange(data, min, max) {
		var maxLocalIntensity = 0;

		for (var i = 0; i < data.length; i++) {
			if (data[i][0] >= max)
				break;

			else if (data[i][0] >= min && data[i][1] >= maxLocalIntensity)
				maxLocalIntensity = data[i][1];
		}

		return Math.max(maxLocalIntensity, 0.1);
	}

	/**
	 * Find the n ions with the highest intensity in the given range
	 * @param data
	 * @param plot
	 * @param n
	 * @returns {Array.<T>}
	 */
	function getTopPeaks(data, plot, n) {
		// Set default values if not given
		n = typeof n !== 'undefined' ? n : 3;

		// Get plot minimum and maximum
		var min = plot.getXAxes()[0].options.min;
		var max = plot.getXAxes()[0].options.max;

		// Get data within range
		var reducedData = [];

		for (var i = 0; i < data.length; i++) {
			if (min <= data[i][0] && data[i][0] <= max)
				reducedData.push(data[i]);
		}

		// Sort data
		reducedData.sort(function (a, b) {
			return b[1] - a[1];
		});

		// Return the top n hits
		return reducedData.slice(0, n);
	}

	/**
	 * Add annotations for the top n ions
	 * @param data
	 * @param plot
	 * @param placeholder
	 * @param n
	 */
	function plotAnnotations(data, plot, placeholder, n) {
		// Get peaks
		var peaks = getTopPeaks(data, plot, n);

		// Remove all annotation elements
		$(".masspec-annotation").remove();

		// Add annotations
		for (var i = 0; i < peaks.length; i++) {
			var p = plot.pointOffset({x: peaks[i][0], y: peaks[i][1]});

			// Place annotation and then reposition to center on ion
			var annotation = $('<div class="masspec-annotation">' + peaks[i][0] + "</div>").css({
				'position': 'absolute',
				'top': p.top - 12,
				'font-size': 'x-small',
				'color': '#f00',
				'text-align': 'center'
			});
			annotation.appendTo(placeholder);
			annotation.css({'left': p.left - annotation.width() / 2});
		}
	}

	function redrawPlot(data, plot, placeholder, showAnnotations) {
		var mzMax = Math.max.apply(Math, data.map(function (x) {
			return x[0];
		}));
		var intensityMax = Math.max.apply(Math, data.map(function (x) {
			return x[1];
		}));

		// Reset x-axis range
		$.each(plot.getXAxes(), function (_, axis) {
			axis.options.min = 0;
			axis.options.max = Math.max(mzMax + 100, 500);
		});

		// Reset y-axis range
		$.each(plot.getYAxes(), function (_, axis) {
			axis.options.min = 0;
			axis.options.max = intensityMax;
		});

		// Redraw plot
		plot.setupGrid();
		plot.draw();
		plot.clearSelection();

		if (showAnnotations) {
			plotAnnotations(data, plot, placeholder);
		}
	}


	/**
	 * Parse data into a plottable format
	 * @param data
	 */
	function parseData(data) {
		var reducedData = [];
		var annotations = [];

		// Parse data if it is in the standard string format
		if (angular.isString(data)) {
			reducedData = data.split(' ').map(function (x) {
				return x.split(':').map(Number);
			});
		}

		// Check that the data is in a readable form already
		else if (angular.isArray(data) && data.length > 0 && angular.isArray(data[0])) {
			reducedData = data;
		}

		// Reduce the object-form of the mass spectrum
		else if (angular.isArray(data) && data.length > 0 && angular.isObject(data[0])) {
			reducedData = [];

			for (var i = 0; i < data.length; i++) {
				if (angular.isUndefined(data[i].selected) || data[i].selected === true) {
					reducedData.push([data[i].ion, data[i].intensity]);

					if (data[i].annotation && data[i].annotation != '') {
						annotations.push([data[i].ion, data[i].annotation]);
					}
				}
			}
		}

		if (reducedData.length > 1000) {
			reducedData.sort(function (a, b) {
				return b[1] - a[1];
			});

			reducedData = reducedData.slice(0, 1000);
		}

		// Sort data by m/z
		reducedData.sort(function (a, b) {
			return a[0] - b[0];
		});

		// Return parsed data
		return {
			data: reducedData,
			annotations: annotations
		};
	}
})();