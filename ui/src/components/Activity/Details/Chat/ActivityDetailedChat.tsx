import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Segment, Header, Comment, Loader } from 'semantic-ui-react';
import { useStore } from '../../../../store/Store';
import { Link } from 'react-router-dom';
import { routerPath } from '../../../../utils/router/routerPath';
import { Field, FieldProps, Form, Formik } from 'formik';
import * as Yup from "yup";
import { assets } from '../../../../utils/constants/assets';
import { formatDistanceToNow } from "date-fns";

interface ActivityDetailedChatProps {
  activityId: string;
}

const ActivityDetailedChat = ({ activityId }: ActivityDetailedChatProps) => {
  const { commentStore } = useStore();

  useEffect(() => {
    if (activityId) {
      commentStore.createHubConnection(activityId);
    }
    return () => {
      commentStore.clearComments();
    };
  }, [commentStore, activityId]);

  const validationSchema = Yup.object({ body: Yup.string().required("Comment cannot be empty") });

  return (
    <>
      <Segment
        textAlign='center'
        attached='top'
        inverted
        color='teal'
        style={{ border: 'none' }}
      >
        <Header>Chat about this event</Header>
      </Segment>
      <Segment attached clearing>
        <Formik
          onSubmit={(values, { resetForm }) => commentStore.addCommnet(values).then(() => resetForm())}
          initialValues={{ body: " " }}
          validationSchema={validationSchema}
        >
          {({ isSubmitting, isValid, handleSubmit, dirty }) => (
            <Form className='ui form'>
              <Field name="body">
                {(props: FieldProps) => (
                  <div style={{ position: "relative" }}>
                    <Loader active={isSubmitting} />
                    <textarea
                      placeholder='Enter the comment (Enter to submit, Shift + Enter for new line)'
                      rows={2}
                      {...props.field}
                      onKeyPress={e => {
                        if (e.key === "Enter" && e.shiftKey) {
                          return;
                        }
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (isValid && dirty) {
                            isValid && handleSubmit();
                          }
                        }
                      }}
                    />
                  </div>
                )}
              </Field>
            </Form>
          )}
        </Formik>
        <Comment.Group>
          {commentStore.comments.map((comment) => (
            <Comment key={comment.id}>
              <Comment.Avatar src={comment.image || assets.USER} />
              <Comment.Content>
                <Comment.Author as={Link} to={`/${routerPath.PROFILE}/${comment.userName}`}>{comment.displayName}</Comment.Author>
                <Comment.Metadata>
                  <div>{formatDistanceToNow(comment.createdAt)}</div>
                </Comment.Metadata>
                <Comment.Text style={{ whiteSpace: "pre-wrap" }}>{comment.body}</Comment.Text>
              </Comment.Content>
            </Comment>
          ))}
        </Comment.Group>
      </Segment >
    </>

  );
};

export default observer(ActivityDetailedChat);