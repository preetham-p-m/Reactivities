import { useField } from "formik";
import { Form, Label, Select } from "semantic-ui-react";

interface DropDownFieldProps {
  placeholder: string;
  name: string;
  label?: string;
  options: any;
}

const DropDownField = (props: DropDownFieldProps) => {
  const [field, meta, helpers] = useField(props.name);

  return (
    <Form.Field error={meta.touched && !!meta.error}>
      <label>{props.label}</label>
      <Select
        clearable
        options={props.options}
        value={field.value || null}
        onChange={(e, d) => helpers.setValue(d.value)}
        onBlur={(e, d) => helpers.setTouched(true)}
        placeholder={props.placeholder}
      />
      {meta.touched && !!meta.error
        ? (<Label basic color="red">{meta.error}</Label>)
        : null}
    </Form.Field>
  );
};

export default DropDownField;