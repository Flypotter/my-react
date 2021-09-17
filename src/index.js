import ReactDOM from './kreact/react-dom';
import React from 'react';
import Component from './kreact/Component';

class ClassComponent extends Component {
  render() {
    return (
      <div className="border">
        <p>类组件名-{this.props.name}</p>
      </div>
    )
  }
}

function FunctionComponent(props) {
  return (
    <div className="border">
      <p>函数组件名-{props.name}</p>
    </div>
  )
}

const ele = (
  <div>
    你好
    <h3>hello, react</h3>
    {/* <FunctionComponent name="123" />
    <ClassComponent name="456" /> */}
  </div>
);

ReactDOM.render(
  ele,
  document.getElementById('root')
);

