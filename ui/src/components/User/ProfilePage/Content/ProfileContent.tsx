import { observer } from "mobx-react-lite";
import { Tab } from "semantic-ui-react";
import ProfilePhotos from "./Photos/ProfilePhotos";
import ProfileFollow from "./Follow/ProfileFollow";
import { useStore } from "../../../../store/Store";

const ProfileContent = () => {
    const { userProfileStore: { setActiveTab } } = useStore();
    const panes = [
        { menuItem: "About", render: () => <Tab.Pane>About</Tab.Pane> },
        { menuItem: "Photos", render: () => <ProfilePhotos /> },
        { menuItem: "Events", render: () => <Tab.Pane>Events Content</Tab.Pane> },
        { menuItem: "Followers", render: () => <ProfileFollow /> },
        { menuItem: "Following", render: () => <ProfileFollow /> }
    ];
    return (
        <Tab
            panes={panes}
            menu={{ fluid: true, vertical: true }}
            menuPosition="right"
            onTabChange={(e, data) => setActiveTab(data.activeIndex)}
        />);
};

export default observer(ProfileContent);