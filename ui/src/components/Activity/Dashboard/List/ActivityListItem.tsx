import { Link } from "react-router-dom";
import { Button, Icon, Item, Label, Segment, SegmentGroup } from "semantic-ui-react";
import { Activity } from "../../../../@types/Activity";
import { routerPath } from "../../../../utils/router/routerPath";
import { format } from "date-fns";
import { DateFormat } from "../../../../@types/CommonUtils";
import ActivityListItemAttendee from "../Attendee/ActivityListItemAttendee";
import { assets } from "../../../../utils/constants/assets";

interface Props {
  activity: Activity;
}

const ActivityListItem = ({ activity }: Props) => {
  return (
    <SegmentGroup>
      <Segment>
        {activity.isCancelled && <Label attached="top" color="red" content="Cancelled" style={{ textAlign: "center" }} />}
        <Item.Group>
          <Item>
            <Item.Image style={{ marginBottom: 5 }} size="tiny" circular src={activity.host?.image || assets.USER} />
            <Item.Content >
              <Item.Header as={Link} to={`/${routerPath.ACTIVITIES}/${activity.id}`}>{activity.title}</Item.Header>
              <Item.Description>Hosted by <Link to={`/${routerPath.PROFILE}/${activity.host?.userName}`}>{activity.host?.displayName}</Link></Item.Description>
              {activity.isHost && (
                <Item.Description>
                  <Label basic color="orange">You are hosting the activity</Label>
                </Item.Description>
              )}
              {activity.isGoing && !activity.isHost && (
                <Item.Description>
                  <Label basic color="green">You are going the activity</Label>
                </Item.Description>
              )}
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
        <ActivityListItemAttendee attendees={activity.attendees!} />
      </Segment>
      <Segment clearing>
        <span>
          {activity.description}
        </span>
        <Button as={Link} to={`/${routerPath.ACTIVITIES}/${activity.id}`} color="teal" floated="right" content="View" />
      </Segment>
    </SegmentGroup>
  );
};

export default ActivityListItem;