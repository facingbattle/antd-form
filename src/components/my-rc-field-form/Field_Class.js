import React, {Component} from "react";
import FieldContext from "./FieldContext";

export default class Field extends Component {
  static contextType = FieldContext;

  componentDidMount() {
    // 这块有点恶心
    // = 后面的 this.context.registerFieldEntities(this) 是先执行的, 把组件实例注册到 FormStore 上
    // this.context.registerFieldEntities(this) 执行完, 返回一个函数用于, 卸载上面的注册动作
    this.unregister = this.context.registerFieldEntities(this);
  }

  componentWillUnmount() {
    this.unregister();
  }

  onStoreChange = () => {
    this.forceUpdate();
  };

  getControlled = () => {
    const { getFieldValue, setFieldsValue } = this.context;
    const { name } = this.props;
    return {
      // 动态的状态值 value
      value: getFieldValue(name), //"omg", // get state
      onChange: (e) => {
        const newValue = e.target.value;
        // set state
        setFieldsValue({ [name]: newValue });
      },
    };
  };

  render() {
    const { children } = this.props;

    const returnChildNode = React.cloneElement(children, this.getControlled());
    return returnChildNode;
  }
}