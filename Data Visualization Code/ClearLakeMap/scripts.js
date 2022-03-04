d3.json("./metstationslakeoutline.geojson").then(geodata => {
    let projection = d3.geoMercator()
      .fitSize([600, 600], geodata);
    let generator = d3.geoPath().projection(projection);
    d3.select("#content g.map")
      .selectAll("path")
      .data(geodata.features)
      .join("path")
      .attr("d", generator)
      .attr('stroke', '#000')
      .attr('fill', '#fff')
    
    d3.select("#content g.map")
      .selectAll("path")
      .each(addClick)
    
    function addClick(d) {
        console.log(d)
        if (d.geometry.type == "Point") {
            return d3.select(this).on("click", function() {displayGraphs(d.properties.name);});
        }
        return d3.select(this);
    }
  });


function displayGraphs(name) {
    console.log(name);
    main(name)
}
