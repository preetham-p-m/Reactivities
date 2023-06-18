import { observer } from "mobx-react-lite";
import { Profile } from "../../../@types/Profile";
import { Card, Icon, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { routerPath } from "../../../utils/router/routerPath";
import { assets } from "../../../utils/constants/assets";

interface ProfileCardProps {
    profile: Profile;
}

const ProfileCard = observer(({ profile }: ProfileCardProps) => {
    return (
        <Card as={Link} to={`/${routerPath.PROFILE}/${profile.userName}`}>
            <Image src={profile.image || assets.USER} />
            <Card.Content>
                <Card.Header>{profile.displayName}</Card.Header>
                <Card.Description>Bio goes here</Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Icon name="user" />
                20 followers
            </Card.Content>
        </Card>
    );
})

export default ProfileCard;