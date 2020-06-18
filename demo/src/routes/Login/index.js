import React from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { useForm } from 'react-hook-form';
import { useFeathers } from '@cond/use-feathers';
import { Link, useHistory } from 'react-router-dom';

const Login = ({}) => {
  const { handleSubmit, register, errors } = useForm();
  const { login: userLogin } = useFeathers();
  const history = useHistory();

  const onSubmit = (values) => {
    userLogin(values)
      .then(() => {
        history.push('/register')
      })
      .catch((error) => {
        
      });
  };

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)} className="p-2">
        <FormGroup>
          <Label for="exampleEmail">Email</Label>
          <Input
            type="email"
            name="email"
            placeholder="with a placeholder"
            innerRef={register({
              required: 'Required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
              },
            })}
            invalid={errors.email}
          />
        </FormGroup>
        <FormGroup>
          <Label for="examplePassword">Password</Label>
          <Input
            type="password"
            name="password"
            placeholder="password placeholder"
            innerRef={register({
              required: 'Required',
            })}
            invalid={errors.password}
          />
        </FormGroup>
        <Button type="submit">login</Button>
      </Form>
      <Button color="link">
        <Link to="/register">register</Link>
      </Button>
    </>
  );
};

export default Login;
