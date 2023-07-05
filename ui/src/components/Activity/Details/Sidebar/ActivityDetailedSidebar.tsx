import React from 'react';
import { Segment, List, Label, Item, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { routerPath } from '../../../../utils/router/routerPath';
import { Activity } from '../../../../@types/Activity';

interface ActivityDetailedSidebarProps {
  activity: Activity;
}

const ActivityDetailedSidebar = ({ activity: { attendees, host } }: ActivityDetailedSidebarProps) => {
  return (
    <>
      {attendees &&
        <>
          <Segment
            textAlign='center'
            style={{ border: 'none' }}
            attached='top'
            secondary
            inverted
            color='teal'
          >
            {attendees.length} {attendees.length === 1 ? "Person" : "People"} going
          </Segment>
          <Segment attached>
            {attendees.map(attendee => (
              <List relaxed divided key={attendee.userName}>
                <Item style={{ position: 'relative' }}>
                  {attendee.userName === host?.userName &&
                    <Label
                      style={{ position: 'absolute' }}
                      color='orange'
                      ribbon='right'
                    >
                      Host
                    </Label>
                  }
                  <Image size='tiny' src={attendee.image || '/assets/user.png'} />
                  <Item.Content verticalAlign='middle'>
                    <Item.Header as='h3'>
                      <Link to={`${routerPath.PROFILE}/${attendee.userName}`}>{attendee.displayName}</Link>
                    </Item.Header>
                    {attendee.following &&
                      < Item.Extra style={{ color: 'orange' }}>Following</Item.Extra>
                    }
                  </Item.Content>
                </Item>

              </List>))}


          </Segment>
        </>}
    </>

  );
};

export default observer(ActivityDetailedSidebar);