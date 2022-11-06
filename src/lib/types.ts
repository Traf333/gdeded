export interface IScenario {
  _id: string;
  title: string;
  description: string;
  roles: string[];
  active: boolean;
}

export interface ISpeech {
  _id: string;
  text: string;
  audio_url: string;
}
