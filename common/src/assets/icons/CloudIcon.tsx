import { resolveIconSize } from '../iconUtils';
import { IconProps } from '../types';

const CloudIcon = ({ size, w, h, width, height, ...props }: IconProps) => {
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
      <path d="M17.5 19A3.5 3.5 0 0 0 21 15.5c0-2.79-2.54-4.5-5-4.5-.54-1.92-2.18-3.5-4.5-3.5C8 7.5 5 10 5 13.5c-1.5.5-2.5 2-2.5 3.5A3.5 3.5 0 0 0 6 20.5h11.5" />
      <path d="m9 13 2 2 4-4" />
    </svg>
  );
};

export default CloudIcon;
