import { generateMnemonic, validateMnemonic, mnemonicToSeedSync } from 'bip39'
import { derivePath } from 'ed25519-hd-key'
import nacl from 'tweetnacl'
import bs58 from 'bs58'
import { ethers } from 'ethers'
import { HDKey } from 'ethereum-cryptography/hdkey'
import { WalletType, WalletCreateParams } from './types'
import { Keypair, Connection, PublicKey } from '@solana/web3.js'
const EthAlchemyUrl = import.meta.env.VITE_ETH_ALCHEMY_URL // This variable is saved in .env file
const SolAlchemyUrl = import.meta.env.VITE_SOL_ALCHEMY_URL // This variable is saved in .env file

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

  if (pathTypes === '501') {
    const path = `m/44'/${pathTypes}'/${index}'/0'` // This is the derivation path
    // Generating Solana keys
    const derivedSeed = derivePath(path, seed.toString('hex')).key
    const { secretKey } = nacl.sign.keyPair.fromSeed(derivedSeed)
    const keypair = Keypair.fromSecretKey(secretKey)
    // Both private and public keys are encoded
    privKey = bs58.encode(secretKey)
    pubKey = keypair.publicKey.toBase58()
    return {
      publicKey: pubKey,
      privateKey: privKey,
      mnemonic,
      path
    }
  } else if (pathTypes === '60') {
    //Generating the Ethereum keys
    const path = `m/44'/${pathTypes}'/0'/0/${index}`
    const hdkey = HDKey.fromMasterSeed(seed)
    const derivedNode = hdkey.derive(path)
    const derivedSeed = derivedNode.privateKey
    privKey = Buffer.from(derivedSeed!).toString('hex')
    const wallet = new ethers.Wallet(privKey)
    pubKey = wallet.address
    // Both private and public keys are encoded
    return {
      publicKey: pubKey,
      privateKey: privKey,
      mnemonic,
      path
    }
  } else {
    return null
  }
}

type localStorageParams = {
  wallets: WalletType[]
  mnemonics: string[]
  pathTypes: string[]
}

const fetchBalance = async (address: string, type: string) => {
  try {
    if (type === 'Ethereum') {
      const provider = new ethers.JsonRpcProvider(EthAlchemyUrl)
      const weiBalance = await provider.getBalance(address)
      const ethBalance = ethers.formatEther(weiBalance)
      return parseFloat(ethBalance.split(' ')[0])
    } else if (type === 'Solana') {
      const connection = new Connection(SolAlchemyUrl)
      const publicKey = new PublicKey(address)
      const accountInfo = await connection.getAccountInfo(publicKey)
      if (accountInfo) {
        const balanceInlamports = accountInfo.lamports
        const balanceInSols = balanceInlamports / 1_000_000_000
        return balanceInSols
      } else {
        console.error('Account not Found for solana blockchain')
      }
    } else {
      throw Error
    }
  } catch (error) {
    console.error('Error in retreiving Balance')
  }
}

const saveWalletKeys = ({
  wallets,
  mnemonics,
  pathTypes
}: localStorageParams) => {
  localStorage.setItem('wallet', JSON.stringify(wallets))
  localStorage.setItem('mnemonics', JSON.stringify(mnemonics))
  localStorage.setItem('pathTypes', JSON.stringify(pathTypes))
}

const fetchWallet = (): localStorageParams | null => {
  const localWallet = localStorage.getItem('wallet')
  const localMemonics = localStorage.getItem('mnemonics')
  const localpathTypes = localStorage.getItem('pathTypes')
  if (localWallet && localMemonics && localpathTypes) {
    const wallets = JSON.parse(localWallet)
    const mnemonics = JSON.parse(localMemonics)
    const pathTypes = JSON.parse(localpathTypes)
    return { wallets, mnemonics, pathTypes }
  } else {
    console.log('No previous saved Wallet found on Browser')
    return null
  }
}

const clearWalletsKeys = () => {
  try {
    localStorage.removeItem('wallet')
    localStorage.removeItem('mnemonics')
    localStorage.removeItem('pathTypes')
    return true
  } catch (e) {
    throw Error('Deleteion error')
  }
}

export {
  generateMnemonicWords,
  createMemonicWallet,
  fetchBalance,
  saveWalletKeys,
  fetchWallet,
  clearWalletsKeys
}
