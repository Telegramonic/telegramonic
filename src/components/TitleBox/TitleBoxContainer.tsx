import React from 'react';
import { Box } from '@chakra-ui/react';
import isEqual from 'lodash/isEqual';
import { TitleBoxProps } from './types';
import { Helmet } from 'react-helmet-async';

const TitleBoxContainer = ({
  title,
  icon,
  helmetChildren,
  ...props
}: TitleBoxProps) => {
  return (
    <Box {...props}>
      <Helmet>
        <title>{title}</title>
        {helmetChildren}
      </Helmet>
      {props.children}
    </Box>
  );
};

export default React.memo(TitleBoxContainer, isEqual);
