/**
 * 0. JSX在babel有如下编译过程：
 *
 * ```jsx
 *let el = <section id='title'>
      <h1>This is the title</h1>
      <p>What did this <a href='/bar'>used</a> for?</p>
    	</section>
 * ```
 *
 * 'use strict';

var el = React.createElement(
      'section',
      { id: 'title' },
      React.createElement(
            'h1',
            null,
            'This is the title'
      ),
      React.createElement(
            'p',
            null,
            'What did this ',
            React.createElement(
                  'a',
                  { href: '/bar' },
                  'used'
            ),
            ' for?'
      )
);
 * )
 */

export function createElement(type, config = {}, ...children) {
    const props = Object.assign({}, config);
    const hasChildren = children.length > 0;

    const rawChildren = hasChildren ? [].concat(...children) : [];

    props.children = rawChildren
        .filter(child => child !== null && child !== undefined)
        .map(
            child =>
                child instanceof Object ? child : createTextElement(child)
        );

    return { type, props };
}

/**
 *
 * @param {文本节点} value
 */
function createTextElement(value) {
    return {
        type: "TEXT_ELEMENT",
        props: {
            nodeValue: value
        }
    };
}
