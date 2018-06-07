let rootInstance = null;
/**
 *
 * @param {Object} element 经CreateElement后的节点描述性对象: VNode
 * @returns {Object}  根据表述对象实例的对象
 */
function instantiate(element) {
    const { type, props } = element;

    // create element
    const isTextElement = type === "TEXT_ELEMENT";
    const dom = isTextElement
        ? document.createTextNode("") // create a text node and set the nodevalue attribute
        : document.createElement(type);

    updateDOMProperties(dom, [], props);

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

    // instance中保存了DOM节点，VNode，子节点实例
    const instance = { dom, element, childInstances };
    return instance;
}

/**
 *
 * @param {DOM node} parentDom
 * @param {DOM node} instance
 * @param {JSX经过编译后，并执行CreateElement后的JS对象} element:VNode
 * @returns DOM节点实例，缓存
 */
function reconcile(parentDom, instance, element) {
    if (instance === null) {
        const newInstance = instantiate(element);
        parentDom.appendChild(newInstance.dom);
        return newInstance;
    } else if (element === null) {
        // Remove instance
        parentDom.removeChild(instance.dom);
        return null;
    } else if (instance.element.type === element.type) {
        // 新旧VNode类型比较，类型相同，基于类型更新
        updateDOMProperties(
            instance.dom,
            instance.element.props,
            element.props
        );
        instance.childInstances = reconcileChildren(instance, element);
        instance.element = element;
        return instance;
    } else {
        const newInstance = instantiate(element);
        parentDom.replaceChild(newInstance.dom, element.dom);
        return newInstance;
    }
}

function reconcileChildren(instance, element) {
    const dom = instance.dom;
    const childInstances = instance.childInstances;
    const nextChildElements = element.props.children || [];
    const newChildInstances = [];

    const count = Math.max(childInstances.length, nextChildElements.length);
    for (let i = 0; i < count; i++) {
        const childInstance = childInstances[i];
        const childElement = nextChildElements[i];

        // 相同level的节点比较
        const newChildInstance = reconcile(dom, childInstance, childElement);
        newChildInstances.push(newChildInstance);
    }

    return newChildInstances.filter(instance => instance !== null);
}

function updateDOMProperties(dom, prevProps, nextProps) {
    // event listener add
    const isEvent = name => name.startsWith("on");
    const isAttribute = name => !isEvent(name) && name !== "children";

    // Remove event Listener
    Object.keys(prevProps)
        .filter(isEvent)
        .forEach(name => {
            const eventType = name.toLocaleLowerCase().substring(2);
            dom.removeEventListener(eventType, prevProps[name]);
        });

    // attribute set
    Object.keys(prevProps)
        .filter(isAttribute)
        .forEach(name => {
            dom[name] = null;
        });

    // remove event listener
    Object.keys(nextProps)
        .filter(isAttribute)
        .forEach(name => (dom[name] = nextProps[name]));

    // add event listener
    Object.keys(nextProps)
        .filter(isEvent)
        .forEach(name => {
            const eventType = name.toLocaleLowerCase().substring(2);
            dom.addEventListener(eventType, nextProps[name]);
        });
}

export function render(element, container) {
    debugger;
    const preInstance = rootInstance;
    const nextInstance = reconcile(container, preInstance, element);
    rootInstance = nextInstance;
}
