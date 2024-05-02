import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { RootState } from "../../store";
import "./targetUserSocials.css";
import "./index.css";
import Footer from "../Footer/Footer";
import EditUserPage from "./editProfile";
import PreviewProfile from "./PreviewProfile";
import Statistics from "./Statistics";
import {
  acceptFriendRequest,
  cancelFriendRequest,
  rejectFriendRequest,
  sendFriendRequest,
} from "../../store/session";
import {
  changeAwaitingRequest,
  changeIsFriend,
  changePendingRequest,
  getUser,
} from "../../store/user";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import RemoveFriendModal from "../RemoveFriendModal";
import { toast, ToastContainer } from "react-toastify";

function UserPage() {
  const { userId } = useParams();
  const dispatch = useAppDispatch();
  const [action, setAction] = useState<number>(0);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [isCurrentUserProfile, setIsCurrentProfile] = useState<boolean>(false);
  const sessionUser = useAppSelector((state: RootState) => state.session.user);
  const user = useAppSelector((state: RootState) => state.user.data);

  const friends = useAppSelector(
    (state: RootState) => state.session.user?.friends
  );
  const sentRequests = useAppSelector(
    (state: RootState) => state.session.user?.sentRequests
  );
  const receivedRequests = useAppSelector(
    (state: RootState) => state.session.user?.receivedRequests
  );

  useEffect(() => {
    if (userId && sessionUser && +sessionUser.id === +userId) {
      setIsCurrentProfile(true);
    } else {
      if (userId && !user) {
        dispatch(getUser(+userId));
      }
    }
  }, [userId]);

  const handleRequest = async (Id: number, action: string) => {
    let actionResult;

    switch (action) {
      case "accept":
        actionResult = await dispatch(acceptFriendRequest(Id));
        if (
          !isCurrentUserProfile &&
          acceptFriendRequest.fulfilled.match(actionResult)
        ) {
          dispatch(changeIsFriend());
          dispatch(changePendingRequest());
        }
        break;
      case "cancel":
        actionResult = await dispatch(cancelFriendRequest(Id));
        if (
          !isCurrentUserProfile &&
          cancelFriendRequest.fulfilled.match(actionResult)
        ) {
          dispatch(changeAwaitingRequest());

        }

        break;
      case "reject":
        actionResult = await dispatch(rejectFriendRequest(Id));
        if (!isCurrentUserProfile && rejectFriendRequest.fulfilled.match(actionResult)) {
          dispatch(changePendingRequest());
        }
        break;
      case "send":
        actionResult = await dispatch(sendFriendRequest(Id));
        if (sendFriendRequest.fulfilled.match(actionResult)) {
          dispatch(changeAwaitingRequest());
        }
        break;
      default:
        break;
    }
  };


  const notifyWIP = () => toast.info('This page is currently a WIP build.', {
    position: "bottom-left",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "dark",
    });

  return (
    <>
      {isCurrentUserProfile && sessionUser ? (
            <div className="user-dash-main-content">

              <div className="user-dash-navigation">
                  <div
                    onClick={() => setAction(0)}
                    style={{background: `${action === 0 ? '' : 'linear-gradient(to bottom, #171717 80%, rgb(14, 14, 14, 1) 100%)'}`}}
                  >
                    <p style={{color: `${action === 0 ? '#20CC09' : 'white'}`}}>Dashboard</p>
                  </div>
                  <div
                    onClick={() => {
                      setAction(1)
                      notifyWIP()
                      setEditMode(false)
                    }}
                    style={{background: `${action === 1 ? '' : 'linear-gradient(to bottom, #171717 80%, rgb(14, 14, 14, 1) 100%)'}`}}
                  >
                    <p style={{color: `${action === 1 ? '#20CC09' : 'white'}`}}>Profile</p>
                  </div>
                  <div
                    onClick={() => {
                      notifyWIP()
                      setAction(2)
                    }}
                    style={{background: `${action === 2 ? '' : 'linear-gradient(to bottom, #171717 80%, rgb(14, 14, 14, 1) 100%)'}`}}
                  >
                    <p style={{color: `${action === 2 ? '#20CC09' : 'white'}`}}>Statistics</p>
                  </div>
              </div>

              <div id="user-profile-content-container">
                {action === 0 && (
                    <div className="container2">
                      <div className="container_terminal"></div>

                      <a href="/code-collab">
                        <div className="terminal_toolbar">
                          <div className="butt2">
                            <button className="btn btn-color"></button>
                            <button className="btn"></button>
                            <button className="btn"></button>
                          </div>
                          <p className="user">
                            {sessionUser.username}@admin: ~
                          </p>
                        </div>

                        <div className="terminal_body">
                          <div>
                            <div className="terminal_promt">
                              <span className="terminal_user">
                                {sessionUser.username}@admin:
                              </span>
                              <span className="terminal_location">~</span>
                              <span className="terminal_bling">
                                $ Welcome back, {sessionUser.username}!
                              </span>
                            </div>
                            <div className="terminal_promt">
                              <span className="terminal_user">
                                {sessionUser.username}@admin:
                              </span>
                              <span className="terminal_location">~</span>
                              <span className="terminal_bling">
                                $ Start Pairing by clicking this terminal
                              </span>
                              <span className="terminal_cursor"></span>
                            </div>
                          </div>
                        </div>
                      </a>
                    </div>
                )}
                {action === 1 && editMode ? (
                  <EditUserPage setEditMode={setEditMode} />
                ) : (
                  action == 1 &&
                  !editMode && <PreviewProfile setEditMode={setEditMode} />
                )}
                {action === 2 && (
                  <Statistics />
                )}
              </div>
            </div>
      ) : (
        //!!! RENDER OTHER USER'S PROFILE !!!
        <>
          <main id="target-profile-main">
            <div id="target-profile-container">
              <div id="targetuser-profile-split">
                <div id="user-profile-content">
                  {user && (
                    <>
                      <div id="targetuser-info-container">
                        <div id="targetuser-pfp">
                          <img
                            src={
                              user.picUrl
                                ? user.picUrl
                                : "https://img.freepik.com/premium-vector/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg?w=740"
                            }
                            alt="targetuser-pfp"
                          ></img>
                        </div>
                        <div id="targetuser-info">
                          <span>{user.username}</span>
                          <span>Joined July 2022</span>
                          <span>{user?.friends?.length ?? 0} Friends</span>
                          <div className="profile-buttons-container">
                            <button
                              className="profile-buttons"
                              onClick={() => alert("Feature coming soon!")}
                            >
                              Direct Message
                            </button>
                            {user.isFriend ? (
                              <OpenModalButton
                                className="profile-buttons"
                                buttonText="Remove Friend"
                                modalComponent={
                                  <RemoveFriendModal user={user} realtime={false} channelName={undefined} />
                                }
                              />
                            ) : user.awaitingRequest ? (
                              <>
                                <p>Friend Request Sent...</p>
                                <button
                                  className="profile-buttons"
                                  onClick={() =>
                                    handleRequest(+user.id, "cancel")
                                  }
                                >
                                  Cancel
                                </button>
                              </>
                            ) : user.pendingRequest ? (
                              <>
                                <button
                                  className="profile-buttons"
                                  onClick={() =>
                                    handleRequest(+user.id, "accept")
                                  }
                                >
                                  Accept
                                </button>
                                <button
                                  className="profile-buttons"
                                  onClick={() =>
                                    handleRequest(+user.id, "reject")
                                  }
                                >
                                  Reject
                                </button>
                              </>
                            ) : (
                              <button
                                className="profile-buttons"
                                onClick={() => handleRequest(+user.id, "send")}
                              >
                                Send Friend Request
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      <div id="target-user-about">
                        <h3>About Me: </h3>
                        <p>
                          {user.about
                            ? user.about
                            : "This is a default description about me."}
                        </p>
                      </div>
                      <div id="target-user-socials-container">
                        <div className="target-user-socials">
                          <div className="up">
                            {/* linkedin */}
                            <button
                              className="card1"
                              onClick={() => {
                                if (!user.linkedin) {
                                  alert("No link provided.");
                                } else {
                                  window.open(
                                    user.linkedin,
                                    "_blank",
                                    "noopener,noreferrer"
                                  );
                                }
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 256 256"
                                width="30"
                                height="30"
                                fillRule="nonzero"
                                className="linkedin-2"
                              >
                                <g
                                  fillRule="nonzero"
                                  stroke="none"
                                  strokeWidth="1"
                                  strokeLinecap="butt"
                                  strokeLinejoin="miter"
                                  strokeMiterlimit="10"
                                  strokeDasharray=""
                                  strokeDashoffset="0"
                                  fontFamily="none"
                                  fontWeight="none"
                                  fontSize="none"
                                  textAnchor="none"
                                  style={{ mixBlendMode: "normal" }}
                                >
                                  <g transform="scale(6,6)">
                                    <path
                                      fill="#0288D1"
                                      d="M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5V37z"
                                    ></path>
                                    <path
                                      fill="#FFF"
                                      d="M12 19H17V36H12zM14.485 17h-.028C12.965 17 12 15.888 12 14.499 12 13.08 12.995 12 14.514 12c1.521 0 2.458 1.08 2.486 2.499C17 15.887 16.035 17 14.485 17zM36 36h-5v-9.099c0-2.198-1.225-3.698-3.192-3.698-1.501 0-2.313 1.012-2.707 1.99C24.957 25.543 25 26.511 25 27v9h-5V19h5v2.616C25.721 20.5 26.85 19 29.738 19c3.578 0 6.261 2.25 6.261 7.274L36 36 36 36z"
                                    ></path>
                                  </g>
                                </g>
                              </svg>
                            </button>
                            {/* Porfolio */}
                            <button
                              className="card2"
                              onClick={() => {
                                if (!user.portfolio) {
                                  alert("No link provided.");
                                } else {
                                  window.open(
                                    user.portfolio,
                                    "_blank",
                                    "noopener,noreferrer"
                                  );
                                }
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                x="0px"
                                y="0px"
                                width="30"
                                height="30"
                                viewBox="0 0 48 48"
                                className="portfolio"
                              >
                                <path
                                  fill="url(#g5dniRY~PPjSqIO9PSW_ia_NTa3xp2XGiRy_gr1)"
                                  d="M28.5,6h-9C18.672,6,18,6.672,18,7.5V9h12V7.5C30,6.672,29.328,6,28.5,6z"
                                ></path>
                                <radialGradient
                                  id="g5dniRY~PPjSqIO9PSW_ib_NTa3xp2XGiRy_gr2"
                                  cx="23.832"
                                  cy="5.992"
                                  r="45.74"
                                  gradientTransform="matrix(1 0 0 .8044 0 1.172)"
                                  gradientUnits="userSpaceOnUse"
                                >
                                  <stop offset="0" stopColor="#40150b"></stop>
                                  <stop
                                    offset=".156"
                                    stopColor="#622110"
                                  ></stop>
                                  <stop
                                    offset=".417"
                                    stopColor="#953218"
                                  ></stop>
                                  <stop
                                    offset=".645"
                                    stopColor="#ba3f1e"
                                  ></stop>
                                  <stop
                                    offset=".828"
                                    stopColor="#d14722"
                                  ></stop>
                                  <stop
                                    offset=".944"
                                    stopColor="#d94a23"
                                  ></stop>
                                </radialGradient>
                                <path
                                  fill="url(#g5dniRY~PPjSqIO9PSW_ib_NTa3xp2XGiRy_gr2)"
                                  d="M42,41H6c-1.1,0-2-0.9-2-2V13c0-2.2,1.8-4,4-4h32c2.2,0,4,1.8,4,4v26C44,40.1,43.1,41,42,41z"
                                ></path>
                                <linearGradient
                                  id="g5dniRY~PPjSqIO9PSW_ic_NTa3xp2XGiRy_gr3"
                                  x1="24"
                                  x2="24"
                                  y1="9.028"
                                  y2="26.927"
                                  gradientUnits="userSpaceOnUse"
                                >
                                  <stop offset="0" stopColor="#fc7d5b"></stop>
                                  <stop offset=".06" stopColor="#f8734f"></stop>
                                  <stop offset=".18" stopColor="#f3653d"></stop>
                                  <stop
                                    offset=".326"
                                    stopColor="#f05b31"
                                  ></stop>
                                  <stop
                                    offset=".523"
                                    stopColor="#ee552a"
                                  ></stop>
                                  <stop offset="1" stopColor="#ed5328"></stop>
                                </linearGradient>
                                <path
                                  fill="url(#g5dniRY~PPjSqIO9PSW_ic_NTa3xp2XGiRy_gr3)"
                                  d="M42.297,25.255L24,28L5.703,25.255C4.724,25.109,4,24.268,4,23.278V13c0-2.2,1.8-4,4-4h32	c2.2,0,4,1.8,4,4v10.278C44,24.268,43.276,25.109,42.297,25.255z"
                                ></path>
                                <path
                                  fill="#f6eca5"
                                  d="M25.5,21h-3c-0.276,0-0.5,0.224-0.5,0.5v3c0,0.276,0.224,0.5,0.5,0.5h3c0.276,0,0.5-0.224,0.5-0.5v-3	C26,21.224,25.776,21,25.5,21z"
                                ></path>
                              </svg>
                            </button>
                          </div>
                          <div className="down">
                            {/* Github */}
                            <button
                              className="card3"
                              onClick={() => {
                                if (!user.github) {
                                  alert("No link provided.");
                                } else {
                                  window.open(
                                    user.github,
                                    "_blank",
                                    "noopener,noreferrer"
                                  );
                                }
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 30 30"
                                width="30px"
                                height="30px"
                                className="github-2"
                              >
                                <path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"></path>
                              </svg>
                            </button>
                            {/* leetcode */}
                            <button
                              className="card4"
                              onClick={() => {
                                if (!user.leetcode) {
                                  alert("No link provided.");
                                } else {
                                  window.open(
                                    user.leetcode,
                                    "_blank",
                                    "noopener,noreferrer"
                                  );
                                }
                              }}
                            >
                              <svg
                                height="30px"
                                width="30px"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                                className="leetcode"
                                id="leetcode"
                              >
                                <path
                                  fill="#B3B1B0"
                                  d="M22 14.355c0-.742-.564-1.346-1.26-1.346H10.676c-.696 0-1.26.604-1.26 1.346s.563 1.346 1.26 1.346H20.74c.696.001 1.26-.603 1.26-1.346z"
                                ></path>
                                <path
                                  fill="#E7A41F"
                                  d="m3.482 18.187 4.313 4.361c.973.979 2.318 1.452 3.803 1.452 1.485 0 2.83-.512 3.805-1.494l2.588-2.637c.51-.514.492-1.365-.039-1.9-.531-.535-1.375-.553-1.884-.039l-2.676 2.607c-.462.467-1.102.662-1.809.662s-1.346-.195-1.81-.662l-4.298-4.363c-.463-.467-.696-1.15-.696-1.863 0-.713.233-1.357.696-1.824l4.285-4.38c.463-.467 1.116-.645 1.822-.645s1.346.195 1.809.662l2.676 2.606c.51.515 1.354.497 1.885-.038.531-.536.549-1.387.039-1.901l-2.588-2.636a4.994 4.994 0 0 0-2.392-1.33l-.034-.007 2.447-2.503c.512-.514.494-1.366-.037-1.901-.531-.535-1.376-.552-1.887-.038l-10.018 10.1C2.509 11.458 2 12.813 2 14.311c0 1.498.509 2.896 1.482 3.876z"
                                ></path>
                                <path
                                  fill="#070706"
                                  d="M8.115 22.814a2.109 2.109 0 0 1-.474-.361c-1.327-1.333-2.66-2.66-3.984-3.997-1.989-2.008-2.302-4.937-.786-7.32a6 6 0 0 1 .839-1.004L13.333.489c.625-.626 1.498-.652 2.079-.067.56.563.527 1.455-.078 2.066-.769.776-1.539 1.55-2.309 2.325-.041.122-.14.2-.225.287-.863.876-1.75 1.729-2.601 2.618-.111.116-.262.186-.372.305-1.423 1.423-2.863 2.83-4.266 4.272-1.135 1.167-1.097 2.938.068 4.127 1.308 1.336 2.639 2.65 3.961 3.974.067.067.136.132.204.198.468.303.474 1.25.183 1.671-.321.465-.74.75-1.333.728-.199-.006-.363-.086-.529-.179z"
                                ></path>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div id="targetuser-friends-container">
                  <div id="targetuser-following">
                    <div id="targetuser-following-container">
                      <h2>Friends</h2>
                      <div className="hr-line-primary"></div>
                      <div className="follow-scroll">
                        {user &&
                          user.friends &&
                          user.friends.length > 0 &&
                          user.friends.map((friend, i) => {
                            return (
                              <>
                                <a href={`/users/${friend.id}`}>
                                  <div
                                    key={friend.username + i}
                                    id="following-container"
                                  >
                                    <div id="follower-image-container">
                                      <img
                                        src={
                                          friend.picUrl
                                            ? friend.picUrl
                                            : "https://img.freepik.com/premium-vector/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg?w=740"
                                        }
                                        alt="followed-user-pic"
                                      />
                                    </div>
                                    <div id="friends-username">
                                      {friend.username}
                                    </div>
                                  </div>
                                </a>
                              </>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
          <Footer />
        </>
      )}

    <ToastContainer
      position="bottom-left"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      />
    </>
  );
}

export default UserPage;
