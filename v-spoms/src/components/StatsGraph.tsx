import React, { Component, useEffect } from "react";
import * as d3 from "d3";
import { Patch } from "sim-spoms/src/@types/patch";
import { Vector2D } from "sim-spoms/src/@types/vector2d";

interface StatsGraphProps {
  className: string;
  svg_id: string;
  width: number;
  height: number;
  title: string;
  x_label: string;
  y_label: string;
  x_range: [number, number];
  y_range: [number, number];
  data: { x: number; y: number }[][];
  meanData: {x:number;y:number}[];
}

class StatsGraph extends Component<StatsGraphProps> {
  divID: string;
  svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any> | undefined;

  constructor(props: StatsGraphProps) {
    super(props);
    this.divID = `${this.props.svg_id}_div`;
    this.svg = undefined;
  }

  render(): React.ReactNode {
    return <div className={this.props.className} id={this.divID}></div>; // Return parent div with svg inside
  }

  componentDidMount() {
    this.createGraph();
    this.setAxes();
    this.drawGraph();
  }

  componentDidUpdate(prevProps: StatsGraphProps) {
    this.setAxes()
    this.redrawGraph();
    if (prevProps.x_range[1] !== this.props.x_range[1]) this.setAxes();
  }

  //// D3 CALLBACK METHODS

  // D3 SVG DRAWING METHODS
  drawGraph() {
    if(!this.svg) return;
    const cls = this;
    /*var circle = this.svg
      .selectAll("circle")
      .data(this.props.data)
      .enter()
      .append("circle")
      .attr("fill", "black")
      .attr("cx", (_, index) => (index * this.props.width) / (this.props.x_range[1] - 1))
      .attr("cy", function (d) {
        return cls.props.height - d;
      })
      .attr("r", 1);
*/
    // Setting up the data for the svg
    for (let i = 0; i < this.props.data.length; i++) {
      this.svg
        .selectAll(".line")
        .data([this.props.data[i]])
        .join("path")
        .attr("d", (d) => this.generateScaledLine(d))
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("class", "linePath");
    }
    if(this.props.meanData && this.props.data.length > 1)
    {
      this.svg
        .selectAll(".line")
        .data([this.props.meanData])
        .join("path")
        .attr("d", (d) => this.generateMeanLine(d))
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("stroke-width", 2)
        .attr("class", "linePath");
    }
  
  }

  redrawGraph() {
    this.svg?.selectAll("circle").remove();
    this.svg?.selectAll(".linePath").remove();
    this.drawGraph();
  }

  // Create the D3 SVG Element
  createGraph() {
    // Create SVG panel in network div
    this.svg = d3
      .select(`#${this.divID}`)
      .append("svg")
      .attr("transform", "translate("+ this.props.width*0.2 + "," + -this.props.height*0.05 + ")")
      .attr("width", this.props.width)
      .attr("height", this.props.height)
      .attr("class", "overflow-visible");

    this.svg
      .append("text")
      .attr("x", this.props.width/2)
      .attr("y", this.props.height*0.15)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text(this.props.title);

    this.svg
      .append("text")
      .attr("transform", "translate(" + this.props.width / 2 + " ," + (this.props.height + 40) + ")")
      .style("text-anchor", "middle")
      .style("font-size", "14px")
      .text(this.props.x_label);

    this.svg
      .append("text")
      .attr("x", -(this.props.height*0.6))
      .attr("y", -(this.props.height*0.22))
      .attr("transform", "rotate(-90)")
      .style("text-anchor", "middle")
      .style("font-size", "14px")
      .text(this.props.y_label);
  }

  setAxes(){
    if(!this.svg) return;
    this.svg.selectAll("circle").remove();
    this.svg.selectAll(".linePath").remove();
    this.svg.selectAll("g").remove();

    const xScale = d3
      .scaleLinear()
      .domain([this.props.x_range[0], this.props.x_range[1]])
      .range([0, this.props.width*1]);

    const yScale = d3
      .scaleLinear()
      .domain([this.props.y_range[0], this.props.y_range[1]])
      .range([this.props.height, this.props.height*0.2]);
    
    const generateScaledLine = d3
      .line()
      .curve(d3.curveStepAfter)
      .x((d, i) => xScale(i))
      .y(yScale);

    this.generateScaledLine = generateScaledLine;

    const generateMeanLine = d3
    .line()
    .curve(d3.curveMonotoneX)
    .x((d, i) => xScale(i))
    .y(yScale);

  this.generateMeanLine = generateMeanLine;

    // Setting the axes
    const xAxis = d3
      .axisBottom(xScale)
      .ticks(8)
      .tickFormat((i) => i + 0);

    
    if(this.props.title=="Turnover events")
    {
      console.log(this.props.y_range[1])
      const yAxis = d3.axisLeft(yScale).ticks(5).tickFormat((i) =>(i));
      this.svg.append("g").call(yAxis).style("font", "16px times");
    }
    else{
      const yAxis = d3
      .axisLeft(yScale)
      .ticks(5)
      .tickFormat((i) => i / this.props.y_range[1]);
      this.svg.append("g").call(yAxis).style("font", "16px times");
    }
    
    this.svg
      .append("g")
      .call(xAxis)
      .attr("transform", `translate(0 , ${this.props.height})`)
      .style("font", "16px times");

    
  }
}

export default StatsGraph;
