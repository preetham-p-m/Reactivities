import { Link } from "react-router-dom";
import { Button, Icon, Item, Segment, SegmentGroup } from "semantic-ui-react";
import { Activity } from "../../../../@types/ActivityType";
import { RouterPath } from "../../../../@types/RouterPath";
import { format } from "date-fns";
import { DateFormat } from "../../../../@types/CommonUtils";

interface Props {
  activity: Activity
}

const ActivityListItem = ({ activity }: Props) => {
  return (
    <SegmentGroup>
      <Segment>
        <Item.Group>
          <Item>
            <Item.Image size="tiny" src="/assets/user.png" />
            <Item.Content >
              <Item.Header as={Link} to={`/activity/${activity.id}`}>{activity.title}</Item.Header>
              <Item.Description>Hosted by Bob</Item.Description>
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
      <Segment>
        <span>
          <Icon name="clock" /> {format(activity.date, DateFormat.STANDARD)}
          <Icon name="marker" /> {activity.venue}
        </span>
      </Segment>
      <Segment>
        Attendies go here
      </Segment>
      <Segment clearing>
        <span>
          {activity.description}
        </span>
        <Button as={Link} to={`/${RouterPath.ACTIVITIES}/${activity.id}`} color="teal" floated="right" content="View" />
      </Segment>
    </SegmentGroup>
  );
}

export default ActivityListItem;