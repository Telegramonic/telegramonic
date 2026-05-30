import { Box } from '@chakra-ui/react';
import MarkdownPreview from '@uiw/react-markdown-preview';
import markdownStyle from './css/Markdown.module.css';
import { MdPreviewProps } from './types';
import { useTheme } from 'next-themes';
import { useRef, useEffect, useState } from 'react';

const MdPreview = ({ mdString }: MdPreviewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by waiting for mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Ensure all links open in a new tab
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const anchors = container.querySelectorAll('a');
    anchors.forEach((anchor) => {
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
    });
  }, [mdString]);

  return (
    <Box
      ref={containerRef}
      width="full"
      data-color-mode={mounted ? resolvedTheme : 'dark'}
    >
      <MarkdownPreview
        className={markdownStyle.markdown}
        source={mdString}
        style={{ backgroundColor: 'transparent' }}
      />
    </Box>
  );
};

// Export MdPreview component
export default MdPreview;
