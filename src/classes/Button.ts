import IButton from '../interfaces/IButton';
import Client from './Client';

export default class Button implements IButton {
  client: Client;

  id: string;

  constructor(client: Client, id: string) {
    this.client = client;
    this.id = id;
  }

  Execute(): void {
    throw new Error('Method not implemented.');
  }
}
