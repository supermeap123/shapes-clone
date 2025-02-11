import { Client, Collection } from 'discord.js';

export class ExtendedClient extends Client {
  commands: Collection<string, any>;
  isActive: boolean;

  constructor(options: any) {
    super(options);
    this.commands = new Collection();
    this.isActive = false;
  }
}
