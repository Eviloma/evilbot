import Client from '../../classes/Client';
import FunnyImageCommand from '../../classes/commands/FunnyImage';
import FunnyImageEffect from '../../libs/funny-image-effect';

export default class Kiss extends FunnyImageCommand {
  constructor(client: Client) {
    super(client, FunnyImageEffect.kiss);
  }
}
