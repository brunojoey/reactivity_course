// import React from "react";
import { FieldRenderProps } from "react-final-form";
import { Form, FormFieldProps, Label } from "semantic-ui-react";
import { DateTimePicker } from 'react-widgets';

interface IProps
  extends FieldRenderProps<Date, HTMLElement>,
    FormFieldProps {}

const DateInput: React.FC<IProps> = ({
  id = null,
  input,
  width,
  placeholder,
  meta: { touched, error },
  // Will give access to the rest of the properties of the DateTimePicker
  ...rest
}) => {
  return (
    // !!error Will turn the value into a boolean
    <Form.Field error={touched && !!error}  width={width}>
      <DateTimePicker 
        placeholder={placeholder}
        value={input.value || null}
        onChange={input.onChange}
        {...rest}
      />
    {touched && error && (
      <Label basic color='red'>
        {error}
      </Label>
    )}
  </Form.Field>
  );
};

export default DateInput;