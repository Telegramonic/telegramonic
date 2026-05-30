import { BoxProps } from '@chakra-ui/react';

export type TitleBoxProps = {
  title: string;
  icon?: string;
  helmetChildren?: React.ReactNode;
} & BoxProps;
