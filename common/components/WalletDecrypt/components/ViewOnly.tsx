import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import translate, { translateRaw } from 'translations';
import { AddressOnlyWallet } from 'libs/wallet';
import { AppState } from 'features/reducers';
import * as selectors from 'features/selectors';
import { ICurrentTo } from 'features/types';
import { configSelectors } from 'features/config';
import { ensSelectors } from 'features/domainResolution/ens';
import { UnstoppableSelectors } from 'features/domainResolution/unstoppable';
import { AddressField } from 'components';
import './ViewOnly.scss';

interface OwnProps {
  onUnlock(param: any): void;
}

interface StateProps {
  isValidAddress: ReturnType<typeof configSelectors.getIsValidAddressFn>;
  currentAddress: ICurrentTo;
  resolvedAddress: ReturnType<typeof ensSelectors.getResolvedAddress>;
  unstoppableAddress: ReturnType<typeof UnstoppableSelectors.getResolvedAddress>;
}

type Props = OwnProps & StateProps;

interface State {
  addressFromBook: string;
}

class ViewOnlyDecryptClass extends PureComponent<Props, State> {
  public state: State = {
    addressFromBook: ''
  };

  public render() {
    const { isValidAddress, currentAddress, resolvedAddress, unstoppableAddress } = this.props;
    const { addressFromBook } = this.state;
    const isValid =
      isValidAddress(currentAddress.raw) ||
      (resolvedAddress && isValidAddress(resolvedAddress)) ||
      unstoppableAddress;
    return (
      <div className="ViewOnly">
        <form className="form-group" onSubmit={this.openWallet}>
          <section className="ViewOnly-fields">
            <section className="ViewOnly-fields-field">
              <AddressField
                value={addressFromBook}
                showInputLabel={false}
                showIdenticon={false}
                showEnsResolution={false}
                placeholder={translateRaw('SELECT_FROM_ADDRESS_BOOK')}
                onChangeOverride={this.handleSelectAddressFromBook}
                dropdownThreshold={0}
              />
            </section>
            <section className="ViewOnly-fields-field">
              <em>{translate('OR')}</em>
            </section>
            <section className="ViewOnly-fields-field">
              <AddressField
                showInputLabel={false}
                showIdenticon={false}
                placeholder={translateRaw('VIEW_ONLY_ENTER')}
                data-testid="view-only-input"
              />
              <button
                className="ViewOnly-submit btn btn-primary btn-block"
                disabled={!isValid}
                data-testid="view-only-button"
              >
                {translate('VIEW_ADDR')}
              </button>
            </section>
          </section>
        </form>
      </div>
    );
  }

  private handleSelectAddressFromBook = (ev: React.FormEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value: addressFromBook }
    } = ev;
    this.setState({ addressFromBook }, this.openWallet);
  };

  private openWallet = () => {
    const {
      isValidAddress,
      currentAddress,
      resolvedAddress,
      onUnlock,
      unstoppableAddress
    } = this.props;
    const { addressFromBook } = this.state;

    let wallet;

    if (isValidAddress(addressFromBook)) {
      wallet = addressFromBook;
    } else if (isValidAddress(currentAddress.raw)) {
      wallet = currentAddress.raw;
    } else if (resolvedAddress && isValidAddress(resolvedAddress)) {
      wallet = resolvedAddress;
    } else if (unstoppableAddress) {
      wallet = unstoppableAddress;
    }

    if (wallet) {
      onUnlock(new AddressOnlyWallet(wallet));
    }
  };
}

export const ViewOnlyDecrypt = connect(
  (state: AppState): StateProps => ({
    currentAddress: selectors.getCurrentTo(state),
    isValidAddress: configSelectors.getIsValidAddressFn(state),
    resolvedAddress: ensSelectors.getResolvedAddress(state),
    unstoppableAddress: UnstoppableSelectors.getResolvedAddress(state)
  })
)(ViewOnlyDecryptClass);
