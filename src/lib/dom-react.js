/**
 *
 * @param {React element/ native element} element
 * @param {native element} parentDom
 */
export function render(element, parentDom) {
    const { type, props } = element;

    // create element
    const isTextElement = type === "TEXT_ELEMENT";
    const dom = isTextElement
        ? document.createTextNode("") // create a text node and set the nodevalue attribute
        : document.createElement(type);

    // event listener add
    const isListener = name => name.startsWith("on");
    Object.keys(props)
        .filter(isListener)
        .forEach(name => {
            const eventType = name.toLocaleLowerCase().substring(2);
            dom.addEventListener(eventType, props[name]);
        });

    // attribute set
    const isAttribute = name => !isListener(name) && name !== "children";
    Object.keys(props)
        .filter(isAttribute)
        .forEach(name => {
            dom[name] = props[name];
        });

    const childElements = props.children || [];
    childElements.forEach(childElement => render(childElement, dom));

    // Append or replace dom
    if (!parentDom.lastChild) {
        parentDom.appendChild(dom);
    } else {
        parentDom.replaceChild(dom, parentDom.lastChild);
    }
}
