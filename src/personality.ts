export class PersonalityManager {
  private traits: Map<string, any>;

  constructor() {
    this.traits = new Map();
  }

  setTrait(key: string, value: any): void {
    this.traits.set(key, value);
  }

  getTrait(key: string): any {
    return this.traits.get(key);
  }

  clearTraits(): void {
    this.traits.clear();
  }
}

export const personalityManager = new PersonalityManager();
