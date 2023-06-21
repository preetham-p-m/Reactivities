import { observer } from "mobx-react-lite";
import { Image, List, Popup } from "semantic-ui-react";
import { Profile } from "../../../../@types/Profile";
import { Link } from "react-router-dom";
import { routerPath } from "../../../../utils/router/routerPath";
import ProfileCard from "../../../User/ProfileCard/ProfileCard";
import { assets } from "../../../../utils/constants/assets";

interface ActivityListItemAttendeeProps {
    attendees: Profile[];
}

const ActivityListItemAttendee = ({ attendees }: ActivityListItemAttendeeProps) => {
    return (
        <List horizontal>
            {attendees.map(attendee => (
                <Popup
                    hoverable
                    key={attendee.userName}
                    trigger={
                        <List.Item as={Link} to={`${routerPath.PROFILE}/${attendee.userName}`} >
                            <Image size="mini" circular src={attendee.image || assets.USER} />
                        </List.Item>
                    }
                >
                    <Popup.Content>
                        <ProfileCard profile={attendee} />
                    </Popup.Content>
                </Popup>
            ))}
        </List>);
};

export default observer(ActivityListItemAttendee);