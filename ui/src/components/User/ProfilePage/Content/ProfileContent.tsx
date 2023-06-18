import { observer } from "mobx-react-lite";
import { Tab } from "semantic-ui-react";
import ProfilePhotos from "./Photos/ProfilePhotos";

const ProfileContent = () => {
    const panes = [
        { menuItem: "About", render: () => <Tab.Pane>About</Tab.Pane> },
        { menuItem: "Photos", render: () => <ProfilePhotos /> },
        { menuItem: "Events", render: () => <Tab.Pane>Events Content</Tab.Pane> },
        { menuItem: "Followers", render: () => <Tab.Pane>Followers Content</Tab.Pane> },
        { menuItem: "Following", render: () => <Tab.Pane>Following Content</Tab.Pane> }
    ];
    return (
        <Tab
            panes={panes}
            menu={{ fluid: true, vertical: true }}
            menuPosition="right"
        />);
}

export default observer(ProfileContent);