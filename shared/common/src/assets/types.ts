import { SVGProps } from 'react';

export enum IconType {
  LOGO = 'LOGO',
  CLOUD = 'CLOUD',
  BOLT = 'BOLT',
  SYNC = 'SYNC',
  SPEED = 'SPEED',
  VIDEO = 'VIDEO',
  FILE = 'FILE',
  FOLDER = 'FOLDER',
  ZIP = 'ZIP',
  CHECK = 'CHECK',
  CLOUD_UPLOAD = 'CLOUD_UPLOAD',
  MENU = 'MENU',
  LOCK = 'LOCK',
  SEARCH = 'SEARCH',
  SHARE = 'SHARE',
  APPLE = 'APPLE',
  WINDOWS = 'WINDOWS',
  LINUX = 'LINUX',
  ANDROID = 'ANDROID',
  PIN = 'PIN',
  CODE = 'CODE',
  PRESENTATION = 'PRESENTATION',
  CSV = 'CSV',
  AUDIO = 'AUDIO',
  USER = 'USER',
  DOWNLOAD = 'DOWNLOAD',
  UPLOAD = 'UPLOAD',
  CHEVRON_LEFT = 'CHEVRON_LEFT',
  LIST_VIEW = 'LIST_VIEW',
  GRID_VIEW = 'GRID_VIEW',
  THREE_DOTS = 'THREE_DOTS',
}

export enum IconSize {
  XS = '12px',
  SM = '16px',
  MD = '24px',
  LG = '32px',
  XL = '48px',
  XXL = '60px',
  HERO = '18px',
  CHECK = '14px',
  LOGO_DEFAULT = '120px',
  MENU_DEFAULT = '1em',
}

export interface IconProps extends SVGProps<SVGSVGElement> {
  size?: IconSize | number | string;
  w?: IconSize | number | string;
  h?: IconSize | number | string;
}
