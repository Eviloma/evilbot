/** @jsx JSX.createElement */
/** @jsxFrag JSX.Fragment */

// JSX import is required if you want to use JSX syntax
// Builder is a base class to create your own builders
// loadImage is a helper function to load images from url or path
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Builder, Font, JSX, loadImage } from 'canvacord';

interface Props {
  displayName: string;
  type: 'welcome' | 'goodbye';
  avatar: string;
  message: string;
}

export default class GreetingsCard extends Builder<Props> {
  constructor() {
    // set width and height
    super(930, 280);
    // initialize props
    this.bootstrap({
      displayName: '',
      type: 'welcome',
      avatar: '',
      message: '',
    });
  }

  setDisplayName(value: string) {
    this.options.set('displayName', value);
    return this;
  }

  setType(value: Props['type']) {
    this.options.set('type', value);
    return this;
  }

  setAvatar(value: string) {
    this.options.set('avatar', value);
    return this;
  }

  setMessage(value: string) {
    this.options.set('message', value);
    return this;
  }

  // this is where you have to define output ui
  async render() {
    const { type, displayName, avatar, message } = this.options.getOptions();

    // make sure to use the loadImage helper function to load images, otherwise you may get errors
    const image = await loadImage(avatar);

    return (
      <div className='h-full w-full flex flex-col items-center justify-center bg-[#23272A] rounded-xl'>
        <div className='px-6 bg-[#2B2F35AA] w-[96%] h-[84%] rounded-lg flex items-center'>
          <img src={image.toDataURL()} className='flex h-[40] w-[40] rounded-full' />
          <div className='flex flex-col ml-6 gap-2'>
            <h1 className='text-5xl text-white font-bold m-0'>
              {type === 'welcome' ? 'Welcome' : 'Goodbye'}, <span className='text-blue-500'>{displayName}!</span>
            </h1>
            <p className='text-gray-300 text-3xl m-0'>{message}</p>
          </div>
        </div>
      </div>
    );
  }
}
