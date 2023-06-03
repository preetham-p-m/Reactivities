import { observer } from "mobx-react-lite";
import { useStore } from "../../../store/Store";
import { Button, Container, Header, Icon, Segment } from "semantic-ui-react";
import { Link } from "react-router-dom";

const ServerError = observer(() => {
  const { commonStore } = useStore();
  return (
    <Container>
      <Segment placeholder>
        <Header as="h3" icon>
          <Icon name="server" />
          {commonStore.error?.message}
        </Header>
        <Segment.Inline>
          <Button as={Link} to="/activities">
            Return to Activities Page
          </Button>
        </Segment.Inline>
      </Segment>
      {commonStore.error?.details && (
        <Segment>
          <Header as={"h4"} content="Stack Trace" color="teal" />
          <code style={{ marginTop: "10px" }}>{commonStore.error.details}</code>
        </Segment>
      )}
    </Container>
  );
});

export default ServerError;
