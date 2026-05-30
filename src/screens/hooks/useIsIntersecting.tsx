import { useEffect, useState } from 'react';

/**
 * Hook to check if an element is intersecting with the viewport
 * @param ref - React ref object
 * @param options - IntersectionObserverInit
 * @returns boolean
 */
const useIsIntersecting = (
  ref: React.RefObject<HTMLElement>,
  options: IntersectionObserverInit = {},
): boolean => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) =>
      setIsIntersecting(entry.isIntersecting),
    );

    observer.observe(ref.current as Element);
    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return isIntersecting;
};

export default useIsIntersecting;
