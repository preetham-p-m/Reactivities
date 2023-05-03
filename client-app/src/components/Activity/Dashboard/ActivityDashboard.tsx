import { Grid } from "semantic-ui-react";
import ActivityList from "../List/ActivityList";
import ActivityDetails from "../Details/ActivityDetails";
import ActivityForm from "../Form/ActivityForm";
import { useStore } from "../../../store/Store";
import { observer } from "mobx-react-lite";

const ActivityDashboard = observer(() => {
    const { activityStore } = useStore();
    const { selectedActivity, editMode } = activityStore;

    return (
        <Grid>
            <Grid.Column width='10'>
                <ActivityList />
            </Grid.Column>
            <Grid.Column width="6">
                {selectedActivity && !editMode && <ActivityDetails />}
                {editMode && <ActivityForm />}
            </Grid.Column>
        </Grid>
    );
});

export default ActivityDashboard;