import { AxiosResponse } from "axios";
import { Message } from "semantic-ui-react";

interface IProps {
  error: AxiosResponse;
  text?: string;
}

const ErrorMessage: React.FC<IProps> = ({ error, text }) => {
  return (
    <Message error>
      <Message.Header>{error.statusText}</Message.Header>
      {error.data && Object.keys(error.data.errors).length > 0 && (
        <Message.List>
          {/* Index will act as the key */}
          {Object.values(error.data.errors).flat().map((err: any, i) => (
            <Message.Item key={i}>{err}</Message.Item>
          ))}
        </Message.List> 
        // This will show the errors in a list instead of a strinigify way
      )}
      {text && <Message.Content content={text} />}
    </Message>
  );
};

export default ErrorMessage;
