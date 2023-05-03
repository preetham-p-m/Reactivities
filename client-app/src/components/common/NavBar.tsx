import { Button, Container, Menu } from "semantic-ui-react";
import { useStore } from "../../store/Store";

const NavBar = () => {
    const { activityStore } = useStore();
    
    return (
        <Menu inverted fixed="top">
            <Container>
                <Menu.Item header>
                    <img src="../../../assets/logo.png" alt="logo" style={{ marginRight: '10px' }} />
                    Reactivities
                </Menu.Item>
                <Menu.Item name="Activities" />
                <Menu.Item>
                    <Button positive onClick={() => activityStore.openForm()}>Create Activity</Button>
                </Menu.Item>
            </Container>
        </Menu>
    );
}

export default NavBar;