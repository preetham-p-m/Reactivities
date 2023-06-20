import { Link } from "react-router-dom";
import { Button, Header, Icon, Segment } from "semantic-ui-react";

const NotFound = () => {
  return (
    <Segment placeholder>
      <Header icon>
        <Icon name="search" />
        Oops - Unable to find what you are looking for!
      </Header>
      <Segment.Inline>
        <Button as={Link} to="/activities">
          Return to Activities Page
        </Button>
      </Segment.Inline>
    </Segment>
  );
};

export default NotFound;