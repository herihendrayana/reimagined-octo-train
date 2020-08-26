import React from 'react';
import styled from 'styled-components';

import { translateRaw } from '@translations';

import zapperLogo from '@assets/images/defizap/zapperLogo.svg';

const DefiZapLogo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DefiZapLogoImage = styled.img`
  height: 24px;
`;

const DefiZapLogoText = styled.div`
  margin-left: 0.5em;
`;

const DeFiZapLogo = () => {
  return (
    <DefiZapLogo>
      <DefiZapLogoImage src={zapperLogo} />
      <DefiZapLogoText>{translateRaw('ZAP_POWERED_BY')}</DefiZapLogoText>
    </DefiZapLogo>
  );
};

export default DeFiZapLogo;
