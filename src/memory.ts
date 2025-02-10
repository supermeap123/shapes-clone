export class MemoryManager {
  private shortTermMemory: Map<string, any>;
  private longTermMemory: Map<string, any>;

  constructor() {
    this.shortTermMemory = new Map();
    this.longTermMemory = new Map();
  }

  storeShortTerm(key: string, value: any): void {
    this.shortTermMemory.set(key, value);
  }

  retrieveShortTerm(key: string): any {
    return this.shortTermMemory.get(key);
  }

  clearShortTerm(): void {
    this.shortTermMemory.clear();
  }

  storeLongTerm(key: string, value: any): void {
    this.longTermMemory.set(key, value);
  }

  retrieveLongTerm(key: string): any {
    return this.longTermMemory.get(key);
  }

  clearLongTerm(): void {
    this.longTermMemory.clear();
  }
}

export const memoryManager = new MemoryManager();
