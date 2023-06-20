import { Dimmer, Loader } from "semantic-ui-react";

interface Props {
    inverted?: boolean;
    content?: string;
}

const Spinner = ({ inverted = true, content = "Loading app..." }: Props) => {
    return (<Dimmer active={true} inverted={true} >
        <Loader content={content} />
    </Dimmer>);
};

export default Spinner;