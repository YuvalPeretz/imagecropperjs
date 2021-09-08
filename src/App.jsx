import React from 'react';
import './App.css';
import Draggable from "./draggable/draggable.component"
import Line from './line/line.component';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      PrevMousePositionX: 0,
      MouseChangeX: 0,
      PrevMousePositionY: 0,
      MouseChangeY: 0,
      draggingTarget: null, //The current element that is being dragged
      dragging: false,
      TL: [0, 0], //Top-Left
      TR: [0, 0], //Top-Right
      BL: [0, 0], //Bottom-Left
      BR: [0, 0], //Bottom-Right
      aspectRatio: [16, 9]
    }
  }

  setDraggingElement = e => { this.setState({ draggingTarget: e.target }); e.preventDefault() }

  resetDraggingElement = () => { this.setState({ draggingTarget: null }); this.dragEnd(); }

  dragStart = e => { // At the beggining of the dragging, sets the mouse positions for late calculations
    this.setState({
      PrevMousePositionX: e.pageX,
      PrevMousePositionY: e.pageY,
      dragging: true
    });
  }

  dragging = e => { // While dragging, the mouse positions updates every drag, then updates the UI, the makes sure the dots will stay in place and updates the adjacent ones
    const { draggingTarget } = this.state;
    if (this.state.dragging && draggingTarget) {
      this.setState({
        MouseChangeX: e.pageX - this.state.PrevMousePositionX,
        MouseChangeY: e.pageY - this.state.PrevMousePositionY
      });
      document.getElementById(draggingTarget.id).style.left = `${draggingTarget.offsetLeft + this.state.MouseChangeX}px`;
      document.getElementById(draggingTarget.id).style.top = `${draggingTarget.offsetTop + this.state.MouseChangeY}px`;
      this.updatePositions();
      this.updateAdj();
      this.setState({
        PrevMousePositionX: e.pageX,
        PrevMousePositionY: e.pageY
      });
    }
  }

  dragEnd = () => {
    this.setState({
      PrevMousePositionX: 0,
      MouseChangeX: 0,
      PrevMousePositionY: 0,
      MouseChangeY: 0,
      dragging: false
    });
    this.keepDotInside()
  }

  keepDotInside = () => { // To make sure the dots will not go beyond the screen
    const { TL, TR, BL, BR } = this.state

    this.setState({
      TL: [TL[0] < 0 ? 0 : TL[0], TL[1] < 0 ? 0 : TL[1]],
      TR: [TR[0] < 0 ? 0 : TR[0], TR[1] < 0 ? 0 : TR[1]],
      BL: [BL[0] < 0 ? 0 : BL[0], BL[1] < 0 ? 0 : BL[1]],
      BR: [BR[0] < 0 ? 0 : BR[0], BR[1] < 0 ? 0 : BR[1]],
    })
  }

  updatePositions = () => {
    const left = document.getElementById(this.state.draggingTarget.id).offsetLeft;
    const top = document.getElementById(this.state.draggingTarget.id).offsetTop;
    this.setState({
      [this.state.draggingTarget.id]: [left, top]
    });
  }

  updateAdj = () => {
    const { TL, TR, BL, BR } = this.state

    if (this.state.draggingTarget) {
      switch (this.state.draggingTarget.id) {
        case "TL":
          this.setState({
            TR: [TR[0], TL[1]],
            BL: [TL[0], BL[1]]
          });
          break;
        case "TR":
          this.setState({
            TL: [TL[0], TR[1]],
            BR: [TR[0], BR[1]]
          });
          break;
        case "BL":
          this.setState({
            TL: [BL[0], TL[1]],
            BR: [BR[0], BL[1]]
          });
          break;
        case "BR":
          this.setState({
            TR: [BR[0], TR[1]],
            BL: [BL[0], BR[1]]
          });
          break;

        default:
          break;
      }
    }
  }

  componentDidMount() {
    const { TR, BL, aspectRatio } = this.state
    const imageWidth = parseFloat(document.getElementById("image-container").style.width.substr(0, (document.getElementById("image-container").style.width).length - 2))
    const imageHeight = parseFloat(document.getElementById("image-container").style.height.substr(0, (document.getElementById("image-container").style.height).length - 2))

    this.setState({
      TR: [aspectRatio[0] * (imageWidth /50), TR[1]],
      BL: [BL[0], aspectRatio[1] * (imageHeight /50)],
      BR: [aspectRatio[0] * (imageWidth /50), aspectRatio[1] * (imageHeight /50)]
    })
  }

  render() {
    const { TL, TR, BL, BR } = this.state

    return (
      <div
        id="image-container"
        style={{width: "300px", height: "500px"}}
        onMouseDown={e => this.dragStart(e)}
        onMouseMove={e => this.dragging(e)}
        onMouseUp={this.resetDraggingElement}
        onMouseLeave={() => { this.dragEnd(); this.updateAdj() }}>
        <Draggable id="TL" positions={TL} setDraggingElement={this.setDraggingElement} />
        <Draggable id="TR" positions={TR} setDraggingElement={this.setDraggingElement} />
        <Draggable id="BL" positions={BL} setDraggingElement={this.setDraggingElement} />
        <Draggable id="BR" positions={BR} setDraggingElement={this.setDraggingElement} />
        <Line positions={[TL, TR]} />
        <Line positions={[TL, BL]} />
        <Line positions={[BL, BR]} />
        <Line positions={[BR, TR]} />
      </div>
    );
  }
}

export default App;