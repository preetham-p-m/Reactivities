import { observer } from "mobx-react-lite";
import { User } from "../../../@types/User";
import { Card, Icon, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { routerPath } from "../../../utils/router/routerPath";
import { assets } from "../../../utils/constants/assets";
import FollowButton from "../FollowButton/FollowButton";

interface ProfileCardProps {
    user: User;
}

const ProfileCard = ({ user }: ProfileCardProps) => {
    return (
        <Card as={Link} to={`/${routerPath.PROFILE}/${user.userName}`}>
            <Image src={user.image || assets.USER} />
            <Card.Content>
                <Card.Header>{user.displayName}</Card.Header>
                <Card.Description>Bio goes here</Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Icon name="user" />
                {user.followersCount} {user.followersCount <= 1 ? "follower" : "followers"}
            </Card.Content>
            <FollowButton user={user} />
        </Card>
    );
};

export default observer(ProfileCard);