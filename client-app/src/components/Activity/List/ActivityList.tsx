import { Grid, List } from "semantic-ui-react";
import { Activity } from "../../../@types/activity";
import { useEffect, useState } from "react";
import axios from "axios";

const ActivityList = () => {
    const [activities, setActivities] = useState<Activity[]>([]);

    useEffect(() => {
        axios.get<Activity[]>("http://localhost:5000/api/activities").then((response) => {
            setActivities(response.data);
        });
    }, []);

    return (
        <Grid>
            <Grid.Column width='10'>
                <List>
                    {activities.map((activity) => (
                        <List.Item key={activity.id}>{activity.title}</List.Item>
                    ))}
                </List>
            </Grid.Column>
        </Grid>
    );
}

export default ActivityList;