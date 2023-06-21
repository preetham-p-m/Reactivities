import { Grid } from "semantic-ui-react";
import ActivityList from "./List/ActivityList";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useStore } from "../../../store/Store";
import Spinner from "../../Common/Spinner";
import ActivityFilters from "./Filters/ActivityFilters";

const ActivityDashboard = () => {

    const { activityStore } = useStore();
    const { loadActivities, activityRegistry } = activityStore;

    useEffect(() => {
        if (activityRegistry.size <= 1) loadActivities();
    }, [activityRegistry.size, loadActivities]);

    return (
        <>
            {activityStore.loadingInitial
                ? <Spinner content="Loading Activities" />
                : <Grid>
                    <Grid.Column width='10'>
                        <ActivityList />
                    </Grid.Column>
                    <Grid.Column width="6">
                        <ActivityFilters />
                    </Grid.Column>
                </Grid>
            }
        </>
    );
};

export default observer(ActivityDashboard);