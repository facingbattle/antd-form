import React from "react";
import FieldContext from "./FieldContext";
import useForm from "./useForm";

export default function Form(
  { 
    children, 
    form, 
    onFinish, 
    onFinishFailed 
  },
  // 外层使用了 React.forwardRef()
  // 这时该 ref 就是一个单独的参数了
  ref
) {
  // 函数组件 使用 form 来执行
  // 类组件 不使用 form 也可以执行
  // 把 form 传给 useForm, 在 useForm 内部做处理
  const [formInstance] = useForm(form);

  // 把子孙组件的 formInstance, 传递给组件组件
  // 也就是反弹出去
  React.useImperativeHandle(ref, () => formInstance);

  // 往 formInstance 里面的存回调函数
  formInstance.setCallbacks({
    onFinish,
    onFinishFailed,
  });

  // form 渲染 children
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        formInstance.submit();
      }}
    >
      <FieldContext.Provider value={formInstance}>
        {children}
      </FieldContext.Provider>
    </form>
  );
}
