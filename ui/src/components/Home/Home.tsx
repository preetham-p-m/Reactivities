import { Link } from "react-router-dom";
import { Button, Container, Header, Image, Segment } from "semantic-ui-react";
import { routerPath } from "../../utils/router/routerPath";
import { useStore } from "../../store/Store";
import { observer } from "mobx-react-lite";
import Login from "../Auth/Login/Login";
import Register from "../Auth/Register/Register";
import { assets } from "../../utils/constants/assets";

const Home = () => {
    const { authStore: userStore, modalStore } = useStore();

    return <Segment inverted textAlign="center" vertical className="masthead">
        <Container text>
            <Header as="h1" inverted>
                <Image size="massive" src={assets.LOGO} alt="logo" style={{ marginBottom: 12 }} />
                Reactivities
            </Header>
            {userStore.isLoggedIn
                ? <>
                    <Header as="h2" inverted content="Welcome to Reactivities" />
                    <Button as={Link} to={`/${routerPath.ACTIVITIES}`} size="huge" inverted>
                        Go to Activities
                    </Button>
                </>
                : <>
                    <Button onClick={() => modalStore.openModal(<Login />)} size="huge" inverted>
                        Login
                    </Button>
                    <Button onClick={() => modalStore.openModal(<Register />)} size="huge" inverted>
                        Register
                    </Button>
                </>
            }


        </Container>
    </Segment>;
};

export default observer(Home);