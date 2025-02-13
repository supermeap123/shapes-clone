import { Request, Response, NextFunction } from 'express';
import { Shape } from '../models/Shape';

/**
 * Profile Settings Controller
 */
export const getProfileSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const shape = await Shape.findById(req.params.shapeId);
    if (!shape) {
      return res.status(404).json({ success: false, message: 'Shape not found' });
    }

    res.json({
      success: true,
      data: {
        avatar: shape.profile?.avatar,
        banner: shape.profile?.banner,
        vanityUrl: shape.profile?.vanityUrl,
        nickname: shape.profile?.nickname,
        description: shape.profile?.description,
        appearance: shape.profile?.appearance,
        initialMessage: shape.profile?.initialMessage,
        discordName: shape.profile?.discordName,
        bio: shape.profile?.bio
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfileSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const shape = await Shape.findByIdAndUpdate(
      req.params.shapeId,
      { profile: req.body },
      { new: true, runValidators: true }
    );

    if (!shape) {
      return res.status(404).json({ success: false, message: 'Shape not found' });
    }

    res.json({ success: true, data: shape.profile });
  } catch (error) {
    next(error);
  }
};

/**
 * Personality Settings Controller
 */
export const getPersonalitySettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const shape = await Shape.findById(req.params.shapeId);
    if (!shape) {
      return res.status(404).json({ success: false, message: 'Shape not found' });
    }

    res.json({
      success: true,
      data: {
        nickname: shape.personality?.nickname,
        shortBackstory: shape.personality?.shortBackstory,
        responseType: shape.personality?.responseType,
        personalityTraits: shape.personality?.personalityTraits,
        tone: shape.personality?.tone,
        age: shape.personality?.age,
        history: shape.personality?.history,
        likes: shape.personality?.likes,
        dislikes: shape.personality?.dislikes,
        conversationalGoals: shape.personality?.conversationalGoals,
        conversationalExamples: shape.personality?.conversationalExamples
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updatePersonalitySettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const shape = await Shape.findByIdAndUpdate(
      req.params.shapeId,
      { personality: req.body },
      { new: true, runValidators: true }
    );

    if (!shape) {
      return res.status(404).json({ success: false, message: 'Shape not found' });
    }

    res.json({ success: true, data: shape.personality });
  } catch (error) {
    next(error);
  }
};

/**
 * Free Will Settings Controller
 */
export const getFreeWillSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const shape = await Shape.findById(req.params.shapeId);
    if (!shape) {
      return res.status(404).json({ success: false, message: 'Shape not found' });
    }

    res.json({
      success: true,
      data: {
        levelOfFreeWill: shape.freeWill?.levelOfFreeWill,
        directMessages: shape.freeWill?.directMessages,
        reactions: shape.freeWill?.reactions,
        favoritePeople: shape.freeWill?.favoritePeople,
        keywordsOfInterest: shape.freeWill?.keywordsOfInterest,
        serverInstructions: shape.freeWill?.serverInstructions,
        dmInstructions: shape.freeWill?.dmInstructions,
        aiModel: shape.freeWill?.aiModel,
        temperature: shape.freeWill?.temperature,
        numberOfMessages: shape.freeWill?.numberOfMessages
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateFreeWillSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const shape = await Shape.findByIdAndUpdate(
      req.params.shapeId,
      { freeWill: req.body },
      { new: true, runValidators: true }
    );

    if (!shape) {
      return res.status(404).json({ success: false, message: 'Shape not found' });
    }

    res.json({ success: true, data: shape.freeWill });
  } catch (error) {
    next(error);
  }
};

/**
 * Knowledge Settings Controller
 */
export const getKnowledgeSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const shape = await Shape.findById(req.params.shapeId);
    if (!shape) {
      return res.status(404).json({ success: false, message: 'Shape not found' });
    }

    res.json({
      success: true,
      data: {
        generalKnowledge: shape.knowledge?.generalKnowledge,
        commands: shape.knowledge?.commands,
        relationships: shape.knowledge?.relationships
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateKnowledgeSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const shape = await Shape.findByIdAndUpdate(
      req.params.shapeId,
      { knowledge: req.body },
      { new: true, runValidators: true }
    );

    if (!shape) {
      return res.status(404).json({ success: false, message: 'Shape not found' });
    }

    res.json({ success: true, data: shape.knowledge });
  } catch (error) {
    next(error);
  }
};

/**
 * Training Settings Controller
 */
export const getTrainingSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const shape = await Shape.findById(req.params.shapeId);
    if (!shape) {
      return res.status(404).json({ success: false, message: 'Shape not found' });
    }

    res.json({
      success: true,
      data: {
        conversationSnippets: shape.training?.conversationSnippets
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateTrainingSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const shape = await Shape.findByIdAndUpdate(
      req.params.shapeId,
      { training: req.body },
      { new: true, runValidators: true }
    );

    if (!shape) {
      return res.status(404).json({ success: false, message: 'Shape not found' });
    }

    res.json({ success: true, data: shape.training });
  } catch (error) {
    next(error);
  }
};

/**
 * AI Engine Settings Controller
 */
export const getAIEngineSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const shape = await Shape.findById(req.params.shapeId);
    if (!shape) {
      return res.status(404).json({ success: false, message: 'Shape not found' });
    }

    res.json({
      success: true,
      data: {
        primaryEngine: shape.aiEngine?.primaryEngine,
        fallbackEngine: shape.aiEngine?.fallbackEngine,
        freeWillEngine: shape.aiEngine?.freeWillEngine,
        languagePresets: shape.aiEngine?.languagePresets,
        enginePresets: shape.aiEngine?.enginePresets,
        temperature: shape.aiEngine?.temperature,
        topP: shape.aiEngine?.topP,
        maxResponseLength: shape.aiEngine?.maxResponseLength,
        contextWindow: shape.aiEngine?.contextWindow,
        memorySettings: shape.aiEngine?.memorySettings
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateAIEngineSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const shape = await Shape.findByIdAndUpdate(
      req.params.shapeId,
      { aiEngine: req.body },
      { new: true, runValidators: true }
    );

    if (!shape) {
      return res.status(404).json({ success: false, message: 'Shape not found' });
    }

    res.json({ success: true, data: shape.aiEngine });
  } catch (error) {
    next(error);
  }
};

/**
 * Image Engine Settings Controller
 */
export const getImageEngineSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const shape = await Shape.findById(req.params.shapeId);
    if (!shape) {
      return res.status(404).json({ success: false, message: 'Shape not found' });
    }

    res.json({
      success: true,
      data: {
        textCommandPrefix: shape.imageEngine?.textCommandPrefix,
        imageEngine: shape.imageEngine?.imageEngine,
        imagePreset: shape.imageEngine?.imagePreset,
        imageSizeOptions: shape.imageEngine?.imageSizeOptions
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateImageEngineSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const shape = await Shape.findByIdAndUpdate(
      req.params.shapeId,
      { imageEngine: req.body },
      { new: true, runValidators: true }
    );

    if (!shape) {
      return res.status(404).json({ success: false, message: 'Shape not found' });
    }

    res.json({ success: true, data: shape.imageEngine });
  } catch (error) {
    next(error);
  }
};

/**
 * Voice Engine Settings Controller
 */
export const getVoiceEngineSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const shape = await Shape.findById(req.params.shapeId);
    if (!shape) {
      return res.status(404).json({ success: false, message: 'Shape not found' });
    }

    res.json({
      success: true,
      data: {
        voiceResponses: shape.voiceEngine?.voiceResponses
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateVoiceEngineSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const shape = await Shape.findByIdAndUpdate(
      req.params.shapeId,
      { voiceEngine: req.body },
      { new: true, runValidators: true }
    );

    if (!shape) {
      return res.status(404).json({ success: false, message: 'Shape not found' });
    }

    res.json({ success: true, data: shape.voiceEngine });
  } catch (error) {
    next(error);
  }
};

/**
 * General Settings Controller
 */
export const getGeneralSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const shape = await Shape.findById(req.params.shapeId);
    if (!shape) {
      return res.status(404).json({ success: false, message: 'Shape not found' });
    }

    res.json({
      success: true,
      data: {
        shapeOwners: shape.settings?.shapeOwners,
        slashCommands: shape.settings?.slashCommands,
        privacySettings: shape.settings?.privacySettings,
        customMessages: shape.settings?.customMessages
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateGeneralSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const shape = await Shape.findByIdAndUpdate(
      req.params.shapeId,
      { settings: req.body },
      { new: true, runValidators: true }
    );

    if (!shape) {
      return res.status(404).json({ success: false, message: 'Shape not found' });
    }

    res.json({ success: true, data: shape.settings });
  } catch (error) {
    next(error);
  }
};
