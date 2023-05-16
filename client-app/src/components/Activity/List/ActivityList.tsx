import { useState } from "react";
import { Button, Item, Label, Segment } from "semantic-ui-react";
import { useStore } from "../../../store/Store";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";

const ActivityList = observer(() => {
    const [target, setTarget] = useState('');

    const { activityStore } = useStore();
    const { activitiesByDate, deleteActivity, loading } = activityStore;

    const handleActivityDelete = (e: any, id: string) => {
        setTarget(e.currentTarget.name);
        deleteActivity(id);
    }

    return (
        <Segment>
            <Item.Group>
                {activitiesByDate.map(activity => (
                    <Item key={activity.id}>
                        <Item.Content>
                            <Item.Header as='a'>{activity.title}</Item.Header>
                            <Item.Meta>{activity.date}</Item.Meta>
                            <Item.Description>
                                <div>{activity.description}</div>
                                <div>{activity.city}</div>
                            </Item.Description>
                            <Item.Extra>
                                <Button as={Link} to={`/activity/${activity.id}`} floated="right" content="View" color="blue" />
                                <Button
                                    name={activity.id}
                                    loading={loading && target === activity.id}
                                    onClick={(e) => handleActivityDelete(e, activity.id)}
                                    floated="right"
                                    content="Delete"
                                    color="red" />
                                <Label basic content={activity.category} />
                            </Item.Extra>
                        </Item.Content>
                    </Item>
                ))}
            </Item.Group>
        </Segment>
    );
});

export default ActivityList;
