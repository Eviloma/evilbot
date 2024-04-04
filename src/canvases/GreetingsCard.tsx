/** @jsx JSX.createElement */
/** @jsxFrag JSX.Fragment */

// eslint-disable-next-line unused-imports/no-unused-imports
import { Builder, JSX, loadImage } from 'canvacord';

interface Properties {
  displayName: string;
  type: 'welcome' | 'goodbye';
  avatar: string;
  message: string;
}

export default class GreetingsCard extends Builder<Properties> {
  constructor() {
    super(930, 280);
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

  setType(value: Properties['type']) {
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

  async render() {
    const { type, displayName, avatar, message } = this.options.getOptions();
    const image = await loadImage(avatar);

    return (
      <div className='h-full w-full flex flex-col items-center justify-center bg-[#191919] rounded-xl'>
        <div className='px-6 bg-[#252525] w-[96%] h-[84%] rounded-lg flex items-center'>
          <img src={image.toDataURL()} className='flex h-[40] w-[40] rounded-full' />
          <div className='flex flex-col ml-6'>
            <h1 className='text-5xl text-white font-bold m-0'>
              {type === 'welcome' ? (
                <>
                  <span className='mr-1'>Привіт,</span>
                  <span className='text-[#6666ff] ml-1'>{displayName}!</span>
                </>
              ) : (
                <>
                  <span className='text-[#6666ff] ml-1'>{displayName}</span>
                  <span className='ml-1'>покинув сервер</span>
                </>
              )}
            </h1>
            <p className='text-gray-300 text-3xl m-0'>{message}</p>
          </div>
        </div>
      </div>
    );
  }
}
