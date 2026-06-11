import { resolveIconSize } from '../iconUtils';
import { IconProps } from '../types';

const ChevronLeftIcon = ({
  size,
  w,
  h,
  width,
  height,
  ...props
}: IconProps) => {
  const finalWidth = resolveIconSize(size ?? w ?? width, 14);
  const finalHeight = resolveIconSize(size ?? h ?? height, 14);

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
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
};

export default ChevronLeftIcon;
