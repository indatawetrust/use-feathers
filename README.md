[![Build Status](https://travis-ci.org/indatawetrust/use-feathers.svg?branch=master)](https://travis-ci.org/indatawetrust/use-feathers)

This package is based on feathers js client packages. For more detailed information https://docs.feathersjs.com/api/client.html

Sample project https://github.com/indatawetrust/use-feathers/tree/master/demo. You can try it at https://naughty-cray-bdab6d.netlify.app/

## Installation

```
npm install @cond/use-feathers -S
```

### feathers client
```
npm i @feathersjs/feathers @feathersjs/socketio-client socket.io-client @feathersjs/authentication-client -S
```

```js
import io from 'socket.io-client';
import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import auth from '@feathersjs/authentication-client';

const URL = process.env.REACT_APP_URL;

const socket = io(URL);
const feathersClient = feathers()
  .configure(socketio(socket))
  .configure(auth({
    storage: window.localStorage
  }));

export default feathersClient;
```

#### FeathersProvider

#### Props

**client** feathersjs client

**initialServices** services to be used in the application. state values are created.

```jsx
import React from 'react'
import ReactDOM from 'react-dom'

import { FeathersProvider } from '@cond/use-feathers'
import feathersClient from './feathersClient'

import App from './App'

const rootElement = document.getElementById('root')
ReactDOM.render(
  <FeathersProvider
    client={feathersClient}
    initialServices={['todo']}
  >
    <App />
  </FeathersProvider>,
  rootElement
)
```
### useFeathers
```js
const { login } = useFeathers();
```
##### login

```jsx
import React from "react";
import { Form, Input, Button, Checkbox, message } from "antd";
import { useFeathers } from "@cond/use-feathers";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 6 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 6 },
};

const Login = () => {
  const { login } = useFeathers();
  const onFinish = (values) => {
    login(values)
      .then(() => {
        message.success('login successful');
      });
      .catch((error) => {
        message.error(error.message);
      });
  };

  return (
    <Form
      {...layout}
      name="basic"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        label="Email"
        name="email"
        type="email"
        rules={[{ required: true, message: "Please input your email!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item {...tailLayout} name="remember" valuePropName="checked">
        <Checkbox>Remember me</Checkbox>
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Login;
```

## crud hooks
```js
const { useFind, useCreate, useUpdate, useRemove, usePatch } = useFeathers();
```

All hooks return three parameters. Action, state and resetState.

**state**
initial state
```js
{
  isPending: false,
  isLoaded: false,
  error: null,
  data: null,
}
```

**action**
For detailed information about actions and parameters they take: https://docs.feathersjs.com/guides/basics/services.html#service-methods

**resetState**
returns to the state initial value

### useCreate
```js
const { createAction, state: createState, resetCreateState } = useCreate('todo');
```

### useFind
```js
const { findAction, state: findState, resetFindState } = useFind('todo');
```

### useGet
```js
const { getAction, state: getState, resetGetState } = useGet('todo');
```

### useUpdate
```js
const { updateAction, state: updateState, resetUpdateState } = useUpdate('todo');
```

### usePatch
```js
const { patchAction, state: patchState, resetPatchState } = usePatch('todo');
```

### useRemove
```js
const { removeAction, state: removeState, resetRemoveState } = useRemove('todo');
```
