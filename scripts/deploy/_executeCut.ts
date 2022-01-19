import { ethers } from "hardhat"
import { DiamondCut, deployFacet } from "../helpers"

const DIAMOND_INIT = 'DiamondInit'

export async function executeCut(diamonAddress: string, cut: DiamondCut[], init = ''): Promise<void> {
  console.log('')
  console.log('Diamond Cut:', cut)
  const diamondCut = await ethers.getContractAt('IDiamondCut', diamonAddress)
  let tx
  let receipt
  // call to init function
  if (init) {
    const diamondInit = await deployFacet(DIAMOND_INIT)
    let functionCall = diamondInit.interface.encodeFunctionData(init)
    tx = await diamondCut.diamondCut(cut, diamondInit.address, functionCall)
  } else {
    tx = await diamondCut.diamondCut(cut, ethers.constants.AddressZero, [])
  }
  console.log('Diamond cut tx: ', tx.hash)
  receipt = await tx.wait()
  if (!receipt.status) {
    throw Error(`Diamond upgrade failed: ${tx.hash}`)
  }
  console.log('Completed diamond cut')
}
