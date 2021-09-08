import React from "react";

const Line = ({positions}) => {
    return(
        <div
        className="line"
        style={{
            width: Math.sqrt(Math.pow((positions[1][0]-positions[0][0]),2)),
            height: Math.sqrt(Math.pow((positions[1][1]-positions[0][1]),2)),
            left: positions[0][0] > positions[1][0] ? positions[1][0] : positions[0][0],
            top: positions[0][1] > positions[1][1] ? positions[1][1] : positions[0][1]
        }}>

        </div>
    );
}

export default Line;