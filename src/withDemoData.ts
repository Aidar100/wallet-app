import { AccountValue, ConfigOptions } from '@ironfish/sdk'
import noop from 'lodash/noop'
import AccountSettings from 'Types/AccountSettings'
import Contact from 'Types/Contact'
import IIronfishManager from 'Types/IronfishManager/IIronfishManager'
import {
  ProgressStatus,
  SnapshotManifest,
} from 'Types/IronfishManager/IIronfishSnapshotManager'
import { Payment } from 'Types/Transaction'
import IStorage from 'Types/IStorage'
import SortType from 'Types/SortType'

export const IronFishManager: IIronfishManager = {
  assets: {
    list: (s?: string, offset?: number, max?: number) =>
      window.DemoDataManager.assets.list(s, offset, max),
    get: (id: string) => window.DemoDataManager.assets.get(id),
    default: () => window.DemoDataManager.assets.default(),
  },
  accounts: {
    create: (name: string) => window.DemoDataManager.createAccount(name),
    prepareAccount: () => window.DemoDataManager.accounts.prepareAccount(),
    submitAccount: (createParams: AccountValue) =>
      window.DemoDataManager.accounts.submitAccount(createParams),
    delete: (name: string) => window.DemoDataManager.deleteAccount(name),
    export: async (id: string, encoded?: boolean, viewOnly?: boolean) => {
      const account = Object.assign(
        {},
        await window.DemoDataManager.accounts.findById(id)
      )
      delete account.id
      delete account.balances

      return JSON.stringify(account)
    },
    get: (id: string) => window.DemoDataManager.getAccount(id),
    import: (account: AccountValue) =>
      window.DemoDataManager.importAccount(account),
    importByMnemonic: (name: string, mnemonic: string) =>
      window.DemoDataManager.importByMnemonic(name, mnemonic),
    importByEncodedKey: (data: string) =>
      window.DemoDataManager.importByEncodedKey(data),
    list: (search: string, sort: SortType) =>
      window.DemoDataManager.getAccounts(search, sort),
    balance: (id: string, assetId?: string) =>
      window.DemoDataManager.getBalance(id),
    balances: (id: string) => window.DemoDataManager.accounts.balances(id),
    getMnemonicPhrase: (id: string) =>
      window.DemoDataManager.accounts.getMnemonicPhrase(id),
  },
  transactions: {
    averageFee: (numOfBlocks?) => {
      return Promise.resolve(BigInt(Math.round(Math.random() * 1000)))
    },
    estimateFeeWithPriority: (accountId: string, receive: Payment) =>
      window.DemoDataManager.transactions.estimateFeeWithPriority(
        accountId,
        receive
      ),
    fees: (numOfBlocks?) => {
      return Promise.resolve({
        startBlock: 0,
        endBlock: 100,
        p25: BigInt(250),
        p50: BigInt(500),
        p75: BigInt(750),
        p100: BigInt(1000),
      })
    },
    findByAccountId: (accountId, searchTerm?, sort?) => {
      return window.DemoDataManager.transactions.findByAccountId(
        accountId,
        searchTerm,
        sort
      )
    },
    findByAddress: (address, searchTerm?, sort?) => {
      return window.DemoDataManager.transactions.findByAddress(
        address,
        searchTerm,
        sort
      )
    },
    get: (hash, accountId) =>
      window.DemoDataManager.transactions.get(hash, accountId),
    send: (accountId, payment, transactionFee?) =>
      window.DemoDataManager.transactions.send(
        accountId,
        accountId,
        payment.publicAddress,
        payment.amount,
        payment.memo,
        transactionFee || BigInt(100),
        payment.assetId
      ),
  },
  snapshot: {
    checkPath: (manifest: SnapshotManifest, path?: string) =>
      Promise.resolve({ hasError: false, error: undefined }),
    start: (path?: string) => window.DemoDataManager.snapshot.start(path),
    apply: () => window.DemoDataManager.snapshot.apply(),
    retry: () => window.DemoDataManager.snapshot.retry(),
    manifest: () => window.DemoDataManager.snapshot.manifest(),
    status: () => window.DemoDataManager.snapshot.status(),
    reset: () => window.DemoDataManager.snapshot.reset(),
  },
  nodeSettings: {
    getConfig: () => window.DemoDataManager.nodeSettings.getConfig(),
    setValues: (values: Partial<ConfigOptions>) =>
      window.DemoDataManager.nodeSettings.setValues(values),
    save: () => window.DemoDataManager.nodeSettings.save(),
    clearConfig: () => window.DemoDataManager.nodeSettings.clearConfig(),
  },
  nodeStatus: () => window.DemoDataManager.getNodeStatus(),
  peers: () => window.DemoDataManager.getNodePeers(),
  hasAnyAccount: () => window.DemoDataManager.hasAnyAccount(),
  sync: () => window.DemoDataManager.node.sync(),
  stopSyncing: () => window.DemoDataManager.node.stopSyncing(),
  initialize: () => window.DemoDataManager.initialize(),
  chainProgress: () => window.DemoDataManager.node.chainProgress(),
  downloadChainSnapshot: (path: string) =>
    window.DemoDataManager.downloadSnapshot(path),
  start: () => window.DemoDataManager.start(),
  stop: () => window.DemoDataManager.stop(),
  status: () => window.DemoDataManager.initStatus(),
  getNodeConfig: () => window.DemoDataManager.getNodeConfig(),
  saveNodeConfig: (values: Partial<ConfigOptions>) =>
    window.DemoDataManager.saveNodeConfig(values),
}

export const AddressBookStorage: IStorage<Contact> = {
  add: (entity: Omit<Contact, '_id'>) =>
    window.DemoDataManager.addContact(entity.name, entity.address).then(
      identity => ({
        _id: identity,
        ...entity,
      })
    ),
  delete: (identity: string) =>
    window.DemoDataManager.deleteContact(identity).then(noop),
  find: (entity: Partial<Omit<Contact, '_id'>>) =>
    window.DemoDataManager.addressBook.find(entity).then(data =>
      data
        ? {
            _id: data.identity,
            ...data,
          }
        : null
    ),
  get: (identity: string) =>
    window.DemoDataManager.getContact(identity).then(contact => ({
      _id: contact.identity,
      ...contact,
    })),
  list: (searchTerm: string, sort: SortType) =>
    window.DemoDataManager.getAddressBook(searchTerm, sort).then(contacts =>
      contacts.map(contact => ({
        _id: contact.identity,
        ...contact,
      }))
    ),
  update: (identity: string, fieldsToUpdate: Partial<Omit<Contact, '_id'>>) =>
    window.DemoDataManager.updateContact(
      identity,
      fieldsToUpdate.name,
      fieldsToUpdate.address
    ).then(() => ({
      _id: identity,
      name: fieldsToUpdate.name,
      address: fieldsToUpdate.address,
    })),
}

export const AccountSettingsStorage: IStorage<AccountSettings> = {
  add: (entity: Omit<AccountSettings, '_id'>) =>
    window.DemoDataManager.getAccountSettings(entity.accountId).then(
      settings => ({
        _id: settings.accountId,
        ...settings,
      })
    ),
  delete: (identity: string) => Promise.resolve(),
  find: (entity: Partial<Omit<AccountSettings, '_id'>>) =>
    Promise.resolve(null),
  get: (identity: string) =>
    window.DemoDataManager.getAccountSettings(identity).then(settings => ({
      _id: settings.accountId,
      ...settings,
    })),
  list: (searchTerm: string, sort: SortType) => Promise.resolve([]),
  update: (
    identity: string,
    fieldsToUpdate: Partial<Omit<AccountSettings, '_id'>>
  ) =>
    window.DemoDataManager.updateAccountSettings(
      identity,
      fieldsToUpdate.currency
    ).then(() => ({
      _id: identity,
      accountId: identity,
      currency: fieldsToUpdate.currency,
    })),
}
