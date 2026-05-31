import { resolveIconSize } from '../iconUtils';
import { IconProps } from '../types';

const CloudUploadIcon = ({
  size,
  w,
  h,
  width,
  height,
  ...props
}: IconProps) => {
  const finalWidth = resolveIconSize(size ?? w ?? width, 32);
  const finalHeight = resolveIconSize(size ?? h ?? height, 32);

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
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
      <path d="M12 12v9" />
      <path d="m8 16 4-4 4 4" />
    </svg>
  );
};

export default CloudUploadIcon;
