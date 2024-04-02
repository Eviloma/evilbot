import type Client from '@/classes/Client';
import FunnyImageCommand from '@/classes/commands/FunnyImage';
import FunnyImageEffects from '@/utils/funny-image-effect';

export default class Rainbow extends FunnyImageCommand {
  constructor(client: Client) {
    super(client, FunnyImageEffects.rainbow);
  }
}
