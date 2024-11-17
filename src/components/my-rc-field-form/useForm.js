// 定义状态管理库

import { useRef } from "react";

class FormStore {
  constructor() {
    // 状态值： name: value
    // name 是 Field 的 name
    // value 是 Field 内部组件的 value
    this.store = {};
    // 存储 Field 组件实例
    this.fieldEntities = [];

    this.callbacks = {};
  }

  setCallbacks = (callbacks) => {
    this.callbacks = { ...this.callbacks, ...callbacks };
  };

  // 注册实例(forceUpdate 为了是状态发生变化之后, 更新组件)
  // 成对出现, 套路是: 记得把取消订阅的方法 return 出去
  // 注册与取消注册
  // 订阅与取消订阅
  registerFieldEntities = (entity) => {
    this.fieldEntities.push(entity);

    return () => {
      // 删除组件实例列表
      this.fieldEntities = this.fieldEntities.filter((item) => item !== entity);
      // 删除组件对应的状态值
      delete this.store[entity.props.name];
    };
  };

  // get
  getFieldsValue = () => {
    return { ...this.store };
  };

  getFieldValue = (name) => {
    return this.store[name];
  };

  // set
  // password: 123
  setFieldsValue = (newStore) => {
    // 1. update store
    this.store = {
      ...this.store,
      ...newStore,
    };
    // 2. update Field 组件
    this.fieldEntities.forEach((entity) => {
      Object.keys(newStore).forEach((k) => {
        // store 中 k 和 entity.props.name (Field 组件) 是一一对应的关系
        if (k === entity.props.name) {
          entity.onStoreChange();
        }
      });
    });
  };

  validate = () => {
    let err = [];
    // todo 校验
    // 简版校验

    this.fieldEntities.forEach((entity) => {
      const { name, rules } = entity.props;

      const value = this.getFieldValue(name);
      let rule = rules[0];

      if (rule && rule.required && (value === undefined || value === "")) {
        err.push({ [name]: rule.message, value });
      }
    });

    return err;
  };

  submit = () => {
    console.log("submit"); //sy-log

    let err = this.validate();
    // 提交
    const { onFinish, onFinishFailed } = this.callbacks;

    if (err.length === 0) {
      // 校验通过
      onFinish(this.getFieldsValue());
    } else {
      // 校验不通过
      onFinishFailed(err, this.getFieldsValue());
    }
  };

  // 暴露给外界的口子
  getForm = () => {
    return {
      getFieldsValue: this.getFieldsValue,
      getFieldValue: this.getFieldValue,
      setFieldsValue: this.setFieldsValue,
      registerFieldEntities: this.registerFieldEntities,
      submit: this.submit,
      setCallbacks: this.setCallbacks,
    };
  };
}

// 使用 useRef 来保证每一个 new FormStore() 对应一个函数组件
// 这样可以有一个在组件生命周期的稳定态引用, 随时可以在 FormStore 中进行读取操作
export default function useForm(form) {
  // 存值，在组件卸载之前指向的都是同一个值
  const formRef = useRef();

  if (!formRef.current) {
    if (form) {
      // 接受到 form 的话, 就使用传进来的 form
      formRef.current = form;
    } else {
      // 没有 form 的话, 就去实例化 + 执行 getForm 函数
      const formStore = new FormStore();
      formRef.current = formStore.getForm();
    }
  }
  return [formRef.current];
}
