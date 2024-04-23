export interface parsedData {
    problemName: string | undefined;
    problemPrompt: string | undefined;
    testCases: TestCase[] | undefined;
    pythonUnitTest: string | undefined;
    jsUnitTest: string | undefined;
    defaultPythonFn: string | undefined;
    defaultJsFn: string | undefined;
    channelName?: string | undefined
  }

  export interface TestCase {
    INPUT: string;
    OUTPUT: string;
  }
