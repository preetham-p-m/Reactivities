import { useField } from "formik";
import { Form, Label } from "semantic-ui-react";

const PasswordField = () => {
    const state = {
        name: "password",
        placeholder: "Password",
        type: "password"
    };

    const [field, meta] = useField(state.name);

    return (<Form.Field error={meta.touched && !!meta.error}>
        <input {...state} {...field} />
        {meta.touched && !!meta.error ? <Label basic color="red">{meta.error}</Label> : null}
    </Form.Field>);
}

export default PasswordField;