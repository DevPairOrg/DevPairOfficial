// import { useState, FormEvent, useEffect } from "react";
import { useState } from "react";
import { useModal } from "../../../context/Modal/Modal";
import { useAppDispatch } from "../../../hooks";
import { User } from "../../../interfaces/user";
import { removeFriend } from "../../../store/session";
import { changeIsFriend } from "../../../store/user";

function RemoveFriendModal({ user }: { user: User }) {
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string>("");
  const { closeModal } = useModal();
  // const sessionUser = useAppSelector((state) => state.session.user);

  const handleRemoveFriend = async () => {
    setError("")
    const actionResult = await dispatch(removeFriend(+user.id));
    if (removeFriend.fulfilled.match(actionResult)) {
      dispatch(changeIsFriend());
      closeModal();
    } else {
      setError("There was a problem during your request")
    }
  };

  return (
    <>
      <p>Are you sure you want to remove {user.username} as your friend?</p>
      <button>Cancel</button>
      <button onClick={handleRemoveFriend}>Remove Friend</button>
    </>
  );
}

export default RemoveFriendModal;
