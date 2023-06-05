import { Button, Container, Menu } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import { RouterPath } from "../../@types/RouterPath";

const NavBar = () => {
    return (
        <Menu inverted fixed="top">
            <Container>
                <Menu.Item as={NavLink} to="/" header>
                    <img src="../../../assets/logo.png" alt="logo" style={{ marginRight: '10px' }} />
                    Reactivities
                </Menu.Item>
                <Menu.Item as={NavLink} to={`/${RouterPath.ACTIVITIES}`} name="Activities" />
                <Menu.Item>
                    <Button positive as={NavLink} to={`/${RouterPath.CREATE_ACTIVITY}`}>Create Activity</Button>
                </Menu.Item>
            </Container>
        </Menu>
    );
}

export default NavBar;