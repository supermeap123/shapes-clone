export interface IProfile {
  nickname: string;
  description: string;
  avatar?: string;
  banner?: string;
  vanityUrl?: string;
  appearance?: string;
  initialMessage?: string;
  discordName?: string;
  bio?: string;
}

export interface IPersonality {
  traits: string[];
  tone: string;
  personalityTraits: string[];
  shortBackstory?: string;
  age?: number;
  history?: string;
  likes?: string;
  dislikes?: string;
  conversationalGoals?: string;
  conversationalExamples?: string;
}

export interface IFreeWill {
  levelOfFreeWill: 'strict' | 'semi-autonomous' | 'fully-autonomous';
  directMessages: boolean;
  temperature: number;
  numberOfMessages: number;
  favoriteReactions?: string[];
  favoritePeople?: string[];
  keywordsOfInterest?: string[];
  serverInstructions?: string;
  dmInstructions?: string;
}

export interface IAIEngine {
  primaryEngine: string;
  fallbackEngine?: string;
  freeWillEngine?: string;
  languagePresets?: string[];
  enginePresets?: string[];
  temperature?: number;
  topP?: number;
  maxResponseLength?: number;
  contextWindow?: number;
  memorySettings?: {
    shortTerm: boolean;
    longTerm: boolean;
    generation: boolean;
    recall: boolean;
    sharing: boolean;
  };
}

export interface IImageEngine {
  textCommandPrefix: string;
  engine: string;
  imageEngine?: string;
  imagePreset?: string;
  imageSizeOptions?: Array<{
    width: number;
    height: number;
    format: string;
  }>;
  preset?: string;
  sizes?: string[];
}

export interface IVoiceEngine {
  voiceResponses: boolean;
  engine?: string;
  style?: string;
  pitch?: number;
  speed?: number;
  stability?: number;
  similarity?: number;
}

export interface IKnowledge {
  generalKnowledge: string[];
  commands: Array<{
    name: string;
    response: string;
  }>;
}

export interface ITraining {
  conversationSnippets: string[];
}

export interface ISettings {
  shapeOwners: string[];
  privacySettings: {
    serverListVisibility: boolean;
    dmResponseSettings: {
      enabled: boolean;
      allowlist: string[];
      blocklist: string[];
    };
    ignoreList: string[];
  };
  customMessages: {
    wackMessage?: string;
    errorMessage?: string;
    sleepMessage?: string;
    serverJoinMessage?: string;
  };
}

export interface IShape {
  _id: string;
  profile: IProfile;
  personality: IPersonality;
  freeWill: IFreeWill;
  aiEngine: IAIEngine;
  imageEngine: IImageEngine;
  voiceEngine: IVoiceEngine;
  knowledge: IKnowledge;
  training: ITraining;
  settings: ISettings;
  owners: string[];
  createdAt: string;
  updatedAt: string;
}
