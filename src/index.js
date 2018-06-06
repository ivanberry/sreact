import React from "./lib/react";

const rootDom = document.getElementById("root");
function tick() {
    const time = new Date().toLocaleTimeString();
    const clockElement = <p id="test">Time is: {time}</p>;
    React.render(clockElement, rootDom);
}

tick();
setInterval(tick, 1000);
