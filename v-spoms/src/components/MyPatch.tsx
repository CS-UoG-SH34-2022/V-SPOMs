// import React, { CSSProperties } from "react";
// import { Component } from "react";
// interface AppProps {
//   patch: patchObj;
//   getPatchId: React.FC;
// }

// interface patchObj {
//   id: Number;
//   x: Number;
//   y: Number;
//   area: Number;
//   distance: Number;
//   connectivity: String[];
//   occupancy: Boolean;
// }
// class Patch extends React.PureComponent {
//   inputRef: React.RefObject<unknown> = React.createRef();
//   state = { ...this.props.patch };

//   // hanfle the click event and return the id of patch which is clicked
//   handleClick = (id: string | number) => {
//     var Ps = document.getElementsByClassName("patch");
//     for (var i = 0; i < Ps.length; i++) {
//       var a = Ps[i].getAttribute("style");
//       Ps[i].style.border = "none";
//     }
//     Ps[id].style.border = "solid 3px blue";
//     this.props.getPatchId(id);
//   };

//   start = async (id: string | number) => {
//     const that = this
//     await that.handleClick(id);
//     let dom = document.getElementById(String(id))
//     dom?.addEventListener('mousedown', (e)=>{
//         const pointX = e.pageX - dom.offsetLeft, pointY = e.pageY - dom.offsetTop
//         function move (e) {
//             let obj = {x: e.pageX - pointX, y: e.pageY - pointY}
//             that.props.getLocation(obj)
//         }
//         dom?.addEventListener('mousemove',move,false);
//         dom?.addEventListener("mouseup",async ()=>{
//             await that.props.removeId()
//             dom.onmousemove = null;
//             dom.onmousedown = null;
//             dom?.removeEventListener("mousemove",move)
//         },false);
//     },false);
// }

//   render() {
//     const { patch } = this.props;
//     let patchStyle: any = {
//       position: "absolute",
//       borderRadius: "50%",
//       top: String(this.props.patch.y) + "px",
//       left: String(this.props.patch.x) + "px",
//       height: 2 * this.props.patch.area + "px",
//       width: 2 * this.props.patch.area + "px",
//       backgroundColor: this.props.patch.occupancy ? "rgb(25, 193, 25)" : "red",
//     };
//     return (
//       <div
//         className="patch"
//         id={patch.id}
//         style={{ ...patchStyle }}
//         ref={this.inputRef}
//         onClick={() => {
//           this.handleClick(patch.id);
//         }}
//         onMouseDown={()=>{this.start(patch.id)}}
//       />
//     );
//   }
// }

// export default Patch;

import * as React from "react";

interface IProps {
  patch: patchState;
  getPatchId: any; // still need to find what the type is
  // getLocation: any; // still need to find what the type is
}

interface patchState {
  id: number;
  x: number;
  y: number;
  area: number;
  distance: number;
  connectivity: string[];
  occupancy: boolean;
}

class Patch extends React.Component<IProps, patchState> {
  disX: number = 0;
  disY: number = 0;
  public constructor(props: IProps) {
    super(props);
    this.state = {
      id: props.patch.id,
      x: props.patch.x,
      y: props.patch.y,
      area: props.patch.area,
      distance: props.patch.distance,
      connectivity: props.patch.connectivity,
      occupancy: props.patch.occupancy,
    };
  }
  // inputRef: React.RefObject<HTMLDivElement> = React.createRef();
  // public readonly state : Readonly<IState> = { ...this.props.patch };

  // hanfle the click event and return the id of patch which is clicked

  handleClick = (id: number) => {
    var Ps = document.getElementsByClassName("patch");
    for (var i = 0; i < Ps.length; i++) {
      var a = Ps[i] as HTMLElement;
      a.style.border = "none";
    }
    var current = Ps[id] as HTMLElement;
    current.style.border = "solid 6px #E7DF27";
    this.props.getPatchId(id);
  };

  render() {
    const { patch } = this.props;
    let patchStyle: any = {
      position: "absolute",
      borderRadius: "50%",
      top: String(this.props.patch.y) + "px",
      left: String(this.props.patch.x) + "px",
      height: 2 * this.props.patch.area + "px",
      width: 2 * this.props.patch.area + "px",
      backgroundColor:
        this.props.patch.occupancy == true ? "#3DD956" : "#FF4343",
    };

    return (
      <div
        className="patch"
        id={String(patch.id)}
        style={{ ...patchStyle }}
        // ref={this.inputRef}
        onClick={() => {
          this.handleClick(patch.id);
        }}
      />
    );
  }
}

export default Patch;
