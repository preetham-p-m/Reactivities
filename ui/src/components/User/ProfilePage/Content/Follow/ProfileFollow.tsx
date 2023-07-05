import { Card, Grid, Header, Tab } from "semantic-ui-react";
import { useStore } from "../../../../../store/Store";
import ProfileCard from "../../../ProfileCard/ProfileCard";
import { observer } from "mobx-react-lite";

const ProfileFollow = () => {
    const { userProfileStore: { user, followings, loadingFollowings, activeTab } } = useStore();

    return (
        <Tab.Pane loading={loadingFollowings}>
            <Grid>
                <Grid.Column width={16}>
                    <Header
                        floated="left"
                        icon="user"
                        content={activeTab === 3? `People following ${user!.displayName}`: `People ${user!.displayName} is following`}
                    />
                </Grid.Column>
                <Grid.Column width={16}>
                    <Card.Group itemsPerRow={4}>
                        {followings.map(user => (
                            <ProfileCard key={user.userName} user={user} />
                        ))}
                    </Card.Group>
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    );
};

export default observer(ProfileFollow);