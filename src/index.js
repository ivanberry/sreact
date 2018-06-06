import React from "./lib/react";

const rootDom = document.getElementById("root");
function tick() {
    const time = new Date().toLocaleTimeString();
    const clockElement = <h1 id="test">{time}</h1>;
    React.render(clockElement, rootDom);
}

tick();
setInterval(tick, 1000);
