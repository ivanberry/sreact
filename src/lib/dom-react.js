let rootInstance = null;
/**
 *
 * @param {Object} element 经CreateElement后的节点描述性对象
 * @returns {Object}  根据表述对象实例的对象
 */
function instantiate(element) {
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

    /**
     * Instantiate and append children
     *
     * Cache the DOM node, avoid creating or removing instances as much as it can.
     * Creating and removing instance means that we will also be modifying the DOM
     * tree, so the more we re-utilize instances the less we modify the DOM tree
     */
    const childElements = props.children || [];
    const childInstances = childElements.map(instantiate); // Recursive children element
    const childDoms = childInstances.map(childInstance => childInstance.dom);
    childDoms.forEach(childDom => dom.appendChild(childDom));

    const instance = { dom, element, childInstances };
    return instance;
}

function reconcile(parentDom, instance, element) {
    const newInstance = instantiate(element);
    if (instance === null) {
        parentDom.appendChild(newInstance.dom);
    } else {
        parentDom.replaceChild(newInstance.dom, instance.dom);
    }
    return newInstance;
}

export function render(element, container) {
    const preInstance = rootInstance;
    const nextInstance = reconcile(container, preInstance, element);
    rootInstance = nextInstance;
}
