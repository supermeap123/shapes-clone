export interface IProfile {
  avatar?: string;
  banner?: string;
  vanityUrl?: string;
  nickname?: string;
  description?: string;
  appearance?: string;
  initialMessage?: string;
  discordName?: string;
  bio?: string;
}

export interface IPersonality {
  nickname?: string;
  shortBackstory?: string;
  responseType?: string;
  personalityTraits?: string[];
  tone?: string;
  age?: number;
  history?: string;
  likes?: string;
  dislikes?: string;
  conversationalGoals?: string;
  conversationalExamples?: string;
}

export interface IFreeWill {
  levelOfFreeWill?: 'strict' | 'semi-autonomous' | 'fully autonomous';
  directMessages?: boolean;
  reactions?: {
    enabled: boolean;
    favorites: string[];
  };
  favoritePeople?: string[];
  keywordsOfInterest?: string[];
  serverInstructions?: string;
  dmInstructions?: string;
  aiModel?: string;
  temperature?: number;
  numberOfMessages?: number;
}

export interface IKnowledge {
  generalKnowledge?: string[];
  commands?: Array<{
    name: string;
    response: string;
  }>;
  relationships?: Array<{
    userId: string;
    type: string;
    notes: string;
  }>;
}

export interface ITraining {
  conversationSnippets?: string[];
}

export interface IAIEngine {
  primaryEngine?: string;
  fallbackEngine?: string;
  freeWillEngine?: string;
  languagePresets?: string[];
  enginePresets?: string[];
  temperature?: number;
  topP?: number;
  maxResponseLength?: number;
  contextWindow?: number;
  memorySettings?: {
    shortTermEnabled: boolean;
    longTermEnabled: boolean;
    memoryGeneration: boolean;
    memoryRecall: boolean;
    memorySharing: boolean;
  };
}

export interface IImageEngine {
  textCommandPrefix?: string;
  imageEngine?: string;
  imagePreset?: string;
  imageSizeOptions?: Array<{
    width: number;
    height: number;
    format: string;
  }>;
}

export interface IVoiceEngine {
  voiceResponses?: boolean;
}

export interface ISettings {
  shapeOwners?: string[];
  slashCommands?: Array<{
    name: string;
    enabled: boolean;
  }>;
  privacySettings?: {
    serverListVisibility: boolean;
    dmResponseSettings: {
      enabled: boolean;
      allowlist: string[];
      blocklist: string[];
    };
    ignoreList: string[];
  };
  customMessages?: {
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
  knowledge: IKnowledge;
  training: ITraining;
  aiEngine: IAIEngine;
  imageEngine: IImageEngine;
  voiceEngine: IVoiceEngine;
  settings: ISettings;
  createdAt: string;
  updatedAt: string;
}
