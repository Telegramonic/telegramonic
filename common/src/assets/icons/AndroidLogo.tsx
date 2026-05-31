import { resolveIconSize } from '../iconUtils';
import { IconProps } from '../types';

const AndroidLogo = ({ size, w, h, width, height, ...props }: IconProps) => {
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
      <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zm-8.5-4.5c2.33 0 4.3 1.46 5.11 3.5H6.89c.81-2.04 2.78-3.5 5.11-3.5zm3.5-1.5l1-1.5.8.5-1 1.5h-1.6zm-7.6-1l.8-.5 1 1.5h-1.6l-1.2-1z" />
    </svg>
  );
};

export default AndroidLogo;
