import { Message } from "semantic-ui-react";

interface props {
  errors: any;
}

const ValidationError = ({ errors }: props) => {
  return (
    <Message error>
      {errors && (
        <Message.List>
          {errors.map((err: string, i: any) => (
            <Message.Item key={i}>{err}</Message.Item>
          ))}
        </Message.List>
      )}
    </Message>
  );
};

export default ValidationError;