import { Message } from "semantic-ui-react";

interface props {
  errors: string[]
}

const ValidationError = ({ errors }: props) => {
  return (
    <Message error>
      {errors && (
        <Message.List>
          {errors.map((err: string, i) => (
            <Message.Item key={i}>{err}</Message.Item>
          ))}
        </Message.List>
      )}
    </Message>
  );
}

export default ValidationError;