import { canvacord } from 'canvacord';
import { ApplicationCommandOptionType } from 'discord.js';
import { constant } from 'lodash';

import IFunnyImageOptions from '../interfaces/IFunnyImageOption';

interface IFunnyimagesEffect {
  [key: string]: IFunnyImageOptions;
}

const SoloUser = {
  name: 'main-user',
  description: 'Select a main user to take their avatar for the filter',
  type: ApplicationCommandOptionType.User,
  required: false,
};

const MainUser = {
  name: 'main-user',
  description: 'Select a main user to take their avatar for the filter',
  type: ApplicationCommandOptionType.User,
  required: false,
};

const SecondaryUser = {
  name: 'secondary-user',
  description: 'Select a secondary user to take their avatar for the filter',
  type: ApplicationCommandOptionType.User,
  required: false,
};

const FunnyimagesEffect: IFunnyimagesEffect = {
  affected: {
    name: 'affected',
    description: 'Create affected filter images',
    options: [SoloUser],
    minimumImages: 1,
    func: (images) => canvacord.affect(images[0]).catch(constant(null)),
  },
  beautiful: {
    name: 'beautiful',
    description: 'Create beautiful filter images',
    options: [SoloUser],
    minimumImages: 1,
    func: (images) => canvacord.beautiful(images[0]).catch(constant(null)),
  },
  facepalm: {
    name: 'facepalm',
    description: 'Create facepalm filter images',
    options: [SoloUser],
    minimumImages: 1,
    func: (images) => canvacord.facepalm(images[0]).catch(constant(null)),
  },
  hitler: {
    name: 'hitler',
    description: 'Create hitler filter images',
    options: [SoloUser],
    minimumImages: 1,
    func: (images) => canvacord.hitler(images[0]).catch(constant(null)),
  },
  rainbow: {
    name: 'rainbow',
    description: 'Create rainbow (gay) filter images',
    options: [SoloUser],
    minimumImages: 1,
    func: (images) => canvacord.rainbow(images[0]).catch(constant(null)),
  },
  rip: {
    name: 'rip',
    description: 'Create rip filter images',
    options: [SoloUser],
    minimumImages: 1,
    func: (images) => canvacord.rip(images[0]).catch(constant(null)),
  },
  trash: {
    name: 'trash',
    description: 'Create trash filter images',
    options: [SoloUser],
    minimumImages: 1,
    func: (images) => canvacord.trash(images[0]).catch(constant(null)),
  },
  fused: {
    name: 'fused',
    description: 'Create fused filter images',
    options: [MainUser, SecondaryUser],
    minimumImages: 2,
    func: (images) => canvacord.fuse(images[0], images[1]).catch(constant(null)),
  },
  kiss: {
    name: 'kiss',
    description: 'Create kiss filter images',
    options: [MainUser, SecondaryUser],
    minimumImages: 2,
    func: (images) => canvacord.kiss(images[0], images[1]).catch(constant(null)),
  },
  spank: {
    name: 'spank',
    description: 'Create spank filter images',
    options: [MainUser, SecondaryUser],
    minimumImages: 2,
    func: (images) => canvacord.spank(images[0], images[1]).catch(constant(null)),
  },
  slap: {
    name: 'slap',
    description: 'Create slap filter images',
    options: [MainUser, SecondaryUser],
    minimumImages: 2,
    func: (images) => canvacord.slap(images[0], images[1]).catch(constant(null)),
  },
};

export default FunnyimagesEffect;
