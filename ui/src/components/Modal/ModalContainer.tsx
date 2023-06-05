import { Modal } from "semantic-ui-react";
import { useStore } from "../../store/Store";
import { observer } from "mobx-react-lite";

const ModalContainer = observer(() => {
    const { modalStore } = useStore();

    return (
        <Modal open={modalStore.modal.open} onClose={modalStore.closeModal} size="mini">
            <Modal.Content>
                {modalStore.modal.body}
            </Modal.Content>
        </Modal>
    );
});

export default ModalContainer;