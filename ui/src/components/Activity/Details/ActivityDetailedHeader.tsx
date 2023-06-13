import { observer } from 'mobx-react-lite';
import { Button, Header, Item, Segment, Image, Label } from 'semantic-ui-react'
import { Activity } from '../../../@types/Activity';
import { Link } from 'react-router-dom';
import { RouterPath } from '../../../utils/RouterPathConstant';
import { format } from "date-fns";
import { DateFormat } from '../../../@types/CommonUtils';
import { useStore } from '../../../store/Store';

const activityImageStyle = {
  filter: 'brightness(30%)'
};

const activityImageTextStyle = {
  position: 'absolute',
  bottom: '5%',
  left: '5%',
  width: '100%',
  height: 'auto',
  color: 'white'
};

interface Props {
  activity: Activity
}

const ActivityDetailedHeader = observer(({ activity }: Props) => {
  const { activityStore: { updateAttendence, loading, cancelActivityToggle } } = useStore();
  return (
    <Segment.Group>
      <Segment basic attached='top' style={{ padding: '0' }}>
        {activity.isCancelled &&
          <Label
            style={{ position: "absolute", zIndex: 1000, left: -14, top: 20 }}
            ribbon
            color="red"
            content="Cancelled" />
        }
        <Image src={`/assets/categoryImages/${activity.category}.jpg`} fluid style={activityImageStyle} />
        <Segment style={activityImageTextStyle} basic>
          <Item.Group>
            <Item>
              <Item.Content>
                <Header
                  size='huge'
                  content={activity.title}
                  style={{ color: 'white' }}
                />
                <p>{format(activity.date, DateFormat.DATE_ONLY)}</p>
                <p>
                  Hosted by <strong><Link to={`/${RouterPath.PROFILE}/${activity.host?.userName}`}>{activity.host?.displayName}</Link></strong>
                </p>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
      </Segment>
      <Segment clearing attached='bottom'>
        {!activity.isHost && (activity.isGoing
          ? <Button
            loading={loading}
            onClick={updateAttendence}>
            Cancel attendance
          </Button>
          : <Button
            disabled={activity.isCancelled}
            loading={loading}
            onClick={updateAttendence}
            color='teal'>
            Join Activity
          </Button>)
        }
        {activity.isHost &&
          <>
            <Button color={activity.isCancelled ? "green" : "red"}
              floated='left'
              basic
              content={activity.isCancelled ? "Re-active Activity" : "Cancel Activity"}
              onClick={cancelActivityToggle}
              loading={loading} />
            <Button
              disabled={activity.isCancelled}
              as={Link}
              to={`/${RouterPath.EDIT}/${activity.id}`}
              color='orange'
              floated='right'>
              Manage Event
            </Button>
          </>
        }
      </Segment>
    </Segment.Group>
  )
});

export default ActivityDetailedHeader;