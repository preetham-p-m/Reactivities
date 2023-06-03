import { useField } from "formik";
import { Form, Label } from "semantic-ui-react";

interface TextAreaFieldProps {
  placeholder: string,
  name: string,
  rows: number,
  label?: string
}

const TextAreaField = (props: TextAreaFieldProps) => {
  const [field, meta] = useField(props.name);

  return (
    <Form.Field error={meta.touched && !!meta.error}>
      <label>{props.label}</label>
      <textarea {...field} {...props} />
      {meta.touched && meta.error ? <Label basic color="red">{meta.error}</Label> : null}
    </Form.Field>
  );
}

export default TextAreaField;