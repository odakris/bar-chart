const barChart = async () => {
  const url =
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
  let json;
  await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      json = data;
    });

  const data = json.data;
  const title = "USA " + json.name.substring(0, 22);
  const source = json.description.substring(80);

  //   Parameters
  const w = 1100;
  const h = 650;
  const padding = 50;

  //   Create container div
  d3.select("body").append("div").attr("id", "container");

  //   Append title
  d3.select("#container").append("h1").attr("id", "title").text(title);

  //   Append credit
  d3.select("#container")
    .append("h5")
    .attr("id", "credit")
    .html(
      "Created by <a href='https://github.com/odakris?tab=repositories' target='_blank' rel='noreferrer noopener'>Odakris</a>"
    );

  //  Append div for chart
  d3.select("#container")
    .append("div")
    .attr("id", "chart")
    .style("border", "2px solid linen")
    .style("border-radius", "10px");

  //   SVG Definition
  const svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .attr("class", "flex-center");

  //   AXIS
  const minDate = new Date(d3.min(data, (d) => d[0]));
  const maxDate = new Date(d3.max(data, (d) => d[0]));

  const xScale = d3
    .scaleTime()
    .domain([minDate, maxDate])
    .range([padding, w - padding]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d[1]) + 500])
    .range([h - padding, padding]);

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(0," + (h - padding) + ")")
    .call(xAxis);

  svg
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", "translate(" + padding + ")")
    .call(yAxis);

  //   TOOLTIP
  const tooltip = d3
    .select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("position", "absolute")
    .style("opacity", 0);

  //   Formatting date
  const years = data.map((item) => {
    let quarter = "";
    let temp = item[0].substring(5, 7);

    if (temp == "01") {
      quarter = "Q1";
    } else if (temp == "04") {
      quarter = "Q2";
    } else if (temp == "07") {
      quarter = "Q3";
    } else if (temp == "10") {
      quarter = "Q4";
    }
    return item[0].substring(0, 4) + " " + quarter;
  });

  //   formatting GDP
  let GDP = data.map((item) => {
    return "$" + item[1] + " Billions";
  });

  //   Display rects
  svg
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (d, i) => xScale(new Date(d[0])))
    .attr("y", (d, i) => yScale(d[1]))
    .attr("width", 2)
    .attr("height", (d) => h - padding - yScale(d[1]))
    .attr("class", "bar")
    .attr("fill", "orange")
    .attr("data-date", (d) => d[0])
    .attr("data-gdp", (d) => d[1])
    .attr("id", (d, i) => i)
    .on("mousemove", function (event, d) {
      let i = this.getAttribute("id");
      tooltip.style("opacity", 0.9);
      tooltip
        .html(years[i] + "<br/>" + GDP[i])
        .attr("data-date", data[i][0])
        .style("top", event.pageY + 20 + "px")
        .style("left", event.pageX + 20 + "px");
    })
    .on("mouseout", function (d) {
      tooltip.style("opacity", 0);
    });

  d3.select("#chart").append("div").attr("id", "source").html(source);
};

barChart();
