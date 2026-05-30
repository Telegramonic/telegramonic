import React from 'react';
import { IconProps, IconType } from './types';
import Logo from './icons/Logo';
import CloudIcon from './icons/CloudIcon';
import BoltIcon from './icons/BoltIcon';
import SyncIcon from './icons/SyncIcon';
import SpeedIcon from './icons/SpeedIcon';
import VideoIcon from './icons/VideoIcon';
import FileIcon from './icons/FileIcon';
import ZipIcon from './icons/ZipIcon';
import CheckIcon from './icons/CheckIcon';
import CloudUploadIcon from './icons/CloudUploadIcon';
import MenuIcon from './icons/MenuIcon';
import LockIcon from './icons/LockIcon';
import SearchIcon from './icons/SearchIcon';
import ShareIcon from './icons/ShareIcon';

interface GenericIconProps extends IconProps {
  type: IconType;
}

const Icon = ({ type, ...props }: GenericIconProps) => {
  switch (type) {
    case IconType.LOGO:
      return <Logo {...props} />;
    case IconType.CLOUD:
      return <CloudIcon {...props} />;
    case IconType.BOLT:
      return <BoltIcon {...props} />;
    case IconType.SYNC:
      return <SyncIcon {...props} />;
    case IconType.SPEED:
      return <SpeedIcon {...props} />;
    case IconType.VIDEO:
      return <VideoIcon {...props} />;
    case IconType.FILE:
      return <FileIcon {...props} />;
    case IconType.ZIP:
      return <ZipIcon {...props} />;
    case IconType.CHECK:
      return <CheckIcon {...props} />;
    case IconType.CLOUD_UPLOAD:
      return <CloudUploadIcon {...props} />;
    case IconType.MENU:
      return <MenuIcon {...props} />;
    case IconType.LOCK:
      return <LockIcon {...props} />;
    case IconType.SEARCH:
      return <SearchIcon {...props} />;
    case IconType.SHARE:
      return <ShareIcon {...props} />;
    default:
      return null;
  }
};

export default Icon;
