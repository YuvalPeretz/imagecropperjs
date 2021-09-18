import React from "react";

const Draggable = ({ setDraggingElement, id, positions }) => {
    const left = positions[0]
    const top = positions[1]

    return (
        <div
            id={id}
            className="draggable"
            onMouseDown={setDraggingElement}
            style={{ left: `${left -5}px`, top: `${top -5}px` }} />
    );
}

export default Draggable;