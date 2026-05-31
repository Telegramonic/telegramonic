import { resolveIconSize } from '../iconUtils';
import { IconProps } from '../types';

const CheckIcon = ({ size, w, h, width, height, ...props }: IconProps) => {
  const finalWidth = resolveIconSize(size ?? w ?? width, 14);
  const finalHeight = resolveIconSize(size ?? h ?? height, 14);

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="#22c55e"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      width={finalWidth}
      height={finalHeight}
      {...props}
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
};

export default CheckIcon;
