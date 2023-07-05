import { Grid } from "semantic-ui-react";
import ProfileHeader from "./Header/ProfileHeader";
import ProfileContent from "./Content/ProfileContent";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { useStore } from "../../../store/Store";
import { useEffect } from "react";
import Spinner from "../../Common/Spinner";

const ProfilePage = () => {
    const { username } = useParams<{ username: string; }>();
    const { userProfileStore: { loadProfile, loadingProfile, user, setActiveTab } } = useStore();

    useEffect(() => {
        if (username) {
            loadProfile(username);
        }
        return () => {
            setActiveTab(0);
        };
    }, [username, loadProfile, setActiveTab]);

    return (
        <>
            {loadingProfile
                ? <Spinner content="Loading Profile..." />
                : <Grid>
                    <Grid.Column width={16}>
                        {user && <>
                            <ProfileHeader user={user} />
                            <ProfileContent />
                        </>}
                    </Grid.Column>
                </Grid>
            }
        </>
    );
};

export default observer(ProfilePage);