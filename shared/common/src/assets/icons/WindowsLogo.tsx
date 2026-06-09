import { resolveIconSize } from '../iconUtils';
import { IconProps } from '../types';

const WindowsLogo = ({ size, w, h, width, height, ...props }: IconProps) => {
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
      <path d="M0 3.449L9.75 2.1v9.45H0V3.449zM0 12.45h9.75v9.45L0 20.551v-8.1zM10.95 1.95L24 0v11.55H10.95V1.95zM10.95 12.45H24v11.55l-13.05-1.95v-9.6z" />
    </svg>
  );
};

export default WindowsLogo;
