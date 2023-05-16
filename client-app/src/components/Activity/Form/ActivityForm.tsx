import { Button, Form, Segment } from "semantic-ui-react";
import { ChangeEvent, useEffect, useState } from "react";
import { useStore } from "../../../store/Store";
import { observer } from "mobx-react-lite";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Activity } from "../../../@types/activity";
import Spinner from "../../common/Spinner";
import { v4 } from "uuid";

const ActivityForm = observer(() => {
    const { activityStore } = useStore();
    const { selectedActivity,
        createActivity,
        updateActivity,
        loading,
        loadingInitial,
        loadActivity } = activityStore;
    const { id } = useParams();
    const navigate = useNavigate();

    const [activity, setActivity] = useState<Activity>({
        id: '',
        title: '',
        date: '',
        description: '',
        category: '',
        city: '',
        venue: ''
    });

    useEffect(() => {
        if (id) loadActivity(id).then(activity => setActivity(activity!));
    }, [id, loadActivity]);

    const handleOnSubmit = () => {
        if (activity.id) {
            updateActivity(activity).then(() => navigate(`/activity/${activity.id}`));
        } else {
            activity.id = v4();
            createActivity(activity).then(() => navigate(`/activity/${activity.id}`));
        }
    }

    const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setActivity({ ...activity, [name]: value });
    }

    return (
        <>
            {loadingInitial
                ? <Spinner />
                : <Segment clearing>
                    <Form onSubmit={handleOnSubmit} autoComplete='off'>
                        <Form.Input placeholder='Title' value={activity.title} name='title' onChange={handleInputChange} />
                        <Form.TextArea placeholder='Description' value={activity.description} name='description' onChange={handleInputChange} />
                        <Form.Input placeholder='Category' value={activity.category} name='category' onChange={handleInputChange} />
                        <Form.Input type="date" placeholder='Date' value={activity.date} name='date' onChange={handleInputChange} />
                        <Form.Input placeholder='City' value={activity.city} name='city' onChange={handleInputChange} />
                        <Form.Input placeholder='Venue' value={activity.venue} name='venue' onChange={handleInputChange} />
                        <Button loading={loading} floated="right" positive type="submit" content="Submit" />
                        <Button as={Link} to={"/activities"} floated="right" type="button" content="Cancel" />
                    </Form>
                </Segment>
            }
        </>
    );
})

export default ActivityForm;