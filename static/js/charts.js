function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("static/samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("static/samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("static/samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samplesArray = data.samples;
    

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filteredSample = samplesArray.filter(sampleObj => sampleObj.id == sample);
    
    
    //  5. Create a variable that holds the first sample in the array.
    var firstSample = filteredSample[0];
    
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = firstSample.otu_ids;
    var otu_labels = firstSample.otu_labels;
    var sample_values = firstSample.sample_values;
    

    // 7. Create the yticks for the bar chart.
    // Put the samples_values in descending order 
    var sortedSampleValues = sample_values.sort((a,b) => b-a);

    // Slice the first 10 objects for plotting
    sortedSampleValues = sortedSampleValues.slice(0, 10);
    
    // Reverse the array due to Plotly's defaults
    sortedSampleValues = sortedSampleValues.reverse();
    console.log(sortedSampleValues);

    var yticks = otu_ids.slice(0,10).map(entry => "OTU " + entry).reverse();
      

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sortedSampleValues,
      y: yticks,
      text: otu_labels, //this is the hover text
      type: "bar",
      orientation: "h"
    }
    ];
    
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      //xaxis: { title: "Title"},
      //yaxis: {title: "Y title"}
      
    };

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Earth',
      }
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: {title: "OTU ID"},
      hovermode: "closest",
      margin: {
        l: 100,
        r: 100,
        t: 50,
        b: 50
      }
  
    };
    
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 


    //Gauge Chart Details
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var washingFreq = result.wfreq;
    console.log(washingFreq);
    
   

    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      //domain: { x: [0, 1], y: [0, 10] },
      value: washingFreq,
      //title = "Plot Title <br><sup>Plot Subtitle</sup>",
      title: { text: "<b>Belly Button Washing Frequency</b> <br>Scrubs per Week"},
      //subtitle: {text: "Scrubs per Week"},
      type: "indicator",
      mode: "gauge+number",

      gauge: {
        axis: { range: [0, 10], dtick: 2 },
        
        bar: { color: "black" },
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "limegreen" },
          { range: [8, 10], color: "green" },
        ],
        
      }
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      //go.Layout(title='<b>Bold</b> <i>animals</i>')
      //margin: { t: 25, r: 25, l: 25, b: 25 },
     
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}


