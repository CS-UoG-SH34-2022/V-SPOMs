import * as React from "react";

interface IProps {
  patch: patchState;
  getPatchId: number;
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
        onClick={() => {
          this.handleClick(patch.id);
        }}
      />
    );
  }
}

export default Patch;
