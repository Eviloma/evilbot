import type { ImageSource } from "canvacord";

import type ICommandOption from "./ICommandOption";

export default interface IFunnyImageOptions {
  name: string;
  description: string;
  options: ICommandOption[];
  minimumImages: 1 | 2;
  func: (images: ImageSource[]) => Promise<Buffer | null>;
}
