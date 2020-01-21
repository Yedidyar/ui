import React, { Component } from 'react';
import styled from 'styled-components';
import uuid from 'uuid/v4';
import { Archive, Entry } from 'buttercup/dist/buttercup-web.min.js';
import '@buttercup/app-env/web';
import { ThemeProvider } from 'styled-components';
import {
  FIELD_VALUE_TYPE_OTP,
  consumeArchiveFacade,
  createArchiveFacade
} from '@buttercup/facades';
import { VaultProvider, VaultUI, themes } from '../src/index';

function createArchive() {
  const archive = Archive.createWithDefaults();
  const [general] = archive.findGroupsByTitle('General');
  general
    .createEntry('Home wi-fi')
    .setProperty('username', 'somehow')
    .setProperty('password', 'idsfio49v-1')
    .setProperty('password', 'h78.dI2m;110')
    .setProperty('password', '[5LC-j_"C7b;"nbn')
    .setProperty('password', '8rE7=Xkm<z5~b/[Q')
    .setProperty('password', 'ReGKd4H5?D5;=y~D')
    .setProperty('password', 'f>ZSh-,!Ly7Hrd&:Cv^@~,d')
    .setProperty('password', '7#eELw%GS^)/"')
    .setProperty('password', 'K3"J8JSKHk|5hwks_^')
    .setProperty('password', 'x8v@mId01')
    .setProperty('url', 'https://google.com');
  general
    .createEntry('Social')
    .setProperty('title', 'Social website')
    .setProperty('username', 'user@test.com')
    .setProperty('password', 'vdfs867sd5')
    .setProperty(
      'otpURI',
      'otpauth://totp/ACME:AzureDiamond?issuer=ACME&secret=NB2W45DFOIZA&algorithm=SHA1&digits=6&period=30'
    )
    .setProperty(
      'otpURL',
      'otpauth://totp/ACME%20Co:john.doe@email.com?secret=HXDMVJECJJWSRB3HWIZR4IFUGFTMXBOZ&issuer=ACME%20Co&algorithm=SHA1&digits=6&period=30'
    )
    .setAttribute(`${Entry.Attributes.FieldTypePrefix}otpURI`, FIELD_VALUE_TYPE_OTP)
    .setProperty('url', 'https://site.com/setup/create-account.php?token=123')
    .setProperty('url', 'https://site.com/login.php')
    .setProperty('url', 'https://site.com')
    .setProperty('Recovery pin', '1234');
  general
    .createEntry('Gate lock combination')
    .setProperty('username', 'test')
    .setProperty('password', '4812')
    .setProperty('password', 'passw0rd');
  const notes = archive.createGroup('Notes');
  notes
    .createEntry('Meeting notes 2019-02-01')
    .setAttribute(Entry.Attributes.FacadeType, 'note')
    .setProperty(
      'note',
      'Team meeting\n\n - Cool item created\n   - To be released sometime\n   - Costs $$$\n - Bug found, oh noes\n   - Fire Tim\n   - Bye Tim!\n - Success ✌️\n\nAll done.\n'
    );
  notes.createGroup('Meetings');
  const personal = notes.createGroup('Personal');
  personal.createGroup('Test');
  return archive;
}

function processVaultUpdate(archive, facade) {
  consumeArchiveFacade(archive, facade);
  const out = createArchiveFacade(archive);
  return out;
}

const View = styled.div`
  height: calc(100vh - 1rem);
  width: 100%;
`;

export default class VaultStory extends Component {
  constructor(...args) {
    super(...args);
    const archive = createArchive();
    this.state = {
      archive,
      facade: createArchiveFacade(archive)
    };
  }

  render() {
    return (
      <ThemeProvider theme={themes.light}>
        <View>
          <VaultProvider
            vault={this.state.facade}
            onUpdate={vault => {
              console.log('Saving vault...');
              this.setState({ facade: processVaultUpdate(this.state.archive, vault) });
            }}
          >
            <VaultUI />
          </VaultProvider>
        </View>
      </ThemeProvider>
    );
  }
}
