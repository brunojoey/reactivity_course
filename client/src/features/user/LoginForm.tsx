import React, { useContext } from "react";
import { FORM_ERROR } from "final-form";
import { Form as FinalForm, Field } from "react-final-form";
import { Button, Form, Header } from "semantic-ui-react";
import TextInput from "../../app/common/form/TextInput";
import { IUserFormValues } from "../../app/models/user";
import { RootStoreContext } from "../../app/stores/rootStore";
import { combineValidators, isRequired } from "revalidate";
import ErrorMessage from "../../app/common/form/ErrorMessage";

const validate = combineValidators({
  email: isRequired("Email"),
  password: isRequired("Password")
});

const LoginForm = () => {
  const rootStore = useContext(RootStoreContext);
  const { login } = rootStore.userStore;

  return (
    <FinalForm
      onSubmit={(values: IUserFormValues) =>
        login(values).catch(error => ({
          [FORM_ERROR]: error, // The error will be stored with the help of Axios
        }))
      }
      validate={validate}
      render={({
        handleSubmit,
        submitting,
        submitError,
        invalid,
        pristine,
        dirtySinceLastSubmit
      }) => (
        <Form onSubmit={handleSubmit} error>
          <Header as='h2' content='Login to Reactivities' color='teal' textAlign='center'/>
          <Field name="email" component={TextInput} placeholder="Email" />
          <Field
            name="password"
            component={TextInput}
            placeholder="Password"
            type="password"
          />
          {submitError && !dirtySinceLastSubmit && (
            <ErrorMessage error={submitError} text='Invalid Email or Password' />
          )}
          <Button
            // eslint-disable-next-line no-mixed-operators
            disabled={invalid && !dirtySinceLastSubmit || pristine}
            loading={submitting}
            color='teal'
            content="Login"
            fluid
          />
        </Form>
      )}
    />
  );
};

export default LoginForm;
