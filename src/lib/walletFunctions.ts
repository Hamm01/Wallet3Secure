import { generateMnemonic, validateMnemonic, mnemonicToSeedSync } from 'bip39'
import { derivePath } from 'ed25519-hd-key'
import nacl from 'tweetnacl'
import bs58 from 'bs58'
import { ethers } from 'ethers'
import { WalletType, WalletCreateParams } from './types'
import { Keypair } from '@solana/web3.js'

const generateMnemonicWords = async (input: string) => {
  let mnemonicWords = input.trim()
  if (mnemonicWords.length !== 0) {
    if (!validateMnemonic(mnemonicWords)) {
      console.error('Phrase inputs are wrong to restore the wallet')
      return
    } else {
      return mnemonicWords.split(' ')
    }
  } else {
    mnemonicWords = await generateMnemonic()
  }

  return mnemonicWords.split(' ')
}

const createMemonicWallet = ({
  mnemonic,
  pathTypes,
  index
}: WalletCreateParams): WalletType | null => {
  /*
   Below function is used for solana and ethereum keys to generate 
   depending on user input and 
   1. Creating the Seed from mnemonic and making a path using specific blockchain and index for wallet
   2. Derived seed using the path and seed
   3. this Derived seed will use to create the private keys for the ethereum or solana
  */

  let pubKey
  let privKey
  const seed = mnemonicToSeedSync(mnemonic)
  const path = `m/44'/${pathTypes}'/${index}'/0'` // This is the derivation path
  const derivedSeed = derivePath(path, seed.toString('hex')).key

  if (pathTypes === '501') {
    // Generating Solana keys
    const { secretKey } = nacl.sign.keyPair.fromSeed(derivedSeed)
    const keypair = Keypair.fromSecretKey(secretKey)
    // Both private and public keys are encoded
    privKey = bs58.encode(secretKey)
    pubKey = keypair.publicKey.toBase58()
  } else if (pathTypes === '60') {
    //Generating the Ethereum keys
    privKey = Buffer.from(derivedSeed).toString('hex')
    const wallet = new ethers.Wallet(privKey)
    pubKey = wallet.address
    // Both private and public keys are encoded
  } else {
    return null
  }
  return {
    publicKey: pubKey,
    privateKey: privKey,
    mnemonic,
    path
  }
}

export { generateMnemonicWords, createMemonicWallet }
