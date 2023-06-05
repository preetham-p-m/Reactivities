import { ErrorMessage, Form, Formik } from "formik";
import TextField from "../../common/FormHelper/TextField";
import PasswordField from "../../common/FormHelper/PasswordField";
import { Button, Header, Label } from "semantic-ui-react";
import { useStore } from "../../../store/Store";
import { observer } from "mobx-react-lite";

const Login = observer(() => {
    const { userStore } = useStore();

    return (
        <Formik
            initialValues={{ email: "", password: "", error: "" }}
            onSubmit={(values, { setErrors }) =>
                userStore.login(values)
                    .catch(error => setErrors({ error: "Invalid credentilas" }))}
        >
            {({ handleSubmit, isSubmitting, errors }) => (
                <Form className="ui form" onSubmit={handleSubmit} autoComplete="false">
                    <Header as={"h2"} content={"Login"} color="teal" textAlign="left" />
                    <TextField placeholder="Email" name="email" />
                    <PasswordField />
                    <ErrorMessage name="error" render={() =>
                        <Label style={{ marginBottom: 10 }} basic color="red" content={errors.error} />}
                    />
                    <Button loading={isSubmitting} positive content="Login" type="submit" fluid />
                </Form>)}
        </Formik>
    );
});

export default Login;