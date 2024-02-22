import { Button, Container, Dropdown, DropdownItem, DropdownMenu, Image, Menu } from "semantic-ui-react";
import { Link, NavLink } from "react-router-dom";
import { routerPath } from "../../utils/router/routerPath";
import { useStore } from "../../store/Store";
import { observer } from "mobx-react-lite";
import { assets } from "../../utils/constants/assets";

const NavBar = () => {
    const { authStore: { user, logout } } = useStore();
    return (
        <Menu inverted fixed="top">
            <Container>
                <Menu.Item as={NavLink} to="/" header>
                    <img src={assets.LOGO} alt="logo" style={{ marginRight: '10px' }} /> Reactivities
                </Menu.Item>
                <Menu.Item as={NavLink} to={`/${routerPath.ACTIVITIES}`} name="Activities" />
                <Menu.Item>
                    <Button positive as={NavLink} to={`/${routerPath.CREATE_ACTIVITY}`}>Create Activity</Button>
                </Menu.Item>
                <Menu.Item position="right">
                    <Image src={user?.image ?? assets.USER} avatar spaced="right" />
                    <Dropdown pointing="top left" text={user?.displayName}>
                        <DropdownMenu>
                            <DropdownItem as={Link} to={`/${routerPath.PROFILE}/${user?.userName}`} text="My Profile" icon="user" />
                            <DropdownItem onClick={logout} text="Logout" icon="power" />
                        </DropdownMenu>
                    </Dropdown>
                </Menu.Item>
            </Container>
        </Menu>
    );
};

export default observer(NavBar);