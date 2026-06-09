import { resolveIconSize } from '../iconUtils';
import { IconProps } from '../types';

const LinuxLogo = ({ size, w, h, width, height, ...props }: IconProps) => {
  const finalWidth = resolveIconSize(size ?? w ?? width, 28);
  const finalHeight = resolveIconSize(size ?? h ?? height, 28);

  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      width={finalWidth}
      height={finalHeight}
      {...props}
    >
      <path d="M12 2a5 5 0 0 0-5 5c0 1.25.43 2.4 1.15 3.32C6.82 11.23 6 12.63 6 14.5c0 3.04 2.69 5.5 6 5.5s6-2.46 6-5.5c0-1.87-.82-3.27-2.15-4.18C16.57 9.4 17 8.25 17 7a5 5 0 0 0-5-5m0 2a3 3 0 0 1 3 3c0 1.66-1.34 3-3 3a3 3 0 0 1-3-3 3 3 0 0 1 3-3m0 9c1.66 0 3 .84 3 2.5 0 .5-.45.5-1 .5H10c-.55 0-1 0-1-.5 0-1.66 1.34-2.5 3-2.5z" />
    </svg>
  );
};

export default LinuxLogo;
