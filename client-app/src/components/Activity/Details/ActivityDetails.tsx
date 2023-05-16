import { Button, Card, Image } from "semantic-ui-react";
import { useStore } from "../../../store/Store";
import Spinner from "../../common/Spinner";
import { observer } from "mobx-react-lite";
import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";

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
            : <Card fluid >
                <Image src={`/assets/categoryImages/${activity.category}.jpg`} />
                <Card.Content>
                    <Card.Header>
                        {activity.title}
                    </Card.Header>
                    <Card.Meta>
                        <span>{activity.date}</span>
                    </Card.Meta>
                    <Card.Description>
                        {activity.description}
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <Button.Group>
                        <Button as={Link} to={`/activity/edit/${activity.id}`} basic color="blue" content="Edit" />
                        <Button as={Link} to="/activities" basic color="grey" content="Cancel" />
                    </Button.Group>
                </Card.Content>
            </Card >
    );
})

export default ActivityDetails;