import { useField } from "formik";
import { Form, Label } from "semantic-ui-react";
import DatePicker, { ReactDatePickerProps } from "react-datepicker";

interface DateFieldProps extends Partial<ReactDatePickerProps> {
  name: string;
}

const DateField = (props: DateFieldProps) => {
  const [field, meta, helpers] = useField(props.name);
  return (
    <Form.Field error={meta.touched && !!meta.error}>
      <DatePicker
        {...field}
        {...props}
        selected={(field.value && new Date()) || null}
        onChange={(value) => helpers.setValue(value)}
      />
      {meta.touched && !!meta.error ? <Label basic color="red">{meta.error}</Label> : null}
    </Form.Field>
  );
};

export default DateField;