import { useState } from "react";
import ShareScreenComponent from "../../AgoraManager/screenShare";
import config from "../../AgoraManager/config";
import { fetchRTCToken } from "../../utility/fetchRTCToken";
import { useEffect } from "react";
import {
  RemoteVideoTrack,
  useClientEvent,
  useRTCClient,
  useRemoteUsers,
  useRemoteVideoTracks,
} from "agora-rtc-react";
import { useAppSelector } from "../../hooks";
import RemoteAndLocalVolumeComponent from "../../AgoraManager/volumeControl";
import shareScreenPlaceholder from "../../assets/images/share-screen-holder.webp";
import IDE from "../CodeMirror";

interface parsedData {
  problemPrompt: string;
  unitTest: string;
  testCases: string;
}

function ScreenShare(props: { channelName: string }) {
  const { channelName } = props;
  const [screenSharing, setScreenSharing] = useState<boolean>(false);
  const [isRemoteScreen, setIsRemoteScreen] = useState<boolean>(false);
  const [geminiProblem, setGeminiProblem] = useState<string>("");
  const [generatedProblem, setGeneratedProblem] = useState<boolean>(false);
  const [parsedResponse, setParsedResponse] = useState<parsedData>();
  const remoteUsers = useRemoteUsers();
  const agoraEngine = useRTCClient();

  useRemoteVideoTracks(remoteUsers);
  const pairInfo = useAppSelector((state) => state.pairedUser.user);
  // console.log(remoteUsers);

  useEffect(() => {
    const fetchTokenFunction = async () => {
      if (config.serverUrl !== "" && channelName !== "") {
        try {
          const token = (await fetchRTCToken(channelName)) as string;
          config.rtcToken = token;
          config.channelName = channelName;
        } catch (error) {
          console.error(error);
        }
      } else {
        console.log(
          "Please make sure you specified the token server URL in the configuration file"
        );
      }
    };

    fetchTokenFunction();

    // console.log(
    //   "😎screenSharing😎: ",
    //   screenSharing ? screenSharing : screenSharing
    // );
  }, [channelName, screenSharing]);

  useClientEvent(agoraEngine, "user-left", (user) => {
    if (user.uid === pairInfo?.screenUid) {
      setIsRemoteScreen(false);
    }
    // console.log(
    //   "🦄🦄🦄🦄🦄🦄🦄🦄🦄 The user",
    //   user.uid,
    //   " has left the channel"
    // );
  });

  useClientEvent(agoraEngine, "user-published", (user, _) => {
    if (user.uid === pairInfo?.screenUid) {
      setIsRemoteScreen(true);
    }
  });

  //? GEMINI
  const handleGeminiRequest = async () => {
    const res = await fetch("/api/gemini/");

    if (res.ok) {
      const data = await res.json();
      setGeminiProblem(data.geminiResponse);
      setGeneratedProblem(true);
      const parsedData = parseCode(data.geminiResponse);
      setParsedResponse(parsedData);
    } else {
      console.log("Failed to generate a problem through Gemini API.");
    }
  };

  function parseCode(code: string) {
    // const lines = code.split("\n");
    const lines = code.split("\n").map((line) => line.replace(/```/g, ""));
    let problemPrompt = "";
    let testCases = "";
    let unitTest = "";
    let unitTestLine = -1; // Initialize to -1 to signal missing header

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // TEST CASES
      if (line === "TEST CASES:") {
        testCases = lines.slice(i, i + 7).join("\n");
      }

      // UNIT TEST - FOR TESTING USER SOLUTIONS
      if (line === "UNIT TESTING:") {
        unitTestLine = i + 1; // Point to the line after the header
        unitTest = lines.slice(i + 1).join("\n");
        problemPrompt = lines.slice(1, 2).join("\n");
        break;
      }
    }

    if (unitTestLine === -1) {
      // Handle missing header
      problemPrompt = lines.join("\n"); // Assign entire code as prompt
    }
    console.log("🥶🥵🥶🥵🥶unitTest from function", unitTest);
    return { problemPrompt, unitTest, testCases };
  }

  // If User starts screen share with the button, it will trigger an event asking them what screen they will share and render it
  const renderContent = () => {
    if (screenSharing === true) {
      return (
        <>
          <ShareScreenComponent
            setScreenSharing={setScreenSharing}
            isRemoteScreen={isRemoteScreen}
          />
        </>
      );
    } else if (
      !screenSharing &&
      !isRemoteScreen &&
      generatedProblem === false
    ) {
      return (
        <div id="share-screen-placeholder">
          <div id="share-or-generate-problem-container">
            <div>Share your screen or </div>
            <button onClick={handleGeminiRequest}>Generate a problem!</button>
          </div>
          <img
            src={shareScreenPlaceholder}
            alt="Cats waiting for a user to share their screen"
            className="share-screen-cats"
          />
        </div>
      );
    } else if (generatedProblem === true) {
      return (
        <>
          <div id="ide-main-container">
            <IDE
              problemPrompt={parsedResponse?.problemPrompt}
              problemTestCases={parsedResponse?.testCases}
              problemUnitTest={parsedResponse?.unitTest}
            />
          </div>
        </>
      );
    } else {
      return null;
    }
  };

  return (
    <>
      {remoteUsers.map((remoteUser) => {
        if (remoteUser.uid === pairInfo?.screenUid) {
          return (
            <RemoteVideoTrack
              track={remoteUser.videoTrack}
              className="screen-share"
              style={{
                width: "100%",
                height: "108",
                objectFit: "contain",
              }}
              key={remoteUser.uid}
              play
            />
          );
        } else {
          return null;
        }
      })}

      {/* RENDER OPTIONS TO SHARE SCREEN OR GENERATE LEET CODE PROBLEM, OR SCREEN SHARE, OR LEETCODE PROBLEM */}
      {renderContent()}

      <RemoteAndLocalVolumeComponent
        screenSharing={screenSharing}
        setScreenSharing={setScreenSharing}
      />
    </>
  );
}
export default ScreenShare;
