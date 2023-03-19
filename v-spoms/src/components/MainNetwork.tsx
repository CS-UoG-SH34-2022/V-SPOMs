import React, { Component, useEffect } from "react";
import * as d3 from "d3";
import { Patch } from "sim-spoms/src/@types/patch";
import { Vector2D } from "sim-spoms/src/@types/vector2d";

interface MainNetworkProps {
  svg_id: string;
  network: Patch[];
  activePatch: number | undefined;
  scale: number;
  onCreate: (pos: Vector2D) => void;
  setPatchID: React.Dispatch<React.SetStateAction<number | undefined>>;
  onUpdate: (pos: Vector2D) => void;
  setScale: (s: number) => void;
}

class MainNetwork extends Component<MainNetworkProps> {
  divID: string;
  svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any> | undefined;
  translateVar = [400, 200];
  scale = this.props.scale;

  constructor(props: MainNetworkProps) {
    super(props);
    this.divID = `${this.props.svg_id}_div`;
    this.svg = undefined;
  }

  render(): React.ReactNode {
    return (
      <div
        id={this.divID}
        className="h-full w-full"
        style={{ borderRight: "3px solid black" }}
      ></div>
    ); // Return parent div with svg inside
  }

  componentDidMount() {
    this.createChart();
    this.drawPatches();
  }

  componentDidUpdate() {
    this.redrawPatches();
    this.updatePatches(this);
  }

  //// D3 CALLBACK METHODS

  handleZoom(e: any, cls: MainNetwork) {
    if (e.sourceEvent.target.tagName == "rect") {
      cls.svg?.select("g").attr("transform", e.transform);
      cls.translateVar[0] = e.transform.x;
      cls.translateVar[1] = e.transform.y;
      cls.scale = e.transform.k;
      this.props.setScale(e.transform.k);
    }
  }

  dragstarted(event: any, d: any) {
    const patch = d3.select(event.sourceEvent.target);
    const patch_id = Number(patch.attr("patch_id"));
    this.props.setPatchID(patch_id);
    patch.raise().attr("stroke", "black");
  }

  dragged(event: any, d: any) {
    const patch = d3.select(event.sourceEvent.target);
    patch.attr("cx", event.x).attr("cy", event.y);
  }

  dragended(event: any, d: any) {
    const patch = d3.select(event.sourceEvent.target);
    patch.attr("stroke", null);
    const pos = { x: Number(patch.attr("cx")), y: Number(patch.attr("cy")) };
    this.props.onUpdate(pos);
    if (this.svg) {
      this.svg.selectAll("circle").remove();
    }
    this.redrawPatches();
  }

  svg_clicked(event: any, d: any) {
    const panOffset = this.svg?.select("g").attr("transform");
    let position = {
      x: (event.offsetX - this.translateVar[0]) / this.props.scale,
      y: (event.offsetY - this.translateVar[1]) / this.props.scale,
    };
    this.props.onCreate(position);
    this.props.setPatchID(undefined);
    this.redrawPatches();
  }

  patch_click(event: any, d: any) {
    const patch = d3.select(event.target);
    const patch_id = Number(patch.attr("patch_id"));
    this.props.setPatchID(patch_id);
    event.stopPropagation();
  }

  // D3 SVG DRAWING METHODS
  drawPatches() {
    this.props.network.forEach((patch: Patch) => {
      this.drawPatch(patch);
    });
  }

  drawPatch(patch: Patch) {
    if (!this.svg) {
      return;
    }

    const drag = d3
      .drag()
      .on("start", (event: any, d: any) => {
        this.dragstarted(event, d);
      })
      .on("drag", (event: any, d: any) => {
        this.dragged(event, d);
      })
      .on("end", (event: any, d: any) => {
        this.dragended(event, d);
      });

    const patch_circle = this.svg
      .select("g")
      .append("circle")
      .attr("cx", patch.pos.x)
      .attr("cy", patch.pos.y)
      .attr("patch_id", patch.id)
      .attr("r", patch.area)
      .attr("fill", patch.is_occupied ? "#3DD956" : "#FF4343")
      //.on("click", (event:any, d:any)=>{this.patch_click(event,d)})
      .call(drag);

    if (this.props.activePatch != undefined) {
      if (patch.id === this.props.activePatch) {
        patch_circle
          .attr("stroke", "#E7DF27")
          .attr("stroke-width", this.props.network[patch.id].area / 8);
      }
    }
  }

  redrawPatches() {
    if (this.svg) {
      this.svg.selectAll("circle").remove();
      this.drawPatches();
    }
  }

  // Create the D3 SVG Element
  createChart() {
    // Create SVG panel in network div
    this.svg = d3
      .select(`#${this.divID}`)
      .append("svg")
      .attr("width", "100%")
      .attr("height", "100%");
    // Add background
    this.svg
      .append("rect")
      .attr("width", "100%")
      .attr("height", "100%")
      .style("stroke", "#999999")
      .style("fill", "#D9EEFF");

    this.svg.append("g");
    // Add on svg click callback
    this.svg.on("click", (event: any, d: any) => {
      this.svg_clicked(event, d);
    });

    const zoom = d3.zoom();

    this.svg.call(
      zoom.transform,
      d3.zoomIdentity.translate(400, 200).scale(this.props.scale)
    );

    // Add on svg zoom callback
    this.svg.call(zoom);

    zoom.on("zoom", (event) => {
      this.handleZoom(event, this);
    });
  }

  updatePatches(cls: MainNetwork) {
    this.svg = d3.select(`#${this.divID}`);

    this.svg
      .select("g")
      .attr(
        "transform",
        d3.zoomIdentity
          .translate(cls.translateVar[0], cls.translateVar[1])
          .scale(this.props.scale)
      );

    const zoomTransform = d3.zoomTransform(this.svg.select("g").node());
    zoomTransform.k = this.props.scale;
  }
}

export default MainNetwork;
