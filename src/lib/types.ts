export interface WalletType {
  publicKey: String
  privateKey: string
  mnemonic: string
  path: string
}

export type WalletCreateParams = {
  mnemonic: string
  pathTypes: string
  index: number
}
