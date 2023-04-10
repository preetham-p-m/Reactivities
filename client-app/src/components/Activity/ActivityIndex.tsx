import { useEffect, useState } from "react";
import { Activity } from "../../@types/activity";
import { Header, List } from "semantic-ui-react";
import axios from "axios";

const ActivityIndex = () => {
    const [activities, setActivities] = useState<Activity[]>([]);

    useEffect(() => {
        axios.get<Activity[]>("http://localhost:5000/api/activities").then((response) => {
            setActivities(response.data);
        });
    }, []);

    return (
        <div>
            <Header as="h2" icon="users" content="Reactivities" />
            <List>
                {activities.map((activity) => (
                    <List.Item key={activity.id}>{activity.title}</List.Item>
                ))}
            </List>
        </div>
    );
}
 
export default ActivityIndex;