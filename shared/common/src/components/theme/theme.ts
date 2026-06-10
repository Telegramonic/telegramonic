import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';
import colors from './colors';
import {
  breakpoints,
  fontSize,
  fontWeight,
  lineHeight,
  zIndices,
} from './fonts';

const customConfig = defineConfig({
  theme: {
    breakpoints: {
      sm: breakpoints.sm,
      md: breakpoints.md,
      lg: breakpoints.lg,
      xl: breakpoints.xl,
      '2xl': breakpoints['2xl'],
    },
    tokens: {
      colors: {
        transparent: { value: colors.transparent },
        primary: { value: colors.primary },
        secondary: { value: colors.secondary },
        // Social colors
        'social.facebook': { value: colors.social.facebook },
        'social.linkedin': { value: colors.social.linkedin },
        'social.instagram': { value: colors.social.instagram },
        'social.youtube': { value: colors.social.youtube },
        // Cool colors
        'coolColor.1': { value: colors.coolColor[1] },
        'coolColor.2': { value: colors.coolColor[2] },
        'coolColor.3': { value: colors.coolColor[3] },
        'coolColor.4': { value: colors.coolColor[4] },
        'coolColor.5': { value: colors.coolColor[5] },
        'coolColor.6': { value: colors.coolColor[6] },
        'coolColor.7': { value: colors.coolColor[7] },
        'coolColor.8': { value: colors.coolColor[8] },
        // Green scale
        'green.100': { value: colors.green[100] },
        'green.200': { value: colors.green[200] },
        'green.300': { value: colors.green[300] },
        'green.400': { value: colors.green[400] },
        'green.500': { value: colors.green[500] },
        'green.600': { value: colors.green[600] },
        'green.700': { value: colors.green[700] },
        'green.800': { value: colors.green[800] },
        'green.900': { value: colors.green[900] },
        // Mint scale
        'mint.100': { value: colors.mint[100] },
        'mint.200': { value: colors.mint[200] },
        'mint.300': { value: colors.mint[300] },
        'mint.400': { value: colors.mint[400] },
        'mint.500': { value: colors.mint[500] },
        'mint.600': { value: colors.mint[600] },
        'mint.700': { value: colors.mint[700] },
        'mint.800': { value: colors.mint[800] },
        'mint.900': { value: colors.mint[900] },
        // Neutral scale
        'neutral.100': { value: colors.neutral[100] },
        'neutral.200': { value: colors.neutral[200] },
        'neutral.300': { value: colors.neutral[300] },
        'neutral.400': { value: colors.neutral[400] },
        'neutral.500': { value: colors.neutral[500] },
        'neutral.600': { value: colors.neutral[600] },
        'neutral.700': { value: colors.neutral[700] },
        'neutral.800': { value: colors.neutral[800] },
        'neutral.900': { value: colors.neutral[900] },
        // Status colors
        'success.100': { value: colors.success[100] },
        'success.400': { value: colors.success[400] },
        'warning.100': { value: colors.warning[100] },
        'warning.400': { value: colors.warning[400] },
        'error.100': { value: colors.error[100] },
        'error.400': { value: colors.error[400] },
      },
      fonts: {
        heading: { value: `'Inter', sans-serif` },
        body: { value: `'Inter', sans-serif` },
      },
      fontSizes: {
        xs: { value: fontSize.xs },
        sm: { value: fontSize.sm },
        md: { value: fontSize.md },
        lg: { value: fontSize.lg },
        xl: { value: fontSize.xl },
        '2xl': { value: fontSize['2xl'] },
        '3xl': { value: fontSize['3xl'] },
        '4xl': { value: fontSize['4xl'] },
        '5xl': { value: fontSize['5xl'] },
        '6xl': { value: fontSize['6xl'] },
        '7xl': { value: fontSize['7xl'] },
        '8xl': { value: fontSize['8xl'] },
        '9xl': { value: fontSize['9xl'] },
      },
      fontWeights: {
        hairline: { value: String(fontWeight.hairline) },
        thin: { value: String(fontWeight.thin) },
        light: { value: String(fontWeight.light) },
        normal: { value: String(fontWeight.normal) },
        medium: { value: String(fontWeight.medium) },
        semibold: { value: String(fontWeight.semibold) },
        bold: { value: String(fontWeight.bold) },
        extrabold: { value: String(fontWeight.extrabold) },
        black: { value: String(fontWeight.black) },
      },
      lineHeights: {
        none: { value: String(lineHeight.none) },
        shorter: { value: String(lineHeight.shorter) },
        short: { value: String(lineHeight.short) },
        base: { value: String(lineHeight.base) },
        tall: { value: String(lineHeight.tall) },
        taller: { value: lineHeight.taller },
      },
      zIndex: {
        hide: { value: zIndices.hide },
        base: { value: zIndices.base },
        docked: { value: zIndices.docked },
        dropdown: { value: zIndices.dropdown },
        sticky: { value: zIndices.sticky },
        banner: { value: zIndices.banner },
        overlay: { value: zIndices.overlay },
        modal: { value: zIndices.modal },
        popover: { value: zIndices.popover },
        toast: { value: zIndices.toast },
        tooltip: { value: zIndices.tooltip },
      },
    },
    semanticTokens: {
      colors: {
        primary: {
          value: { _light: colors.primary, _dark: colors.primary },
        },
        'green.700': {
          value: { _light: '#0088cc', _dark: '#0088cc' },
        },
        'green.800': {
          value: { _light: '#007bb9', _dark: '#007bb9' },
        },
        'green.900': {
          value: { _light: '#006193', _dark: '#006193' },
        },
        'neutral.200': {
          value: { _light: colors.neutral[200], _dark: colors.neutral[800] },
        },
        'neutral.800': {
          value: { _light: colors.neutral[800], _dark: colors.neutral[200] },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, {
  ...customConfig,
  disableLayers: true,
});

export default system;
