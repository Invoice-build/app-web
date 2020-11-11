import Base from './base'

export default class Account extends Base {
  async fetch () {
    const [account] = await window.ethereum.enable()
    this.current = account
    return account
  }

  async isLoggedIn () {
    const accounts = await this.web3.eth.getAccounts()
    return accounts.length === 0
  }
}
