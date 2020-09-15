export default class Account {
  constructor ({ web3 }) {
    this.web3 = web3
  }

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
