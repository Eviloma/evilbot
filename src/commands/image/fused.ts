import Client from '../../classes/Client';
import FunnyImageCommand from '../../classes/FunnyImage';
import FunnyImageEffect from '../../libs/funny-image-effect';

export default class Fused extends FunnyImageCommand {
  constructor(client: Client) {
    super(client, FunnyImageEffect.fused);
  }
}
