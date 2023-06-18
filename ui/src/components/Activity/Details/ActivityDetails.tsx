import { Grid } from "semantic-ui-react";
import { useStore } from "../../../store/Store";
import Spinner from "../../Common/Spinner";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import ActivityDetailedHeader from "./Header/ActivityDetailedHeader";
import ActivityDetailedChat from "./Chat/ActivityDetailedChat";
import ActivityDetailedInfo from "./Info/ActivityDetailedInfo";
import ActivityDetailedSidebar from "./Sidebar/ActivityDetailedSidebar";

const ActivityDetails = observer(() => {
    const { activityStore } = useStore();
    const { selectedActivity: activity, loadActivity, loadingInitial } = activityStore;
    const { id } = useParams();

    useEffect(() => {
        if (id) loadActivity(id);
    }, [id, loadActivity]);

    return (
        (!activity || loadingInitial)
            ? <Spinner />
            : <Grid>
                <Grid.Column width={10}>
                    <ActivityDetailedHeader activity={activity} />
                    <ActivityDetailedInfo activity={activity} />
                    <ActivityDetailedChat />
                </Grid.Column>
                <Grid.Column width={6}>
                    <ActivityDetailedSidebar activity={activity} />
                </Grid.Column>
            </Grid>
    );
})

export default ActivityDetails;