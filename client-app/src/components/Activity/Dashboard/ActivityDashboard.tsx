import { Grid } from "semantic-ui-react";
import ActivityList from "../List/ActivityList";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useStore } from "../../../store/Store";
import Spinner from "../../common/Spinner";

const ActivityDashboard = observer(() => {

    const { activityStore } = useStore();
    const { loadActivities, activityRegistry } = activityStore;

    useEffect(() => {
        if (activityRegistry.size <= 1) loadActivities();
    }, [activityRegistry.size, loadActivities]);

    return (
        <>
            {activityStore.loadingInitial
                ? <Spinner content="Loading app" />
                : <Grid>
                    <Grid.Column width='10'>
                        <ActivityList />
                    </Grid.Column>
                    <Grid.Column width="6">
                        <h2>Activity Filters</h2>
                    </Grid.Column>
                </Grid>
            }
        </>
    );
});

export default ActivityDashboard;