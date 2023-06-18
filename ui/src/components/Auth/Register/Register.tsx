import { observer } from "mobx-react-lite";
import { useStore } from "../../../store/Store";
import { ErrorMessage, Form, Formik } from "formik";
import { Button, Header } from "semantic-ui-react";
import TextField from "../../Common/FormHelper/TextField";
import PasswordField from "../../Common/FormHelper/PasswordField";
import * as Yup from "yup";
import ValidationError from "../../Errors/Validation/ValidationError";

const Register = observer(() => {
    const { authStore: userStore } = useStore();

    const validationSchema = Yup.object({
        displayName: Yup.string().required(),
        userName: Yup.string().required().min(5, "UserName should have minumun 5 characters"),
        password: Yup.string().required(),
        email: Yup.string().required()
    }
    );

    return (
        <Formik
            initialValues={{ displayName: "", userName: "", email: "", password: "", error: "" }}
            onSubmit={(values, { setErrors }) =>
                userStore.register(values)
                    .catch(error => setErrors({ error: error }))}
            validationSchema={validationSchema}
        >
            {({ handleSubmit, isSubmitting, errors, isValid, dirty }) => (
                <Form className="ui form error" onSubmit={handleSubmit} autoComplete="false">
                    <Header as={"h2"} content={"Register"} color="teal" textAlign="left" />
                    <TextField placeholder="Name" name="displayName" />
                    <TextField placeholder="User Name" name="userName" />
                    <TextField placeholder="Email" name="email" />
                    <PasswordField />
                    <ErrorMessage name="error" render={() =>
                        <ValidationError errors={errors.error} />
                    } />
                    <Button disabled={!isValid || !dirty || isSubmitting} loading={isSubmitting} positive content="Regiter" type="submit" fluid />
                </Form>)}

        </Formik>
    );
});

export default Register;