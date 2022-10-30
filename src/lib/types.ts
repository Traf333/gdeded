export interface IScenario {
  id: string;
  title: string;
  description: string;
  roles: string[];
  active: boolean;
}

export interface ISpeech {
  id: string;
  text: string;
  audio_url: string;
}
