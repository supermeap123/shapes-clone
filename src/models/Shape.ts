import mongoose, { Schema, Document } from 'mongoose';
import { IShape, IProfile, IPersonality, IFreeWill, IKnowledge, ITraining, IAIEngine, IImageEngine, IVoiceEngine, ISettings } from '../types/shape';

const profileSchema = new Schema<IProfile>({
  avatar: { type: String, default: null },
  banner: { type: String, default: null },
  vanityUrl: { type: String, default: null },
  nickname: { type: String, default: null },
  description: { type: String, default: null },
  appearance: { type: String, default: null },
  initialMessage: { type: String, default: null },
  discordName: { type: String, default: null },
  bio: { type: String, default: null }
});

const personalitySchema = new Schema<IPersonality>({
  nickname: { type: String, default: null },
  shortBackstory: { type: String, default: null },
  responseType: { type: String, default: null },
  personalityTraits: { type: [String], default: [] },
  tone: { type: String, default: null },
  age: { type: Number, default: null },
  history: { type: String, default: null },
  likes: { type: String, default: null },
  dislikes: { type: String, default: null },
  conversationalGoals: { type: String, default: null },
  conversationalExamples: { type: String, default: null }
});

const freeWillSchema = new Schema<IFreeWill>({
  levelOfFreeWill: {
    type: String,
    enum: ['strict', 'semi-autonomous', 'fully autonomous'],
    default: 'semi-autonomous'
  },
  directMessages: { type: Boolean, default: false },
  reactions: {
    enabled: { type: Boolean, default: false },
    favorites: { type: [String], default: [] }
  },
  favoritePeople: { type: [String], default: [] },
  keywordsOfInterest: { type: [String], default: [] },
  serverInstructions: { type: String, default: null },
  dmInstructions: { type: String, default: null },
  aiModel: { type: String, default: null },
  temperature: { type: Number, default: 0.7 },
  numberOfMessages: { type: Number, default: 1 }
});

const knowledgeSchema = new Schema<IKnowledge>({
  generalKnowledge: { type: [String], default: [] },
  commands: {
    type: [{
      name: String,
      response: String
    }],
    default: []
  },
  relationships: {
    type: [{
      userId: String,
      type: String,
      notes: String
    }],
    default: []
  }
});

const trainingSchema = new Schema<ITraining>({
  conversationSnippets: { type: [String], default: [] }
});

const memorySettingsSchema = new Schema({
  shortTermEnabled: { type: Boolean, default: true },
  longTermEnabled: { type: Boolean, default: true },
  memoryGeneration: { type: Boolean, default: true },
  memoryRecall: { type: Boolean, default: true },
  memorySharing: { type: Boolean, default: false }
});

const aiEngineSchema = new Schema<IAIEngine>({
  primaryEngine: { type: String, default: null },
  fallbackEngine: { type: String, default: null },
  freeWillEngine: { type: String, default: null },
  languagePresets: { type: [String], default: [] },
  enginePresets: { type: [String], default: [] },
  temperature: { type: Number, default: 0.7 },
  topP: { type: Number, default: 1 },
  maxResponseLength: { type: Number, default: 2000 },
  contextWindow: { type: Number, default: 4000 },
  memorySettings: { type: memorySettingsSchema, default: () => ({}) }
});

const imageSizeOptionsSchema = new Schema({
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  format: { type: String, required: true }
});

const imageEngineSchema = new Schema<IImageEngine>({
  textCommandPrefix: { type: String, default: '!imagine' },
  imageEngine: { type: String, default: null },
  imagePreset: { type: String, default: null },
  imageSizeOptions: { type: [imageSizeOptionsSchema], default: [] }
});

const voiceEngineSchema = new Schema<IVoiceEngine>({
  voiceResponses: { type: Boolean, default: false }
});

const privacySettingsSchema = new Schema({
  serverListVisibility: { type: Boolean, default: true },
  dmResponseSettings: {
    enabled: { type: Boolean, default: true },
    allowlist: { type: [String], default: [] },
    blocklist: { type: [String], default: [] }
  },
  ignoreList: { type: [String], default: [] }
});

const customMessagesSchema = new Schema({
  wackMessage: { type: String, default: null },
  errorMessage: { type: String, default: null },
  sleepMessage: { type: String, default: null },
  serverJoinMessage: { type: String, default: null }
});

const settingsSchema = new Schema<ISettings>({
  shapeOwners: { type: [String], default: [] },
  slashCommands: {
    type: [{
      name: String,
      enabled: Boolean
    }],
    default: []
  },
  privacySettings: { type: privacySettingsSchema, default: () => ({}) },
  customMessages: { type: customMessagesSchema, default: () => ({}) }
});

const shapeSchema = new Schema<IShape>({
  profile: { type: profileSchema, default: () => ({}) },
  personality: { type: personalitySchema, default: () => ({}) },
  freeWill: { type: freeWillSchema, default: () => ({}) },
  knowledge: { type: knowledgeSchema, default: () => ({}) },
  training: { type: trainingSchema, default: () => ({}) },
  aiEngine: { type: aiEngineSchema, default: () => ({}) },
  imageEngine: { type: imageEngineSchema, default: () => ({}) },
  voiceEngine: { type: voiceEngineSchema, default: () => ({}) },
  settings: { type: settingsSchema, default: () => ({}) }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Methods
shapeSchema.methods.updateAIEngine = async function(primaryEngine: string) {
  if (this.aiEngine.primaryEngine !== primaryEngine) {
    this.aiEngine.primaryEngine = primaryEngine;
    await this.save();
  }
  return this;
};

shapeSchema.methods.updateImageEngine = async function(imageEngine: string) {
  if (this.imageEngine.imageEngine !== imageEngine) {
    this.imageEngine.imageEngine = imageEngine;
    await this.save();
  }
  return this;
};

export const Shape = mongoose.model<IShape>('Shape', shapeSchema);
export type { IShape };
