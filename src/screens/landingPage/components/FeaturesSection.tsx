import { Box, SimpleGrid, Text, HStack, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Icon } from '@assets';
import { CardConfig, getFeatureCards } from './const';

// ---------------------------------------------------------------------------
// FeatureCard
// ---------------------------------------------------------------------------
const FeatureCard = ({
  icon,
  iconBg,
  iconColor,
  accentCss,
  glowColor,
  orbColor,
  statGradient,
  title,
  description,
  stat,
  statLabel,
  gridColumn,
}: CardConfig) => (
  // NOTE: No Chakra _hover or transition props — all handled via pure CSS
  // so there's exactly one source of truth for every animated property.
  <Box
    gridColumn={gridColumn}
    bg="bg.panel"
    borderRadius="2xl"
    p={{ base: 5, md: 7 }}
    borderWidth="1px"
    borderColor="border"
    position="relative"
    overflow="hidden"
    display="flex"
    flexDirection="column"
    justifyContent="space-between"
    gap={6}
    style={
      { '--glow': glowColor, willChange: 'transform' } as React.CSSProperties
    }
    className="feat-card"
    role="group"
  >
    {/* ── Decorative background orb ── */}
    <Box
      position="absolute"
      top="-40px"
      right="-40px"
      w="200px"
      h="200px"
      borderRadius="full"
      style={{ background: orbColor, filter: 'blur(60px)' }}
      pointerEvents="none"
      className="feat-orb"
    />

    {/* ── Dot-grid texture overlay ── */}
    <Box
      position="absolute"
      inset={0}
      pointerEvents="none"
      style={{
        backgroundImage:
          'radial-gradient(circle, currentColor 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        opacity: 0.045,
      }}
    />

    {/* ── Top accent bar — starts at 36%, expands to 100% on hover ── */}
    <Box
      position="absolute"
      top={0}
      left={0}
      h="2px"
      borderTopRadius="2xl"
      style={{ background: accentCss }}
      className="feat-accent-bar"
    />

    {/* ── Content ── */}
    <Box position="relative" zIndex={1}>
      {/* Icon badge */}
      <Box
        display="inline-flex"
        alignItems="center"
        justifyContent="center"
        w={14}
        h={14}
        bg={iconBg}
        color={iconColor}
        borderRadius="xl"
        mb={5}
        position="relative"
        className="feat-icon-badge"
        style={{ willChange: 'transform' }}
      >
        {/* Glow ring */}
        <Box
          position="absolute"
          inset="-5px"
          borderRadius="xl"
          style={{ background: orbColor, filter: 'blur(12px)' }}
          className="feat-icon-glow"
        />
        {/* Use explicit pixel size so resolveIconSize never misinterprets */}
        <Icon type={icon} size="22px" />
      </Box>

      <Text
        fontSize={{ base: 'md', md: 'lg' }}
        fontWeight="extrabold"
        color="fg"
        mb={2.5}
        lineHeight="tight"
      >
        {title}
      </Text>
      <Text fontSize="sm" color="fg.muted" lineHeight="tall">
        {description}
      </Text>
    </Box>

    {/* ── Stat callout ── */}
    {stat && (
      <HStack
        gap={3}
        bg="bg.default"
        borderWidth="1px"
        borderColor="border"
        borderRadius="xl"
        px={4}
        py={3}
        w="fit-content"
        position="relative"
        zIndex={1}
        className="feat-stat"
        style={{ willChange: 'transform' }}
      >
        <VStack gap={0} align="flex-start">
          <Text
            fontSize="xl"
            fontWeight="extrabold"
            lineHeight="tight"
            style={{
              background: statGradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {stat}
          </Text>
          <Text
            fontSize="9px"
            color="fg.muted"
            fontWeight="bold"
            textTransform="uppercase"
            letterSpacing="widest"
          >
            {statLabel}
          </Text>
        </VStack>
      </HStack>
    )}
  </Box>
);

// ---------------------------------------------------------------------------
// FeaturesSection
// ---------------------------------------------------------------------------
export const FeaturesSection = () => {
  const { t } = useTranslation();

  const cards = getFeatureCards(t);

  return (
    <Box
      id="features"
      width="100%"
      position="relative"
      py={{ base: 14, md: 24 }}
      overflow="hidden"
    >
      {/* Section ambient gradient backdrop */}
      <Box
        position="absolute"
        inset={0}
        pointerEvents="none"
        zIndex={0}
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(99,102,241,0.06) 0%, transparent 70%)',
        }}
      />

      <Box maxW="1200px" mx="auto" px={6} position="relative" zIndex={1}>
        {/* ── Section header ── */}
        <Box textAlign="center" mb={{ base: 10, md: 16 }}>
          <Box
            display="inline-flex"
            alignItems="center"
            gap={2}
            bg="primary/10"
            color="primary"
            px={4}
            py={1.5}
            borderRadius="full"
            fontSize="xs"
            fontWeight="bold"
            borderWidth="1px"
            borderColor="primary/20"
            mb={5}
            className="feat-badge-ping"
          >
            <span
              className="feat-dot-live"
              style={{
                display: 'inline-block',
                width: '6px',
                height: '6px',
                backgroundColor: 'var(--chakra-colors-primary)',
                borderRadius: '50%',
              }}
            />
            Why Telegramonic?
          </Box>

          <Text
            fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
            fontWeight="extrabold"
            lineHeight="tight"
            letterSpacing="tight"
            mb={4}
            style={{
              background:
                'linear-gradient(135deg, var(--chakra-colors-fg) 30%, var(--chakra-colors-primary) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {t('LandingPage.features.title')}
          </Text>

          <Text
            fontSize={{ base: 'sm', md: 'md' }}
            color="fg.muted"
            maxW="2xl"
            mx="auto"
            lineHeight="relaxed"
          >
            {t('LandingPage.features.subtitle')}
          </Text>
        </Box>

        {/* ── Bento grid ── */}
        <SimpleGrid
          columns={{ base: 1, sm: 2, lg: 3 }}
          gap={{ base: 4, md: 5 }}
        >
          {cards.map((card) => (
            <FeatureCard key={card.title} {...card} />
          ))}
        </SimpleGrid>
      </Box>

      {/* ── Global animation styles ── */}
      <style>{`
        /* ═══════════════════════════════════════════════
           CARD — base state (all transitions defined here,
           never inside :hover so both enter & exit are smooth)
           ═══════════════════════════════════════════════ */
        .feat-card {
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
          transform: translateY(0);
          border-color: var(--chakra-colors-border);

          transition:
            transform       0.45s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow      0.45s cubic-bezier(0.22, 1, 0.36, 1),
            border-color    0.35s ease;
        }
        .feat-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 24px 56px var(--glow), 0 4px 16px rgba(0,0,0,0.07);
          border-color: rgba(99,102,241,0.28);
        }

        /* ── Top accent bar ── */
        .feat-accent-bar {
          width: 36%;
          transition: width 0.55s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .feat-card:hover .feat-accent-bar {
          width: 100%;
        }

        /* ── Background orb ── */
        .feat-orb {
          opacity: 0.28;
          transform: scale(1);
          transition:
            opacity   0.5s ease,
            transform 0.5s ease;
        }
        .feat-card:hover .feat-orb {
          opacity: 0.55;
          transform: scale(1.18);
        }

        /* ── Icon badge ── */
        .feat-icon-badge {
          transform: scale(1) rotate(0deg);
          transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .feat-card:hover .feat-icon-badge {
          transform: scale(1.12) rotate(-6deg);
        }

        /* ── Icon glow ring ── */
        .feat-icon-glow {
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        .feat-card:hover .feat-icon-glow {
          opacity: 0.55;
        }

        /* ── Stat pill ── */
        .feat-stat {
          transform: translateY(0);
          box-shadow: none;
          transition:
            transform   0.4s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow  0.4s ease;
        }
        .feat-card:hover .feat-stat {
          transform: translateY(-3px);
          box-shadow: 0 6px 18px rgba(0,0,0,0.09);
        }

        /* ═══════════════════════════════════════════════
           ENTRANCE ANIMATIONS (staggered slide-up)
           ═══════════════════════════════════════════════ */
        @keyframes feat-enter {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .feat-card { animation: feat-enter 0.6s cubic-bezier(0.22,1,0.36,1) both; }
        .feat-card:nth-child(1) { animation-delay: 0.04s; }
        .feat-card:nth-child(2) { animation-delay: 0.13s; }
        .feat-card:nth-child(3) { animation-delay: 0.22s; }
        .feat-card:nth-child(4) { animation-delay: 0.31s; }
        .feat-card:nth-child(5) { animation-delay: 0.40s; }
        .feat-card:nth-child(6) { animation-delay: 0.49s; }

        /* ═══════════════════════════════════════════════
           SECTION BADGE
           ═══════════════════════════════════════════════ */
        @keyframes live-dot {
          0%, 100% { transform: scale(1);   opacity: 1; }
          50%       { transform: scale(1.7); opacity: 0.5; }
        }
        .feat-dot-live { animation: live-dot 2s ease-in-out infinite; }

        @keyframes badge-breathe {
          0%, 100% { box-shadow: 0 0 0 0   rgba(99,102,241,0); }
          50%       { box-shadow: 0 0 0 5px rgba(99,102,241,0.1); }
        }
        .feat-badge-ping { animation: badge-breathe 3.2s ease-in-out infinite; }
      `}</style>
    </Box>
  );
};
