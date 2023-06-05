import { Button, Container, Dropdown, DropdownItem, DropdownMenu, Image, Menu } from "semantic-ui-react";
import { Link, NavLink } from "react-router-dom";
import { RouterPath } from "../../@types/RouterPath";
import { useStore } from "../../store/Store";
import { observer } from "mobx-react-lite";

const NavBar = observer(() => {
    const { userStore: { user, logout } } = useStore();
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
                <Menu.Item position="right">
                    <Image src={user?.image || './assets/user.png'} avatar spaced="right" />
                    <Dropdown pointing="top left" text={user?.displayName}>
                        <DropdownMenu>
                            <DropdownItem as={Link} to={`/${RouterPath.PROFILE}/${user?.userName}`} text="My Profile" icon="user" />
                            <DropdownItem onClick={logout} text="Logout" icon="power" />
                        </DropdownMenu>
                    </Dropdown>
                </Menu.Item>
            </Container>
        </Menu>
    );
});

export default NavBar;