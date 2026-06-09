import { resolveIconSize } from '../iconUtils';
import { IconProps } from '../types';

const SpeedIcon = ({ size, w, h, width, height, ...props }: IconProps) => {
  const finalWidth = resolveIconSize(size ?? w ?? width, 24);
  const finalHeight = resolveIconSize(size ?? h ?? height, 24);

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
      <path d="M22 12A10 10 0 1 1 12 2v4a6 6 0 1 0 6 6z" />
      <path d="m19 5.07-4.3 4.29" />
    </svg>
  );
};

export default SpeedIcon;
