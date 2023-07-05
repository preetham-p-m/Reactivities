import { Divider, Grid, Header, Item, Segment, Statistic } from "semantic-ui-react";
import { assets } from "../../../../utils/constants/assets";
import { User } from "../../../../@types/User";
import { observer } from "mobx-react-lite";
import FollowButton from "../../FollowButton/FollowButton";

interface ProfileHeaderProps {
    user: User;
}

const ProfileHeader = ({ user }: ProfileHeaderProps) => {
    return (
        <Segment>
            <Grid>
                <Grid.Column width={12}>
                    <Item.Group>
                        <Item>
                            <Item.Image avatar size="small" src={user.image || assets.USER} />
                            <Item.Content verticalAlign="middle">
                                <Header as="h1" content={user.displayName} />
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Grid.Column>
                <Grid.Column width={4}>
                    <Statistic.Group widths={2}>
                        <Statistic label={user.followersCount <= 1 ? "Follower" : "Followers"} value={user.followersCount} />
                        <Statistic label="Following" value={user.followingCount} />
                    </Statistic.Group>
                    <Divider />
                    <FollowButton user={user} />
                </Grid.Column>
            </Grid>
        </Segment>
    );
};

export default observer(ProfileHeader);