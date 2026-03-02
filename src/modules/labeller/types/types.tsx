// 1. The Data to be labeled (e.g., an image URL)
export interface ITask {
  id: string;
  data: {
    image?: string;
    text?: string;
  };
}

// 2. The Project Rules 
export interface IProjectConfig {
  xmlConfig: string; // The Label Studio XML (e.g., <View><Image.../></View>)
  title: string;
}

// 3. The Result (What the user submits)
export interface ILabelResult {
  taskId: string;
  annotations: any[]; // The output from Label Studio
}