import { Request, Response } from 'express';
import { Shape } from '../models/Shape';

export const createShape = async (req: Request, res: Response) => {
  try {
    console.log('Creating shape with data:', req.body);
    
    // Create initial shape with default values
    const initialShape = {
      profile: {
        nickname: 'New Shape',
        description: 'A new AI personality',
      },
      personality: {
        traits: [],
        tone: 'casual',
      },
      freeWill: {
        levelOfFreeWill: 'semi-autonomous',
        directMessages: false,
        temperature: 0.7,
        numberOfMessages: 1,
      },
      aiEngine: {
        primaryEngine: 'gpt-4-turbo',
      },
      imageEngine: {
        textCommandPrefix: '!imagine',
        engine: 'stable-diffusion-xl',
      },
      voiceEngine: {
        voiceResponses: false,
      },
      knowledge: {
        generalKnowledge: [],
        commands: [],
      },
      training: {
        conversationSnippets: [],
      },
      settings: {
        shapeOwners: [],
        privacySettings: {
          serverListVisibility: false,
          dmResponseSettings: {
            enabled: false,
            allowlist: [],
            blocklist: [],
          },
          ignoreList: [],
        },
        customMessages: {},
      },
      ...req.body
    };

    const shape = new Shape(initialShape);
    const savedShape = await shape.save();
    console.log('Shape created successfully:', savedShape);
    res.status(201).json(savedShape.toObject());
  } catch (error: any) {
    console.error('Error creating shape:', error);
    res.status(500).json({ 
      message: 'Failed to create shape',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const getShapes = async (req: Request, res: Response) => {
  try {
    const shapes = await Shape.find();
    res.json(shapes);
  } catch (error: any) {
    console.error('Error fetching shapes:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getShapeById = async (req: Request, res: Response) => {
  try {
    const shape = await Shape.findById(req.params.id);
    if (!shape) {
      return res.status(404).json({ message: 'Shape not found' });
    }
    res.json(shape);
  } catch (error: any) {
    console.error('Error fetching shape by ID:', error);
    res.status(500).json({ message: error.message });
  }
};

export const updateShape = async (req: Request, res: Response) => {
  try {
    const shape = await Shape.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!shape) {
      return res.status(404).json({ message: 'Shape not found' });
    }
    res.json(shape);
  } catch (error: any) {
    console.error('Error updating shape:', error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteShape = async (req: Request, res: Response) => {
  try {
    const shape = await Shape.findByIdAndDelete(req.params.id);
    if (!shape) {
      return res.status(404).json({ message: 'Shape not found' });
    }
    res.json({ message: 'Shape deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting shape:', error);
    res.status(500).json({ message: error.message });
  }
};
