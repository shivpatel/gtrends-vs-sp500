var margin = { top: 30, right: 100, bottom: 30, left: 100 },
  width = window.innerWidth - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

var parseDate = d3.time.format("%m/%d/%Y").parse;

var x = d3.time.scale().range([0, width]);
var y0 = d3.scale.linear().range([height, 0]);
var y1 = d3.scale.linear().range([height, 0]);

var xAxis = d3.svg.axis().scale(x)
  .orient("bottom").ticks(5);

var yAxisLeft = d3.svg.axis().scale(y0)
  .orient("left").ticks(5);

var yAxisRight = d3.svg.axis().scale(y1)
  .orient("right").ticks(5);

var valueline = d3.svg.line()
  .x(function (d) { return x(d.date); })
  .y(function (d) { return y0(d.searchVolume); });

var valueline2 = d3.svg.line()
  .x(function (d) { return x(d.date); })
  .y(function (d) { return y1(d.sp500Price); });

var svg = d3.select("body")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.json("./data.json", function (error, data) {
  data.forEach(function (d) {
    d.date = parseDate(d.date);
    d.searchVolume = +d.searchVolume;
    d.sp500Price = +d.sp500Price;
  });

  // Scale the range of the data
  x.domain(d3.extent(data, function (d) { return d.date; }));
  y0.domain([0, d3.max(data, function (d) {
    return Math.max(d.searchVolume);
  })]);
  y1.domain([0, d3.max(data, function (d) {
    return Math.max(d.sp500Price);
  })]);

  svg.append("path")        // Add the valueline path.
    .style("stroke", "#555")
    .style("stroke-width", 3)
    .attr("d", valueline(data));

  svg.append("path")        // Add the valueline2 path.
    .style("stroke", "#fff")
    .style("stroke-width", 3)
    .attr("d", valueline2(data));

  svg.append("g")            // Add the X Axis
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .style("fill", "#fff")
    .call(xAxis);

  svg.append("g")
    .attr("class", "y axis")
    .style("fill", "#555")
    .call(yAxisLeft);

  svg.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + width + " ,0)")
    .style("fill", "#fff")
    .call(yAxisRight);

});