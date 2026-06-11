import { resolveIconSize } from '../iconUtils';
import { IconProps } from '../types';

const ThreeDotsIcon = ({ size, w, h, width, height, ...props }: IconProps) => {
  const finalWidth = resolveIconSize(size ?? w ?? width, 16);
  const finalHeight = resolveIconSize(size ?? h ?? height, 16);

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      width={finalWidth}
      height={finalHeight}
      {...props}
    >
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="12" cy="5" r="1.5" />
      <circle cx="12" cy="19" r="1.5" />
    </svg>
  );
};

export default ThreeDotsIcon;
