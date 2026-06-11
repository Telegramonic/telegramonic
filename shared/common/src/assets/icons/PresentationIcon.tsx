import { resolveIconSize } from '../iconUtils';
import { IconProps } from '../types';

const PresentationIcon = ({
  size,
  w,
  h,
  width,
  height,
  ...props
}: IconProps) => {
  const finalWidth = resolveIconSize(size ?? w ?? width, 18);
  const finalHeight = resolveIconSize(size ?? h ?? height, 18);

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
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
      <line x1="12" y1="17" x2="12" y2="21" />
      <line x1="7" y1="21" x2="17" y2="21" />
    </svg>
  );
};

export default PresentationIcon;
