import React, {Component} from "react";
import FieldContext from "./FieldContext";
// export default class Field extends Component {
//   static contextType = FieldContext;

//   componentDidMount() {
//     this.unregister = this.context.registerFieldEntities(this);
//   }

//   componentWillUnmount() {
//     this.unregister();
//   }

//   onStoreChange = () => {
//     this.forceUpdate();
//   };

//   getControlled = () => {
//     const { getFieldValue, setFieldsValue } = this.context;
//     const { name } = this.props;
//     return {
//       value: getFieldValue(name), //"omg", // get state
//       onChange: (e) => {
//         const newValue = e.target.value;
//         // set state
//         setFieldsValue({ [name]: newValue });
//       },
//     };
//   };
//   render() {
//     const { children } = this.props;

//     const returnChildNode = React.cloneElement(children, this.getControlled());
//     return returnChildNode;
//   }
// }

export default function Field(props) {
  const {children, name} = props;

  const {
    getFieldValue,
    setFieldsValue,
    // 跨组件传递数据
    registerFieldEntities,
  } = React.useContext(FieldContext);

  // 函数组件 forceUpdate 套路代码
  // 在函数组件里想让组件更新, 就是修改组件的状态值
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

  // 注意和 useEffect 的区别
  // useEffect 的执行时机是在 组件渲染慢完成后 延迟执行的, 订阅的时机晚了
  // useLayoutEffect 是组件渲染完立即执行
  React.useLayoutEffect(() => {
    const unregister = registerFieldEntities({
      props,
      onStoreChange: forceUpdate,
    });

    // 取消订阅函数
    return unregister;
  }, []);

  // 扩展属性
  const getControlled = () => {
    return {
      value: getFieldValue(name), //"omg", // get state
      onChange: (e) => {
        const newValue = e.target.value;
        // set state
        setFieldsValue({[name]: newValue});
      },
    };
  };

  // 扩展功能, 在原先的基础上加, 先 clone 一个组件出来
  const returnChildNode = React.cloneElement(children, getControlled());

  return returnChildNode;
}
