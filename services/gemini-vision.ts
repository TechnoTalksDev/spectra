import { GoogleGenerativeAI } from '@google/generative-ai';

// Use Google Vision API key as primary, fallback to Gemini key
const VISION_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_VISION_API_KEY || process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(VISION_API_KEY);

export interface VisionAnalysis {
  description: string;
  objects: string[];
  scene: string;
  accessibility: string;
  confidence: number;
}

export interface VisionMode {
  type: 'quick' | 'detailed' | 'accessibility' | 'continuous';
  prompt: string;
}

const VISION_MODES: Record<string, string> = {
  quick: 'Provide a brief, one-sentence description of what you see in this image.',
  detailed: 'Analyze this image in detail. Describe the scene, identify all objects, their positions, colors, and any text visible. Provide context about what might be happening.',
  accessibility: 'Describe this image for someone who is visually impaired. Include spatial relationships, colors, text, and any important details that would help them understand the scene completely.',
  continuous: 'Quickly identify the main objects and scene in this image in one concise sentence.',
};

export class GeminiVisionService {
  private model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  async analyzeImage(
    base64Image: string,
    mode: 'quick' | 'detailed' | 'accessibility' | 'continuous' = 'quick'
  ): Promise<VisionAnalysis> {
    try {
      const prompt = VISION_MODES[mode];
      
      const imageParts = [
        {
          inlineData: {
            data: base64Image,
            mimeType: 'image/jpeg',
          },
        },
      ];

      const result = await this.model.generateContent([prompt, ...imageParts]);
      const response = await result.response;
      const description = response.text();

      // Parse response to extract structured data
      const analysis = this.parseAnalysis(description, mode);
      
      return analysis;
    } catch (error) {
      console.error('Gemini Vision Error:', error);
      throw new Error('Failed to analyze image');
    }
  }

  private parseAnalysis(description: string, mode: string): VisionAnalysis {
    // Extract objects (simple heuristic - can be improved)
    const objects = this.extractObjects(description);
    const scene = this.extractScene(description);
    
    return {
      description,
      objects,
      scene,
      accessibility: mode === 'accessibility' ? description : '',
      confidence: 0.9, // Gemini doesn't provide confidence, so we use a default
    };
  }

  private extractObjects(text: string): string[] {
    // Simple extraction - looks for nouns
    const commonObjects = [
      'person', 'people', 'man', 'woman', 'child', 'dog', 'cat', 'car', 'phone',
      'computer', 'book', 'table', 'chair', 'door', 'window', 'tree', 'building',
      'cup', 'plate', 'bottle', 'bag', 'keyboard', 'mouse', 'screen', 'lamp',
      'bed', 'couch', 'tv', 'plant', 'flower', 'food', 'drink', 'clock', 'watch'
    ];
    
    const found: string[] = [];
    const lowerText = text.toLowerCase();
    
    for (const obj of commonObjects) {
      if (lowerText.includes(obj)) {
        found.push(obj);
      }
    }
    
    return [...new Set(found)];
  }

  private extractScene(text: string): string {
    const scenes = [
      'indoor', 'outdoor', 'office', 'home', 'street', 'park', 'restaurant',
      'store', 'kitchen', 'bedroom', 'bathroom', 'living room', 'workspace'
    ];
    
    const lowerText = text.toLowerCase();
    for (const scene of scenes) {
      if (lowerText.includes(scene)) {
        return scene;
      }
    }
    
    return 'general scene';
  }

  async analyzeImageWithContext(
    base64Image: string,
    question: string
  ): Promise<string> {
    try {
      const imageParts = [
        {
          inlineData: {
            data: base64Image,
            mimeType: 'image/jpeg',
          },
        },
      ];

      const result = await this.model.generateContent([question, ...imageParts]);
      const response = await result.response;
      
      return response.text();
    } catch (error) {
      console.error('Gemini Context Analysis Error:', error);
      throw new Error('Failed to analyze image with context');
    }
  }
}

export const geminiVision = new GeminiVisionService();
