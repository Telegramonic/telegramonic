import * as React from 'react';
import { Button, ButtonProps } from '@chakra-ui/react';

export interface LinkButtonProps
  extends ButtonProps,
    Omit<React.ComponentPropsWithoutRef<'a'>, keyof ButtonProps> {}

const LinkButton = (props: LinkButtonProps) => {
  return <Button as="a" {...props} />;
};

export default LinkButton;
