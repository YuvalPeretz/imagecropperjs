import React from "react";

const Draggable = ({ setDraggingElement, id, positions }) => {
    const left = positions[0]
    const top = positions[1]

    return (
        <div
            id={id}
            className="draggable"
            onMouseDown={setDraggingElement}
            style={{ left: `${left}px`, top: `${top}px` }} />
    );
}

export default Draggable;