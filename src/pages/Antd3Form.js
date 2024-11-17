const nameRules = {
    required: true,
    message: '请输入姓名!',
}

const passwordRules = {
    required: true,
    message: '请输入密码!',
}

@createForm
class MyRCFormPage extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.props.form.setFieldsValue({
            username: 'default',
        })
    }

    submit = () => {
        const { getFieldsValue, validateFields } = this.props.form
        console.log('submit', getFieldsValue())

        validateFields((err, val) => {
            if (err) {
                console.log('err', err)
            } else {
                console.log('校验成功', val)
            }
        })
    }

    render() {
        console.log('props', this.props)
        // 拓展 input 组件的能力, 如: 状态值...
        const { getFieldDecorator } = this.props.form

        return (
            <div>
                <h3>Antd3Form Page</h3>
                {getFieldDecorator('username', {
                    rules: [nameRules],
                })(
                    <Input placeholder="Username"/>
                )}
                {getFieldDecorator('password', {
                    rules: [passwordRules],
                })(
                    <Input placeholder="Password"/>
                )}
                <button onClick={this.submit}>submit</button>
            </div>
        )
    }
}
