import { Button, Header, Segment } from "semantic-ui-react";
import { useEffect, useState } from "react";
import { useStore } from "../../../store/Store";
import { observer } from "mobx-react-lite";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Activity } from "../../../@types/Activity";
import Spinner from "../../common/Spinner";
import { v4 } from "uuid";
import { Formik, Form } from "formik";
import TextField from "../../common/FormHelper/TextField";
import * as Yup from "yup";
import TextAreaField from "../../common/FormHelper/TextAreaField";
import DropDownField from "../../common/FormHelper/DropDownField";
import { ActivityCategoryOptions } from "./ReferenceData/ActivityCategoryOptions";
import DateField from "../../common/FormHelper/DateField";
import { DateFormat } from "../../../@types/CommonUtils";
import { RouterPath } from "../../../@types/RouterPath";

const ActivityForm = observer(() => {
    const { activityStore } = useStore();
    const { createActivity,
        updateActivity,
        loading,
        loadingInitial,
        loadActivity } = activityStore;
    const { id } = useParams();
    const navigate = useNavigate();

    const [activity, setActivity] = useState<Activity>({
        id: '',
        title: '',
        date: new Date(),
        description: '',
        category: '',
        city: '',
        venue: ''
    });

    const validationSchema = Yup.object({
        title: Yup.string()
            .required("Title is required")
            .min(3, "Title should have minumun 3 characters")
            .max(50, "Title should not exceed 50 characters"),
        date: Yup.string()
            .required("Date is required"),
        description: Yup.string()
            .max(2000, "Description cannot exceed 2000 characters"),
        category: Yup.string()
            .required("Category is required")
            .min(3, "Category should have minumun 3 characters")
            .max(50, "Category should not exceed 50 characters"),
        city: Yup.string()
            .required("City is required"),
        venue: Yup.string()
            .required("Venue is required")
    })

    useEffect(() => {
        if (id) loadActivity(id).then(activity => setActivity(activity!));
    }, [id, loadActivity]);

    const handleFormSubmit = (activity: Activity) => {
        if (activity.id) {
            updateActivity(activity).then(() => navigate(`/${RouterPath.ACTIVITIES}/${activity.id}`));
        } else {
            activity.id = v4();
            createActivity(activity).then(() => navigate(`/${RouterPath.ACTIVITIES}/${activity.id}`));
        }
    }

    return (
        <>
            {loadingInitial
                ? <Spinner />
                : <Segment clearing>
                    <Header content="Activity Details" sub color="teal" />
                    <Formik
                        validationSchema={validationSchema}
                        enableReinitialize
                        initialValues={activity}
                        onSubmit={activity => handleFormSubmit(activity)}>
                        {({ handleSubmit, isValid, isSubmitting, dirty }) => (
                            <Form className="ui form" onSubmit={handleSubmit} autoComplete='off'>
                                <TextField placeholder='Title' name='title' />
                                <TextAreaField placeholder='Description' name='description' rows={5} />
                                <DropDownField options={ActivityCategoryOptions} placeholder='Category' name='category' />
                                <DateField
                                    placeholderText='Date'
                                    name='date'
                                    showTimeSelect
                                    timeCaption="time"
                                    dateFormat={DateFormat.STANDARD}
                                />
                                <Header content="Location Details" sub color="teal" />
                                <TextField placeholder='City' name='city' />
                                <TextField placeholder='Venue' name='venue' />
                                <Button disabled={isSubmitting || !isValid || !dirty} loading={loading} floated="right" positive type="submit" content="Submit" />
                                <Button as={Link} to={"/activities"} floated="right" type="button" content="Cancel" />
                            </Form>
                        )}
                    </Formik>
                </Segment>
            }
        </>
    );
})

export default ActivityForm;