// import React from "react";
// import { Modal, Button } from "react-bootstrap";

// function ViewTaskModal({ showModal, closeModal, selectedTask, getUserStatus }) {
//   return (
//     <Modal show={showModal} onHide={closeModal}>
//       <Modal.Header closeButton>
//         <Modal.Title>View Task</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <p>Description: {selectedTask && selectedTask.description}</p>
//         <h5>Checklist:</h5>
//         {selectedTask &&
//           selectedTask.assignees.map((assigneeId, i) => (
//             <div key={i}>
//               <h6>User: {assigneeId}</h6>
//               {selectedTask.checklist.map((item, j) => (
//                 <div key={j}>
//                   {item.text} -{" "}
//                   {getUserStatus(item, assigneeId) || "Not Started"}
//                 </div>
//               ))}
//             </div>
//           ))}
//       </Modal.Body>
//       <Modal.Footer>
//         <Button variant="secondary" onClick={closeModal}>
//           Close
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );
// }

// export default ViewTaskModal;
import React from "react";
import { Modal, Button } from "react-bootstrap";

function ViewTaskModal({ show, onHide, selectedTask }) {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>View Task</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Description: {selectedTask.description}</p>
        <h5>Checklist:</h5>
        {selectedTask.checklist.map((item, index) => (
          <div key={index}>
            {item.text} - {item.status || "Not started"}
          </div>
        ))}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ViewTaskModal;
