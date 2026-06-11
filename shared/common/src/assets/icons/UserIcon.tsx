import { resolveIconSize } from '../iconUtils';
import { IconProps } from '../types';

const UserIcon = ({ size, w, h, width, height, ...props }: IconProps) => {
  const finalWidth = resolveIconSize(size ?? w ?? width, 20);
  const finalHeight = resolveIconSize(size ?? h ?? height, 20);

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width={finalWidth}
      height={finalHeight}
      {...props}
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
};

export default UserIcon;
