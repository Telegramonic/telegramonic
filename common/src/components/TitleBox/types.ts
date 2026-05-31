import type { ReactNode } from 'react';
import { BoxProps } from '@chakra-ui/react';

export type TitleBoxProps = {
  title: string;
  icon?: string;
  helmetChildren?: ReactNode;
} & BoxProps;
