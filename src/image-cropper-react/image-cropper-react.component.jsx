import React from 'react';
import './image-cropper-react.component.css';
import Draggable from "./draggable/draggable.component"
import Line from './line/line.component';

class ImageCropperReact extends React.Component {
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
      aspectRatio: this.props.aspectRatio || 16 / 9,
      BackgroundImage: this.props.BackgroundImage || "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Empty_set.svg/400px-Empty_set.svg.png",
      ImageHeight: null,
      ImageWidth: null
    }
  }

  setDraggingElement = e => { this.setState({ draggingTarget: e.target }); e.preventDefault() } // Everytime the MouseDown event is triggered, this function will run and set the current target to drag

  resetDraggingElement = () => { this.setState({ draggingTarget: null }); this.dragEnd(); } // When the MouseUp event is triggered, the dragin target will be reset

  dragStart = e => { // At the beggining of the dragging, sets the mouse positions for late calculations
    this.setState({
      PrevMousePositionX: e.pageX,
      PrevMousePositionY: e.pageY,
      dragging: true
    });
  }

  dragging = e => { // While dragging, several actions are happenening
    /*
      Section 1 - drags the Draggable element (which are the little dots)
      Section 2 - changes the final-picture's appearence to match the actual selected area
      Section 3 - preforms several functions to insure intergarty of the Draggable elements
      Section 4 - resetes the state information for keeping the dragging possible
    */

    const { draggingTarget, ImageWidth, ImageHeight, TL, TR, BL, BackgroundImage } = this.state;

    // Section 1
    if (this.state.dragging && draggingTarget && (draggingTarget.offsetLeft <= ImageWidth - 5 && draggingTarget.offsetLeft >= -5) && (draggingTarget.offsetTop <= ImageHeight - 5 && draggingTarget.offsetTop >= -5)) {

      this.setState({
        MouseChangeX: e.pageX - this.state.PrevMousePositionX,
        MouseChangeY: e.pageY - this.state.PrevMousePositionY
      });

      document.getElementById(draggingTarget.id).style.left = `${draggingTarget.offsetLeft + this.state.MouseChangeX}px`;
      document.getElementById(draggingTarget.id).style.top = `${draggingTarget.offsetTop + this.state.MouseChangeY}px`;

      // Section 2
      if (document.getElementById("final-picture")) {
        document.getElementById("final-picture").src = BackgroundImage

        const finalPictureWidth = document.getElementById("final-picture").width
        const finalPictureHeight = document.getElementById("final-picture").height

        const top = (TL[1] > BL[1] ? BL[1] : TL[1] / ImageHeight) * finalPictureHeight;
        const bottom = finalPictureHeight - ((TL[1] > BL[1] ? TL[1] : BL[1] / ImageHeight) * finalPictureHeight);

        const right = finalPictureWidth - ((TL[0] > TR[0] ? TL[0] : TR[0] / ImageWidth) * finalPictureWidth);
        const left = (TL[0] > TR[0] ? TR[0] : TL[0] / ImageWidth) * finalPictureWidth;


        document.getElementById("final-picture").style.clipPath = `inset(${top}px ${right}px ${bottom}px ${left}px)`;
      }

      // Section 3
      this.updatePositions();
      this.updateAdj();

      // Section 4
      this.setState({
        PrevMousePositionX: e.pageX,
        PrevMousePositionY: e.pageY
      });
    }
    else
      this.keepDotsInside()
  }

  dragEnd = e => { // Whenever a drag is finished, the positions and everything related to dragging will be reset
    this.setState({
      PrevMousePositionX: 0,
      MouseChangeX: 0,
      PrevMousePositionY: 0,
      MouseChangeY: 0,
      dragging: false,
      draggingTarget: null
    });
    this.keepDotsInside()
  }

  keepDotsInside = () => { // To make sure the dots will not go beyond the screen
    const { TL, TR, BL, BR, ImageHeight, ImageWidth } = this.state

    this.setState({
      TL: [TL[0] < 0 ? 0 : TL[0] > ImageWidth ? ImageWidth : TL[0], TL[1] < 0 ? 0 : TL[1] > ImageHeight ? ImageHeight : TL[1]],
      TR: [TR[0] < 0 ? 0 : TR[0] > ImageWidth ? ImageWidth : TR[0], TR[1] < 0 ? 0 : TR[1] > ImageHeight ? ImageHeight : TR[1]],
      BL: [BL[0] < 0 ? 0 : BL[0] > ImageWidth ? ImageWidth : BL[0], BL[1] < 0 ? 0 : BL[1] > ImageHeight ? ImageHeight : BL[1]],
      BR: [BR[0] < 0 ? 0 : BR[0] > ImageWidth ? ImageWidth : BR[0], BR[1] < 0 ? 0 : BR[1] > ImageHeight ? ImageHeight : BR[1]],
    })
  }

  updatePositions = () => { // Updates the position of a dot when moving
    const left = document.getElementById(this.state.draggingTarget.id).offsetLeft + 5;
    const top = document.getElementById(this.state.draggingTarget.id).offsetTop + 5;
    this.setState({
      [this.state.draggingTarget.id]: [left, top]
    });
  }

  updateAdj = () => { // For each dot there is an adjacents that needs to be moved as well
    const { TL, TR, BL, BR, draggingTarget } = this.state

    if (draggingTarget) {
      switch (draggingTarget.id) {
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

  aspectRatioFix = () => { // Makes sure that the aspectRatio will not go beyond 2 (for further calculation)
    const { aspectRatio } = this.state

    if (aspectRatio < 1)
      this.setState({ aspectRatio: 1 / aspectRatio })
    else if (aspectRatio >= 2) {
      let aspectRatioHolder = aspectRatio
      while (aspectRatioHolder > 2) {
        aspectRatioHolder /= 10;
      }
      this.setState({ aspectRatio: aspectRatioHolder })
    }
  }

  componentDidMount() {
    const { TR, BL, aspectRatio, BackgroundImage } = this.state
    const ImageHolder = new Image();
    let aspectRatioHolder = aspectRatio;

    this.aspectRatioFix()

    if (BackgroundImage) {
      ImageHolder.src = BackgroundImage

      this.setState({
        ImageWidth: ImageHolder.width,
        ImageHeight: ImageHolder.height
      })
    }

    const MinImageSize = ImageHolder.width >= ImageHolder.height ? ImageHolder.height : ImageHolder.width;

    if (aspectRatio >= 2) {
      while (aspectRatioHolder > 2) {
        aspectRatioHolder /= 10;
      }
    }

    this.setState({
      TR: [aspectRatioHolder * (MinImageSize / 2), TR[1]],
      BL: [BL[0], 1 * (MinImageSize / 2)],
      BR: [aspectRatioHolder * (MinImageSize / 2), 1 * (MinImageSize / 2)]
    })

    if (document.getElementById("final-picture")) {
      document.getElementById("final-picture").src = BackgroundImage
      document.getElementById("final-picture").alt = "final picture"
    }

  }

  render() {
    const { TL, TR, BL, BR, ImageWidth, ImageHeight, BackgroundImage } = this.state

    return (
      <div style={{ display: 'flex' }}>
        <div
          id="image-container"
          style={{
            width: ImageWidth,
            height: ImageHeight,
            backgroundImage: `url("${BackgroundImage}")`
          }}
          onMouseDown={e => this.dragStart(e)}
          onMouseMove={e => this.dragging(e)}
          onMouseUp={this.resetDraggingElement}
          onMouseLeave={e => { this.dragEnd(e); this.updateAdj(); e.returnValue = true }}>

          <Draggable id="TL" positions={TL} setDraggingElement={this.setDraggingElement} />
          <Draggable id="TR" positions={TR} setDraggingElement={this.setDraggingElement} />
          <Draggable id="BL" positions={BL} setDraggingElement={this.setDraggingElement} />
          <Draggable id="BR" positions={BR} setDraggingElement={this.setDraggingElement} />
          <Line positions={[TL, TR]} />
          <Line positions={[TL, BL]} />
          <Line positions={[BL, BR]} />
          <Line positions={[BR, TR]} />
        </div>
        {/*eslint-disable-next-line jsx-a11y/alt-text*/}
        <img id="final-picture"/>
      </div>
    );
  }
}

export default ImageCropperReact;