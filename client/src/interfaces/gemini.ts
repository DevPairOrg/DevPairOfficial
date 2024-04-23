export interface parsedData {
  problemName: string;
  problemPrompt: string;
  testCases: TestCase[];
  pythonUnitTest: string[];
  jsUnitTest: string[];
  defaultPythonFn: string;
  defaultJsFn: string;
}

export interface TestCase {
  INPUT: string;
  OUTPUT: string;
}
