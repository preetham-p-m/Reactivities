import { Fragment, useEffect, useState } from "react";
import { Container } from "semantic-ui-react";
import NavBar from "../common/NavBar";
import ActivityDashboard from "./Dashboard/ActivityDashboard";
import { Activity } from "../../@types/activity";
import { v4 as uuid } from 'uuid';
import { ActivitiesService } from "../../services/ActivityService";
import Spinner from "../common/Spinner";
import { useStore } from "../../store/Store";
import { observer } from "mobx-react-lite";

const ActivityMain = () => {
    const { activityStore } = useStore();

    const [activities, setActivities] = useState<Activity[]>([]);
    const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [isLoading, setLoading] = useState<boolean>(true);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [deleting, setDeleting] = useState<boolean>(false)

    useEffect(() => {
        ActivitiesService.getList().then((response) => {
            let activities: Activity[] = [];
            response.forEach((activity: Activity) => {
                activity.date = activity.date.split('T')[0];
                activities.push(activity);
            });
            setActivities(activities);
            setLoading(false);
        });
    }, []);

    function handleSelectActivity(id: string) {
        setSelectedActivity(activities.find(x => x.id === id));
    }

    function handleCancelSelectActivity() {
        setSelectedActivity(undefined);
    }

    function handleFormOpen(id?: string) {
        id ? handleSelectActivity(id) : handleCancelSelectActivity();
        setEditMode(true);
    }

    function handleFormClose() {
        setEditMode(false);
    }

    function handleCreateOrEditActivity(activity: Activity) {
        setSubmitting(true);
        if (activity.id) {
            ActivitiesService.update(activity).then(() => {
                setActivities([...activities.filter(x => x.id !== activity.id), activity]);
                setSubmitting(false);
                setEditMode(false);
                setSelectedActivity(activity);
            });
        } else {
            activity.id = uuid();
            ActivitiesService.create(activity).then(() => {
                setActivities([...activities, activity]);
                setSubmitting(false);
                setEditMode(false);
                setSelectedActivity(activity);
            });
        }
    }

    function handleDeleteActivity(id: string) {
        setDeleting(true);
        ActivitiesService.delete(id).then(() => {
            setActivities([...activities.filter(x => x.id !== id)]);
            setDeleting(false);
        });
    }

    return (
        <Fragment>
            <NavBar openForm={handleFormOpen} />
            {isLoading
                ? <Spinner content="Loading app" />
                : <Container style={{ marginTop: '7em' }}>
                    <ActivityDashboard
                        activities={activities}
                        selectedActivity={selectedActivity}
                        selectActivity={handleSelectActivity}
                        cancelSelectActivity={handleCancelSelectActivity}
                        editMode={editMode}
                        openForm={handleFormOpen}
                        closeForm={handleFormClose}
                        createOrEdit={handleCreateOrEditActivity}
                        deleteActivity={handleDeleteActivity}
                        submitting={submitting}
                        deleting={deleting}
                    />
                </Container>
            }
        </Fragment>);
}

export default observer(ActivityMain);