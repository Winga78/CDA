import ParticipantModal from "../components/ModalAddParticipants"
import { useParams } from 'react-router-dom';
import { useState} from "react";

const ChatPage =() => {
    const { id } = useParams();
    console.log(id)
    const [showModalAddParticipant, setShowModalAddParticipant] = useState(false);
 
      const handleShowModalAddParticipant = () => setShowModalAddParticipant(true);
      const handleCloseModalAddParticipant = () => setShowModalAddParticipant(false);
    
    return (<div className="d-flex justify-content-center mt-4">
    <div className="border p-4 rounded shadow-sm">
      <button
        type="button"
        className="btn btn-outline-dark rounded-pill px-4 py-2 fw-semibold"
        onClick={handleShowModalAddParticipant}
      >
        Nouveau
      </button>
      <ParticipantModal
         project_id={id}
         show={showModalAddParticipant}
         handleClose={handleCloseModalAddParticipant}
        />
    </div>
  </div>);

}

export default ChatPage;