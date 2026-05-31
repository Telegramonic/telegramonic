import { IconType } from '@assets';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface CardConfig {
  icon: IconType;
  iconBg: string;
  iconColor: string;
  accentCss: string;
  glowColor: string;
  orbColor: string;
  statGradient: string;
  title: string;
  description: string;
  stat?: string;
  statLabel?: string;
  gridColumn?: object;
}

// ---------------------------------------------------------------------------
// Feature Cards Config Generator
// ---------------------------------------------------------------------------
export const getFeatureCards = (t: (key: string) => string): CardConfig[] => [
  {
    gridColumn: { base: 'span 1', lg: 'span 2' },
    icon: IconType.CLOUD,
    iconBg: 'primary/15',
    iconColor: 'primary',
    accentCss: 'linear-gradient(90deg,#6366f1,#60efff)',
    glowColor: 'rgba(99,102,241,0.22)',
    orbColor: 'linear-gradient(135deg,#6366f1 0%,#60efff 100%)',
    statGradient: 'linear-gradient(90deg,#6366f1,#60efff)',
    title: t('LandingPage.features.infinite.title'),
    description: t('LandingPage.features.infinite.description'),
    stat: t('LandingPage.features.infinite.stat'),
    statLabel: t('LandingPage.features.infinite.statLabel'),
  },
  {
    icon: IconType.LOCK,
    iconBg: 'purple.100',
    iconColor: 'purple.500',
    accentCss: 'linear-gradient(90deg,#a855f7,#ec4899)',
    glowColor: 'rgba(168,85,247,0.22)',
    orbColor: 'linear-gradient(135deg,#a855f7 0%,#ec4899 100%)',
    statGradient: 'linear-gradient(90deg,#a855f7,#ec4899)',
    title: t('LandingPage.features.security.title'),
    description: t('LandingPage.features.security.description'),
    stat: t('LandingPage.features.security.stat'),
    statLabel: t('LandingPage.features.security.statLabel'),
  },
  {
    icon: IconType.BOLT,
    iconBg: 'green.100',
    iconColor: 'green.700',
    accentCss: 'linear-gradient(90deg,#22c55e,#14b8a6)',
    glowColor: 'rgba(34,197,94,0.22)',
    orbColor: 'linear-gradient(135deg,#22c55e 0%,#14b8a6 100%)',
    statGradient: 'linear-gradient(90deg,#22c55e,#14b8a6)',
    title: t('LandingPage.features.transfers.title'),
    description: t('LandingPage.features.transfers.description'),
    stat: t('LandingPage.features.transfers.stat'),
    statLabel: t('LandingPage.features.transfers.statLabel'),
  },
  {
    gridColumn: { base: 'span 1', lg: 'span 2' },
    icon: IconType.SYNC,
    iconBg: 'orange.100',
    iconColor: 'orange.400',
    accentCss: 'linear-gradient(90deg,#f59e0b,#f97316)',
    glowColor: 'rgba(245,158,11,0.22)',
    orbColor: 'linear-gradient(135deg,#f59e0b 0%,#f97316 100%)',
    statGradient: 'linear-gradient(90deg,#f59e0b,#f97316)',
    title: t('LandingPage.features.sync.title'),
    description: t('LandingPage.features.sync.description'),
    stat: t('LandingPage.features.sync.stat'),
    statLabel: t('LandingPage.features.sync.statLabel'),
  },
  {
    gridColumn: { base: 'span 1', sm: 'span 2', lg: 'span 2' },
    icon: IconType.SEARCH,
    iconBg: 'cyan.100',
    iconColor: 'cyan.600',
    accentCss: 'linear-gradient(90deg,#06b6d4,#3b82f6)',
    glowColor: 'rgba(6,182,212,0.22)',
    orbColor: 'linear-gradient(135deg,#06b6d4 0%,#3b82f6 100%)',
    statGradient: 'linear-gradient(90deg,#06b6d4,#3b82f6)',
    title: t('LandingPage.features.search.title'),
    description: t('LandingPage.features.search.description'),
    stat: t('LandingPage.features.search.stat'),
    statLabel: t('LandingPage.features.search.statLabel'),
  },
  {
    gridColumn: { base: 'span 1', sm: 'span 2', lg: 'span 1' },
    icon: IconType.SHARE,
    iconBg: 'pink.100',
    iconColor: 'pink.500',
    accentCss: 'linear-gradient(90deg,#ec4899,#ef4444)',
    glowColor: 'rgba(236,72,153,0.22)',
    orbColor: 'linear-gradient(135deg,#ec4899 0%,#ef4444 100%)',
    statGradient: 'linear-gradient(90deg,#ec4899,#ef4444)',
    title: t('LandingPage.features.share.title'),
    description: t('LandingPage.features.share.description'),
    stat: t('LandingPage.features.share.stat'),
    statLabel: t('LandingPage.features.share.statLabel'),
  },
];
