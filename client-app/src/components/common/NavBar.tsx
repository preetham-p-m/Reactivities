import { Button, Container, Menu } from "semantic-ui-react";
import { NavLink } from "react-router-dom";

const NavBar = () => {
    return (
        <Menu inverted fixed="top">
            <Container>
                <Menu.Item as={NavLink} to="/" header>
                    <img src="../../../assets/logo.png" alt="logo" style={{ marginRight: '10px' }} />
                    Reactivities
                </Menu.Item>
                <Menu.Item as={NavLink} to="/activities" name="Activities" />
                <Menu.Item>
                    <Button positive as={NavLink} to="/create-activity">Create Activity</Button>
                </Menu.Item>
            </Container>
        </Menu>
    );
}

export default NavBar;