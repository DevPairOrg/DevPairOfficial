import { useEffect, useState } from "react";
import {
  LocalVideoTrack,
  RemoteUser,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRemoteUsers,
  ICameraVideoTrack,
} from "agora-rtc-react";
import config from "../../../AgoraManager/config";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import {
  acceptFriendRequest,
  cancelFriendRequest,
  friendRemoved,
  receiveRequest,
  rejectFriendRequest,
  requestAccepted,
  requestCancelled,
  requestRejected,
  sendFriendRequest,
} from "../../../store/session";
import userWaiting from "../../../assets/images/user-waiting.svg";
import "./VideoCams.css";
import {
  acceptFriend,
  cancelRequest,
  rejectFriend,
  sentRequest,
  unfriendUser,
} from "../../../store/chatRoom";
import { useSocket } from "../../../context/Socket";
import RemoveFriendModal from "../../RemoveFriendModal";
import OpenModalButton from "../../OpenModalButton/OpenModalButton";
import { useAgoraContext } from "../../../AgoraManager/agoraManager";

function VideoCams(props: { channelName: string }) {
    const { setLocalCameraTrack, setLocalMicrophoneTrack } = useAgoraContext();
  const user = useAppSelector((state) => state.session.user);
  const pairInfo = useAppSelector((state) => state.chatRoom.user);
  const { channelName } = props;
  const [myCameraTrack, setMyCameraTrack] = useState<
    ICameraVideoTrack | undefined
  >(undefined);
  const { socket, connectSocket } = useSocket();
  const sessionUser = useAppSelector((state) => state.session.user);

  const { isLoading: isLoadingMic, localMicrophoneTrack } =
    useLocalMicrophoneTrack();
  const { isLoading: isLoadingCam, localCameraTrack } = useLocalCameraTrack();

  const remoteUsers = useRemoteUsers();
  // const [isFollowed, setIsFollowed] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  useJoin({
    appid: config.appId,
    channel: channelName,
    token: config.rtcToken,
    uid: user?.videoUid,
  });

  useEffect(() => {
    if (!socket) {
      connectSocket();
    }
  }, [socket, connectSocket]);

    useEffect(() => {
        // Setup cleanup to close tracks when the component unmounts
        return () => {
            localCameraTrack?.close();
            localMicrophoneTrack?.close();
        };
    }, []);

    useEffect(() => {
        if (localCameraTrack && localMicrophoneTrack) {
            localMicrophoneTrack.setMuted(true);
            setMyCameraTrack(localCameraTrack);
            setLocalCameraTrack(localCameraTrack);
            setLocalMicrophoneTrack(localMicrophoneTrack);
        }
    }, [localCameraTrack, localMicrophoneTrack]);

  usePublish([localMicrophoneTrack, localCameraTrack]);

  const deviceLoading = isLoadingMic || isLoadingCam;

  useEffect(() => {
    if (socket) {
      if (!socket.hasListeners("friend_removed")) {
        socket.on("friend_removed", (data) => {
          console.log("Friend removed event received", data);
          // Dispatch action to update the friend status in the state
          dispatch(friendRemoved(+data.userId));
          dispatch(unfriendUser());
        });
      }

      if (!socket.hasListeners("friend_added")) {
        socket.on("friend_added", (data) => {
          dispatch(
            requestAccepted({ friend: data.friend, requestId: data.requestId })
          );
        });
      }

      if (!socket.hasListeners("friend_rejected")) {
        socket.on("friend_rejected", (data) => {
          dispatch(requestRejected(data.requestId));
          dispatch(cancelRequest());
        });
      }

      if (!socket.hasListeners("cancelled_request")) {
        socket.on("cancelled_request", (data) => {
          dispatch(requestCancelled(data.requestId));
          dispatch(cancelRequest());
        });
      }

      if (!socket.hasListeners("received_request")) {
        socket.on("received_request", (data) => {
          console.log("Received request event received", data);
          // Dispatch action to update the friend status in the state
          dispatch(receiveRequest(data.request));

        });
      }

      return () => {
        socket.off("friend_removed");
        socket.off("friend_added");
        socket.off("friend_rejected");
        socket.off("cancelled_request");
      };
    }
  }, [dispatch, socket]);

  // Needs refactoring to Friends
  const handleVideoFriendRequest = async (action: string) => {
    let actionResult;

    switch (action) {
      case "accept":
        if (sessionUser && sessionUser.receivedRequests) {
          const id = Object.entries(sessionUser.receivedRequests).find(
            ([_key, value]) => value.id === pairInfo?.id
          )?.[0];
          if (id !== undefined) {
            actionResult = await dispatch(acceptFriendRequest(+id));
            if (acceptFriendRequest.fulfilled.match(actionResult)) {
              dispatch(acceptFriend());
              socket?.emit("accepted_request", {
                userId: +sessionUser.id,
                room: channelName,
                requestId: +id,
              });
            }
          }
        }
        break;
      case "reject":
        if (sessionUser && sessionUser.receivedRequests) {
          const id = Object.entries(sessionUser.receivedRequests).find(
            ([_key, value]) => value.id === pairInfo?.id
          )?.[0];
          if (id !== undefined) {
            actionResult = await dispatch(rejectFriendRequest(+id));
            if (rejectFriendRequest.fulfilled.match(actionResult)) {
              dispatch(rejectFriend());
              socket?.emit("rejected_request", {
                requestId: +id,
                room: channelName,
              });
            }
          }
        }
        break;
      case "cancel":
        if (sessionUser && sessionUser.sentRequests) {
          const id = Object.entries(sessionUser.sentRequests).find(
            ([_key, value]) => value.id === pairInfo?.id
          )?.[0];
          if (id !== undefined) {
            actionResult = await dispatch(cancelFriendRequest(+id));
            if (cancelFriendRequest.fulfilled.match(actionResult)) {
              dispatch(cancelRequest());
              socket?.emit("request_canceled", {
                requestId: +id,
                room: channelName,
              });
            }
          }
        }
        break;
      case "send":
        if (pairInfo) {
          actionResult = await dispatch(sendFriendRequest(+pairInfo.id));
          if (sendFriendRequest.fulfilled.match(actionResult)) {
            const requestData = actionResult.payload;
            const requestId = Object.keys(requestData)[0]; // Get the request ID
            console.log("Friend request sent🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬 ", requestData);
            dispatch(sentRequest());
            socket?.emit("sent_request", {requestId: +requestId, room: channelName})
          }
        }
        break;
      default:
        break;
    }
  };

  return (
    <>
      <div className="video-wrapper">
        <div id="video-container">
          {deviceLoading ? (
            <div className="videos" style={{ height: 300, width: 300 }}>
              Loading Devices...
            </div>
          ) : (
            <div className="videos" style={{ height: 300, width: 300 }}>
              <p className="video-username">{user?.username}</p>
              <LocalVideoTrack track={myCameraTrack} play={true} />
            </div>
          )}
          {remoteUsers.length > 0 &&
          remoteUsers.find((user) => user.uid === pairInfo?.videoUid) ? (
            remoteUsers.map((remoteUser) => {
              if (remoteUser.uid === pairInfo?.videoUid) {
                return (
                  <div
                    className="videos"
                    style={{ height: 300, width: 300 }}
                    key={remoteUser.uid}
                  >
                    <p className="video-username">{pairInfo.username}</p>
                    <RemoteUser
                      user={remoteUser}
                      playVideo={true}
                      playAudio={true}
                    />
                    {pairInfo.isFriend ? (
                      <OpenModalButton
                        className="follow-user"
                        buttonText="Remove Friend"
                        modalComponent={
                          <RemoveFriendModal
                            user={pairInfo}
                            realtime={true}
                            channelName={channelName}
                          />
                        }
                      />
                    ) : pairInfo.isPending ? (
                      <>
                        <button
                          className="follow-user"
                          onClick={() => handleVideoFriendRequest("accept")}
                        >
                          Accept
                        </button>
                        <button
                          className="follow-user"
                          onClick={() => handleVideoFriendRequest("reject")}
                        >
                          Reject
                        </button>
                      </>
                    ) : pairInfo.isAwaiting ? (
                      <button
                        className="follow-user"
                        onClick={() => handleVideoFriendRequest("cancel")}
                      >
                        Cancel Request
                      </button>
                    ) : (
                      <button
                        className="follow-user"
                        onClick={() => handleVideoFriendRequest("send")}
                      >
                        Add Friend
                      </button>
                    )}
                  </div>
                );
              }
            })
          ) : (
            <>
              <div
                className="videos cat-waiting"
                style={{ height: 300, width: 300 }}
              >
                <img
                  src={userWaiting}
                  alt="Cat informing we are waiting for a user to join"
                />
                <p>Waiting for user...</p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default VideoCams;
