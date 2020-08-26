import React, { FC, useContext, useEffect } from 'react';
import { OptionProps } from 'react-select';
import styled from 'styled-components';

import translate from '@translations';
import { NetworkContext, isWalletFormatSupportedOnNetwork } from '@services/Store';
import { Network, NetworkId, WalletId } from '@types';
import { DEFAULT_NETWORK } from '@config';
import { Typography, Dropdown, Tooltip } from '@components';

interface Props {
  network: NetworkId;
  accountType?: WalletId;
  className?: string;
  showTooltip?: boolean;
  disabled?: boolean;
  onChange(network: NetworkId): void;
}

const SContainer = styled('div')`
  display: flex;
  flex-direction: row;
  padding: 12px;
`;

const NetworkOption: FC<OptionProps<Network>> = ({ data, selectOption }) => (
  <SContainer onClick={() => selectOption(data)}>
    <Typography value={data.label} />
  </SContainer>
);

function NetworkSelectDropdown({
  network: networkId,
  accountType,
  onChange,
  showTooltip = false,
  disabled = false,
  ...props
}: Props) {
  const { networks, getNetworkById } = useContext(NetworkContext);

  // set default network if none selected
  useEffect(() => {
    if (!networkId) {
      onChange(DEFAULT_NETWORK);
    }
  }, []);

  // @ADD_ACCOUNT_@todo: The difference in accountType is likely causing
  // the absence of list.
  const validNetworks = networks
    // @ts-ignore CHANGE IN WALLETYPE OBJECT CAUSING accountType to error -> @todo: FIX accountType
    .filter((options) => isWalletFormatSupportedOnNetwork(options, accountType))
    .map((n) => ({ label: n.name, value: n }));
  const network = getNetworkById(networkId);

  return (
    <div {...props}>
      <label>
        {translate('SELECT_NETWORK_LABEL')}{' '}
        {showTooltip && <Tooltip tooltip={translate('NETWORK_TOOLTIP')} />}
      </label>
      <Dropdown<{ label: string; value: Network } & any>
        value={{ label: network.name }}
        options={validNetworks.sort()}
        placeholder={DEFAULT_NETWORK}
        searchable={true}
        onChange={(option) => onChange(option.value.id)}
        optionComponent={NetworkOption}
        valueComponent={({ value }) => (
          <SContainer>
            <Typography value={value.label} />
          </SContainer>
        )}
        disabled={disabled}
      />
    </div>
  );
}

export default NetworkSelectDropdown;
