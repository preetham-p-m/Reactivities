import { observer } from "mobx-react-lite";
import { Image, List, Popup } from "semantic-ui-react";
import { Profile } from "../../../../@types/Profile";
import { Link } from "react-router-dom";
import { RouterPath } from "../../../../utils/RouterPathConstant";
import ProfileCard from "../ProfileCard/ProfileCard";

interface ActivityListItemAttendeeProps {
    attendees: Profile[]
}

const ActivityListItemAttendee = observer(({ attendees }: ActivityListItemAttendeeProps) => {
    return (
        <List horizontal>
            {attendees.map(attendee => (
                <Popup
                    hoverable
                    key={attendee.userName}
                    trigger={
                        <List.Item as={Link} to={`${RouterPath.PROFILE}/${attendee.userName}`} >
                            <Image size="mini" circular src={attendee.image || "/assets/user.png"} />
                        </List.Item>
                    }
                >
                    <Popup.Content>
                        <ProfileCard profile={attendee} />
                    </Popup.Content>
                </Popup>
            ))}
        </List>);
});

export default ActivityListItemAttendee;