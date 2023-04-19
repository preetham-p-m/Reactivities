import { Button, Card, Image } from "semantic-ui-react";
import { Activity } from "../../../@types/activity";

interface Props {
    activity: Activity,
    cancelSelectActivity: () => void,
    openForm: (id: string) => void,
};

const ActivityDetails = ({ activity, cancelSelectActivity, openForm }: Props) => {
    return (
        <Card fluid>
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
                    <Button basic color="blue" content="Edit" onClick={() => openForm(activity.id)} />
                    <Button basic color="grey" content="Cancel" onClick={cancelSelectActivity} />
                </Button.Group>
            </Card.Content>
        </Card>
    );
}

export default ActivityDetails;