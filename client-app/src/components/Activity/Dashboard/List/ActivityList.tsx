import { Header } from "semantic-ui-react";
import { useStore } from "../../../../store/Store";
import { observer } from "mobx-react-lite";
import ActivityListItem from "./ActivityListItem";
import { Fragment } from "react";

const ActivityList = observer(() => {
    const { activityStore } = useStore();
    const { getGroupedActivities } = activityStore;

    return (
        <>
            {getGroupedActivities.map(([group, activites]) => (
                <Fragment key={group}>
                    <Header sub color={"teal"}>
                        {group}
                    </Header>
                    {activites.map(activity => (
                        <ActivityListItem key={activity.id} activity={activity} />
                    ))}
                </Fragment>
            ))}
        </>

    );
});

export default ActivityList;
