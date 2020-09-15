const EXPLORER_DOMAIN = 'etherscan.io'

export default class Link {
  address (addr, { network = 'mainnet' } = {}) {
    const subdomain = network === 'mainnet' ? '' : `${network}.`
    return `https://${subdomain}${EXPLORER_DOMAIN}/address/${addr}`
  }

  transaction (txHash, { network = 'mainnet' } = {}) {
    const subdomain = network === 'mainnet' ? '' : `${network}.`
    return `https://${subdomain}${EXPLORER_DOMAIN}/tx/${txHash}`
  }
}
