import { Reveal, Button } from "semantic-ui-react";
import { User } from "../../../@types/User";
import { useStore } from "../../../store/Store";
import { SyntheticEvent } from "react";
import { observer } from "mobx-react-lite";

interface FollowButtonProps {
    user: User;
};


const FollowButton = ({ user }: FollowButtonProps) => {
    const { userProfileStore: { updateFollowing, loading }, authStore } = useStore();

    if (authStore.user?.userName === user.userName) return null;

    const handleFollow = (e: SyntheticEvent, userName: string) => {
        e.preventDefault();
        user.following ? updateFollowing(userName, false) : updateFollowing(userName, true);
    };

    return (
        <Reveal animated="move">
            <Reveal.Content visible style={{ width: "100%" }}>
                <Button
                    fluid
                    color="teal"
                    content={user.following ? "Following" : "Not Following"}/>
            </Reveal.Content>
            <Reveal.Content
                hidden
                style={{ width: "100%" }}>
                <Button
                    fluid
                    basic
                    color={user.following ? "red" : "green"}
                    content={user.following ? "Unfollow" : "Follow"}
                    loading={loading}
                    onClick={(e) => handleFollow(e, user.userName)}
                />
            </Reveal.Content>
        </Reveal>
    );
};

export default observer(FollowButton);