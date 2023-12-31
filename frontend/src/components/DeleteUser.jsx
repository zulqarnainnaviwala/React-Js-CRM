import React, { useState } from "react";
import { Trash } from "react-bootstrap-icons";
import Button from "react-bootstrap/Button";
import DeleteConfirmation from "./DeleteConfirmation";
import { useDispatch } from "react-redux";
import { deleteUser } from "../app/reducers/userSlice.js";

const DeleteUser = ({ user }) => {
  const dispatch = useDispatch();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = async () => {
    await dispatch(deleteUser(user._id));
    setShowDeleteModal(false);
  };

  return (
    <span>
      <Button
        variant="link"
        className="symbol-button"
        onClick={() => setShowDeleteModal(true)}
      >
        <Trash />
      </Button>
      <DeleteConfirmation
        showModal={showDeleteModal}
        hideModal={() => setShowDeleteModal(false)}
        confirmModal={handleDelete}
        id={user._id}
        type="user"
        message="Are you sure you want to delete this user?"
      />
    </span>
  );
};

export default DeleteUser;
