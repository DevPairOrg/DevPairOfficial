export interface parsedData {
  problemName: string;
  problemPrompt: string;
  testCases: TestCase[];
  pythonUnitTest: string[];
  jsUnitTest: string[];
  defaultPythonFn: string;
  defaultJsFn: string;
  channelName?: string | undefined
}

export interface TestCase {
  INPUT: string;
  OUTPUT: string;
}
