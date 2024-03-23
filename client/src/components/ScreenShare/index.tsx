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
import { python } from "@codemirror/lang-python";

interface parsedData {
  problemPrompt: string;
  testCases: string;
  pythonUnitTest: string;
  jsUnitTest: string;
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
    const lines = code.split("\n");
    let problemPrompt = "";
    let emptyFunctionPython = "";
    let emptyFunctionJs = "";
    let testCases = "";
    let pythonUnitTest = "";
    let jsUnitTest = "";
    let isPythonSection = false;
    let isJsSection = false;
    let isTestCaseSection = false;
    let isEmptyFunctionSection = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Problem Prompt
      if (line.startsWith("QUESTION PROMPT:")) {
        problemPrompt = lines[i + 1].trim();
      }

      // Start of Empty Functions Section
      if (line === "EMPTY FUNCTION:") {
        isEmptyFunctionSection = true;
        continue;
      }

      // Start of Test Cases Section
      if (line === "TEST CASES:") {
        isTestCaseSection = true;
        continue;
      }

      // End of Test Cases Section and start of Python Unit Testing
      if (line === "PYTHON UNIT TESTING:") {
        isTestCaseSection = false;
        isPythonSection = true;
        continue; // Skip the heading line
      }

      // Handling for JavaScript Unit Testing section
      if (line === "JAVASCRIPT UNIT TESTING:") {
        isJsSection = true;
        isPythonSection = false; // Ensure Python section is disabled
        continue; // Skip the heading line
      }

      // Accumulate Empty Functions
      if (isEmptyFunctionSection) {
        if (line.includes("def")) {
          // Python function
          emptyFunctionPython += lines[i] + "\n";
        } else if (line.includes("function")) {
          // JavaScript function
          emptyFunctionJs += lines[i] + "\n";
        }
      }

      // Accumulate Test Cases
      if (isTestCaseSection) {
        testCases += lines[i] + "\n";
      }

      // Accumulate Python Unit Test
      if (isPythonSection) {
        pythonUnitTest += lines[i] + "\n";
      }

      // Accumulate JavaScript Unit Test
      if (isJsSection) {
        jsUnitTest += lines[i] + "\n";
      }
    }

    // Trim the final strings to remove unnecessary new lines
    problemPrompt = problemPrompt.trim();
    testCases = testCases.trim();
    pythonUnitTest = pythonUnitTest.trim();
    jsUnitTest = jsUnitTest.trim();

    console.log("prompt\n", problemPrompt);
    console.log("Empty Python Function\n", emptyFunctionPython);
    console.log("Empty JavaScript Function\n", emptyFunctionJs);
    console.log("test cases\n", testCases);
    console.log("python unit test\n", pythonUnitTest);
    console.log("js unit test\n", jsUnitTest);

    return {
      problemPrompt,
      emptyFunctionPython,
      emptyFunctionJs,
      testCases,
      pythonUnitTest,
      jsUnitTest,
    };
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
              prompt={parsedResponse?.problemPrompt}
              testCases={parsedResponse?.testCases}
              pythonUnitTest={parsedResponse?.pythonUnitTest}
              jsUnitTest={parsedResponse?.jsUnitTest}
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
