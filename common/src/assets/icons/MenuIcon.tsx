import { resolveIconSize } from '../iconUtils';
import { IconProps } from '../types';

const MenuIcon = ({ size, w, h, width, height, ...props }: IconProps) => {
  const finalWidth = resolveIconSize(size ?? w ?? width, '1em');
  const finalHeight = resolveIconSize(size ?? h ?? height, '1em');

  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      width={finalWidth}
      height={finalHeight}
      {...props}
    >
      <path
        fill="currentColor"
        d="M2 6a1 1 0 011-1h18a1 1 0 110 2H3a1 1 0 01-1-1zM2 12.032a1 1 0 011-1h18a1 1 0 110 2H3a1 1 0 01-1-1zM3 17.064a1 1 0 100 2h18a1 1 0 000-2H3z"
      />
    </svg>
  );
};

export default MenuIcon;
