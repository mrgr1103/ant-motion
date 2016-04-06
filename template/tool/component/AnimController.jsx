import React, { PropTypes } from 'react';
import assign from 'object-assign';
import animType from '../../common/animType';
import Common from './Common';
import Popover from './Popover';
import List from './List';
import { Input, InputNumber, Button, Icon } from 'antd';
const easeing = [
  'linear',
  'easeInSine',
  'easeOutSine',
  'easeInOutSine',
  'easeInQuad',
  'easeOutQuad',
  'easeInOutQuad',
  'easeInCubic',
  'easeOutCubic',
  'easeInOutCubic',
  'easeInQuart',
  'easeOutQuart',
  'easeInOutQuart',
  'easeInQuint',
  'easeOutQuint',
  'easeInOutQuint',
  'easeInExpo',
  'easeOutExpo',
  'easeInOutExpo',
  'easeInCirc',
  'easeOutCirc',
  'easeInOutCirc',
  'easeInBack',
  'easeOutBack',
  'easeInOutBack',
  'easeInElastic',
  'easeOutElastic',
  'easeInOutElastic',
  'easeInBounce',
  'easeOutBounce',
  'easeInOutBounce',
];

function noop() {
}

class AnimController extends Common {
  constructor() {
    super(...arguments);
    this.state = {
      config: this.props.stateConfig,
      childId: this.props.childId,
    };
    [
      'getAnimContent',
      'panelHandleChange',
    ].forEach((method) => this[method] = this[method].bind(this));
  }

  changeValue(_key, e) {
    const keys = _key.split('&>');
    const dom = e.target;
    const configChild = this.config[this.state.childId] = this.config[this.state.childId] || {};
    let key = keys[0];
    configChild.variables = configChild.variables || {};
    if (keys.length === 2) {
      configChild.variables[keys[0]] = configChild.variables[keys[0]] || {};
      configChild.variables[keys[0]][keys[1]] = dom.value;
    } else {
      configChild.variables[key] = dom.value;
    }
  }

  numberChangeValue(key, value) {
    const configChild = this.config[this.state.childId] = this.config[this.state.childId] || {};
    configChild.variables = configChild.variables || {};
    configChild.variables[key] = value;
  }

  panelHandleChange(type, value) {
    this.config[this.state.childId] = this.config[this.state.childId] || {};
    this.config[this.state.childId].variables = this.config[this.state.childId].variables || {};
    this.config[this.state.childId].variables[type] = value;
  }

  getAnimContent(data, i) {
    let animOptionChild;
    if (data.key === 'type') {
      animOptionChild = Object.keys(animType).map(key => {
        return (data.donType || []).indexOf(key) >= 0 ? null : (
          <li value={key} key={key}>{animType[key].name}</li>);
      }).filter(c => c);
    }
    let inputNumOrStr = typeof data.value === 'number' ? (
      <InputNumber min={data.key==='delay' ? 0 : 100} step={100} defaultValue={data.value}
        onChange={this.numberChangeValue.bind(this, data.key)}
      />) : (<Input type='text' placeholder={data.value}
      onChange={this.changeValue.bind(this, data.key)} />);
    if (data.key === 'ease') {
      const easeChild = easeing.map(key => {
        return (<li value={key} key={key}>{key}</li>);
      });
      inputNumOrStr = (<List defaultValue={data.value}
        onChange={this.panelHandleChange.bind(this, 'ease')}
        className="tool-list"
      >
        {easeChild}
      </List>);
    }
    const animContentChild = data.key === 'type' ?
      (
        <List defaultValue={data.value}
          onChange={this.panelHandleChange.bind(this, 'type')}
          className="tool-list"
        >
          {animOptionChild}
        </List>) : inputNumOrStr;
    const placement = data.key === 'type' || data.key === 'ease' ? 'rightTop' : 'right';
    const overlayClassName = data.key === 'type' || data.key === 'ease' ? 'tool-popover no-padding-right' : 'tool-popover';
    return (
      <li key={i}>
        <Popover placement={placement}
          overlay={animContentChild}
          overlayClassName={overlayClassName}
          trigger="click"
        >
          <button><img src={data.icon} /><p>{data.name}</p></button>
        </Popover>
      </li>);
  }

  render() {
    const animContent = this.props.data.map(this.getAnimContent);
    return (
      <div className="tool-variable-panel" id="V-Panel" visible>
        <div className="tool-logo">
          <img src="https://os.alipayobjects.com/rmsportal/REMvFpbNayUvuur.svg" />
          <p>动画编辑</p>
        </div>
        <ul>
          {animContent}
        </ul>
        <Button type="primary" size="small"
          onClick={this.clickMake.bind(this, 'variables', this.props.callBack)}
        >
          保存
        </Button>
      </div>
    );
  }
}

AnimController.propTypes = {
  className: PropTypes.string,
  data: PropTypes.array,
  childId: PropTypes.string,
  stateConfig: PropTypes.object,
  callBack: PropTypes.func,
};

AnimController.defaultProps = {
  className: 'tool-data-panel',
  callBack: noop,
};

export default AnimController;
