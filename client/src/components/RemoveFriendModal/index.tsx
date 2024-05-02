// import { useState, FormEvent, useEffect } from "react";
import { useState } from "react";
import { useModal } from "../../context/Modal/Modal";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { User } from "../../interfaces/user";
import { removeFriend } from "../../store/session";
import { changeIsFriend } from "../../store/user";
import { unfriendUser } from "../../store/chatRoom";
import { useSocket } from "../../context/Socket";
import { UserDict } from "../../interfaces/socket";
import "./RemoveFriendModal.css";

function RemoveFriendModal({
  user,
  realtime,
  channelName,
}: {
  user: User | UserDict;
  realtime: boolean;
  channelName: string | undefined;
}) {
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string>("");
  const { closeModal } = useModal();
  const { socket } = useSocket();
  const sessionUser = useAppSelector((state) => state.session.user);

  const handleRemoveFriend = async () => {
    setError("");
    const actionResult = await dispatch(removeFriend(+user.id));
    if (removeFriend.fulfilled.match(actionResult) && !realtime) {
      dispatch(changeIsFriend());
      closeModal();
    } else if (
      removeFriend.fulfilled.match(actionResult) &&
      realtime &&
      channelName !== undefined
    ) {
      dispatch(unfriendUser());
      if (sessionUser) {
        socket?.emit("removed_friend", {
          userId: sessionUser.id,
          room: channelName,
        });
      }
      closeModal();
    } else {
      setError("There was a problem during your request");
    }
  };

  return (
    <div id="remove-friend-modal">
      <p>Are you sure you want to remove {user.username} as your friend?</p>
      {error && <p className="errors">{error}</p>}
      <div id="remove-friend-modal-buttons">
        <button id="remove-friend-modal-cancel-button" >Cancel</button>
        <button id="remove-friend-modal-confirm-button" onClick={handleRemoveFriend}>Remove Friend</button>
      </div>
    </div>
  );
}

export default RemoveFriendModal;
