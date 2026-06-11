import { IconProps, IconType } from './types';
import Logo from './icons/Logo';
import CloudIcon from './icons/CloudIcon';
import BoltIcon from './icons/BoltIcon';
import SyncIcon from './icons/SyncIcon';
import SpeedIcon from './icons/SpeedIcon';
import VideoIcon from './icons/VideoIcon';
import FileIcon from './icons/FileIcon';
import FolderIcon from './icons/FolderIcon';
import ZipIcon from './icons/ZipIcon';
import CheckIcon from './icons/CheckIcon';
import CloudUploadIcon from './icons/CloudUploadIcon';
import MenuIcon from './icons/MenuIcon';
import LockIcon from './icons/LockIcon';
import SearchIcon from './icons/SearchIcon';
import ShareIcon from './icons/ShareIcon';
import AppleLogo from './icons/AppleLogo';
import WindowsLogo from './icons/WindowsLogo';
import LinuxLogo from './icons/LinuxLogo';
import AndroidLogo from './icons/AndroidLogo';
import PinIcon from './icons/PinIcon';
import CodeIcon from './icons/CodeIcon';
import PresentationIcon from './icons/PresentationIcon';
import CsvIcon from './icons/CsvIcon';
import AudioIcon from './icons/AudioIcon';
import UserIcon from './icons/UserIcon';
import DownloadIcon from './icons/DownloadIcon';
import UploadIcon from './icons/UploadIcon';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import ListViewIcon from './icons/ListViewIcon';
import GridViewIcon from './icons/GridViewIcon';
import ThreeDotsIcon from './icons/ThreeDotsIcon';

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
    case IconType.FOLDER:
      return <FolderIcon {...props} />;
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
    case IconType.APPLE:
      return <AppleLogo {...props} />;
    case IconType.WINDOWS:
      return <WindowsLogo {...props} />;
    case IconType.LINUX:
      return <LinuxLogo {...props} />;
    case IconType.ANDROID:
      return <AndroidLogo {...props} />;
    case IconType.PIN:
      return <PinIcon {...props} />;
    case IconType.CODE:
      return <CodeIcon {...props} />;
    case IconType.PRESENTATION:
      return <PresentationIcon {...props} />;
    case IconType.CSV:
      return <CsvIcon {...props} />;
    case IconType.AUDIO:
      return <AudioIcon {...props} />;
    case IconType.USER:
      return <UserIcon {...props} />;
    case IconType.DOWNLOAD:
      return <DownloadIcon {...props} />;
    case IconType.UPLOAD:
      return <UploadIcon {...props} />;
    case IconType.CHEVRON_LEFT:
      return <ChevronLeftIcon {...props} />;
    case IconType.LIST_VIEW:
      return <ListViewIcon {...props} />;
    case IconType.GRID_VIEW:
      return <GridViewIcon {...props} />;
    case IconType.THREE_DOTS:
      return <ThreeDotsIcon {...props} />;
    default:
      return null;
  }
};

export default Icon;
