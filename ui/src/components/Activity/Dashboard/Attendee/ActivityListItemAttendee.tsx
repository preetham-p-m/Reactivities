import { observer } from 'mobx-react-lite';
import { Image, List, Popup } from 'semantic-ui-react';
import { User } from '../../../../@types/User';
import { Link } from 'react-router-dom';
import { routerPath } from '../../../../utils/router/routerPath';
import ProfileCard from '../../../User/ProfileCard/ProfileCard';
import { assets } from '../../../../utils/constants/assets';

interface ActivityListItemAttendeeProps {
    attendees: User[];
}

const ActivityListItemAttendee = ({ attendees }: ActivityListItemAttendeeProps) => {
    const styles = { borderColor: 'orange', borderWidth: 2 };

    return (
        <List horizontal>
            {attendees.map(attendee => (
                <Popup
                    hoverable
                    key={attendee.userName}
                    trigger={
                        <List.Item as={Link} to={`/${routerPath.PROFILE}/${attendee.userName}`}>
                            <Image
                                size='mini'
                                circular
                                src={attendee.image ?? assets.USER}
                                bordered
                                style={attendee.following ? styles : null}
                            />
                        </List.Item>
                    }
                >
                    <Popup.Content>
                        <ProfileCard user={attendee} />
                    </Popup.Content>
                </Popup>
            ))}
        </List>
    );
};

export default observer(ActivityListItemAttendee);
