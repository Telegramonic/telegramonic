import { Box, Text } from '@chakra-ui/react';
import MarkdownPreview from '@uiw/react-markdown-preview';
import markdownStyle from './css/Markdown.module.css';
import { MdPreviewProps } from './types';
import { useTheme } from 'next-themes';
import { useRef, useEffect, useState } from 'react';
import mermaid from 'mermaid';

// Shared Mermaid style configuration
const MERMAID_STYLE_CONFIG = {
  themeVariables: {
    fontFamily: 'var(--chakra-fonts-body), system-ui, sans-serif',
    fontSize: '12px',
  },
  themeCSS: `
    /* Prevent clipping of overflowing SVG text / HTML labels */
    svg, foreignObject, .edgeLabel, .node {
      overflow: visible !important;
      font-size: 16px !important;
    }
    /* Inner node text size */
    .node *, .node text, .node span, .node .label {
      font-size: 16px !important;

    }
    /* Outer text size (edge labels, line text, and subgraph titles) */
    .edgeLabel *, .edgeLabel text, .edgeLabel span,
    .cluster .label, .cluster .label text, .cluster-label, .subgraph-title {
      font-size: 16px !important;
    }
  `,
};

// Initialize mermaid globally
mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  suppressErrorRendering: true,
  ...MERMAID_STYLE_CONFIG,
});

interface MermaidProps {
  chart: string;
}

// Queue to serialize all asynchronous Mermaid renders, preventing concurrent rendering state conflicts
let renderQueue = Promise.resolve();

const Mermaid = ({ chart }: MermaidProps) => {
  const { resolvedTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string>('');
  const [rendered, setRendered] = useState(false);
  const [id] = useState(() => `mermaid-${Math.random().toString(36).slice(2)}`);

  useEffect(() => {
    if (!containerRef.current) return;

    let active = true;
    setError('');
    setRendered(false);

    renderQueue = renderQueue
      .then(() => {
        if (!active) return;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'loose',
          suppressErrorRendering: true,
          theme: resolvedTheme === 'dark' ? 'dark' : 'default',
          ...MERMAID_STYLE_CONFIG,
        });
        return mermaid.render(id, chart);
      })
      .then((result) => {
        if (result && active && containerRef.current) {
          containerRef.current.innerHTML = result.svg;
          setRendered(true);
          setError('');
        }
      })
      .catch((err: unknown) => {
        // eslint-disable-next-line no-console
        console.error('Mermaid render error:', err);
        // Remove any partial output mermaid may have left in the DOM
        if (containerRef.current) containerRef.current.innerHTML = '';
        const errMsg = err instanceof Error ? err.message : String(err);
        if (active) setError(`Failed to render Mermaid diagram: ${errMsg}`);
      });

    return () => {
      active = false;
    };
    // Re-render whenever the chart source OR the resolved theme changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chart, resolvedTheme, id]);

  if (error) {
    return (
      <Box
        p={1}
        my={2}
        border="1px solid"
        borderColor="border"
        borderRadius="md"
        bg="bg.subtle"
        color="fg.muted"
        fontSize="xs"
        overflowX="auto"
      >
        <Text fontWeight="semibold" color="red.500" mb={2}>
          {error}
        </Text>
        <pre>{chart}</pre>
      </Box>
    );
  }

  return (
    <Box
      ref={containerRef}
      className={`mermaid-container-${id}`}
      my={4}
      p={1}
      bg="bg.panel"
      borderWidth="1px"
      borderColor="border"
      display="flex"
      justifyContent="center"
      opacity={rendered ? 1 : 0}
      transition="opacity 0.3s"
    />
  );
};

const getRawText = (children: any): string => {
  if (children === null || children === undefined) {
    return '';
  }
  if (typeof children === 'string') {
    return children;
  }
  if (typeof children === 'number' || typeof children === 'boolean') {
    return String(children);
  }
  if (Array.isArray(children)) {
    return children.map(getRawText).join('');
  }
  if (typeof children === 'object') {
    if ('props' in children && children.props && 'children' in children.props) {
      return getRawText(children.props.children);
    }
    if ('value' in children && children.value !== undefined) {
      return String(children.value);
    }
  }
  return '';
};

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
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-mermaid/.exec(className || '');
            if (!inline && match) {
              const rawText = getRawText(children).replace(/\n$/, '');
              return <Mermaid chart={rawText} />;
            }
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      />
    </Box>
  );
};

// Export MdPreview component
export default MdPreview;
