import Client from '../../classes/Client';
import FunnyImageCommand from '../../classes/commands/FunnyImage';
import FunnyImageEffect from '../../libs/funny-image-effect';

export default class Rainbow extends FunnyImageCommand {
  constructor(client: Client) {
    super(client, FunnyImageEffect.rainbow);
  }
}
