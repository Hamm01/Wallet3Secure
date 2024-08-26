export interface WalletType {
  publicKey: string
  privateKey: string
  mnemonic: string
  path: string
}

export type WalletCreateParams = {
  mnemonic: string
  pathTypes: string
  index: number
}
