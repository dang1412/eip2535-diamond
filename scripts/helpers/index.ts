import { ethers } from "hardhat"
import { BytesLike, Contract } from "ethers"

export enum FacetCutAction {
  Add = 0,
  Replace = 1,
  Remove = 2
}

export interface DiamondCut {
  facetAddress: string
  action: FacetCutAction
  functionSelectors: BytesLike[]
}

// deploy
export async function deployFacet(facetName: string): Promise<Contract> {
  const Facet = await ethers.getContractFactory(facetName)
  const facet = await Facet.deploy()
  return facet.deployed()
}

// new Cut (Add)
export async function getCutAdd(facet: Contract): Promise<DiamondCut> {
  return {
    facetAddress: facet.address,
    action: FacetCutAction.Add,
    functionSelectors: getSelectors(facet),
  }
}

// update Cut (Add & Replace)
// need diamondLoupeFacet deployed
export async function getCutUpdate(diamondAddr: string, facet: Contract): Promise<DiamondCut[]> {
  // Loupe instance
  const diamondLoupe = await ethers.getContractAt('IDiamondLoupe', diamondAddr)

  const selectors = getSelectors(facet)
  const addSelectors: string[] = []
  const replaceSelectors: string[] = []

  // separate into Add and Replace
  for (const selector of selectors) {
    const addr = await diamondLoupe.facetAddress(selector)
    if (addr === ethers.constants.AddressZero) {
      // new
      addSelectors.push(selector)
    } else {
      // replace
      replaceSelectors.push(selector)
    }
  }

  const facetAddress = facet.address
  const cut: DiamondCut[] = [{
    facetAddress,
    action: FacetCutAction.Add,
    functionSelectors: addSelectors,
  }]

  if (replaceSelectors.length > 0) {
    cut.push({
      facetAddress,
      action: FacetCutAction.Replace,
      functionSelectors: replaceSelectors,
    })
  }

  return cut
}

// get function selectors from ABI
function getSelectors (contract: Contract): string[] {
  const signatures = Object.keys(contract.interface.functions)
  console.log('signatures:', signatures)
  const selectors = signatures.reduce((acc: string[], val) => {
    // not register function init
    if (!val.startsWith('init')) {
      acc.push(contract.interface.getSighash(val))
    }
    return acc
  }, [])

  return selectors
}

// get function selector from function signature
function getSelector (func: string): string {
  const abiInterface = new ethers.utils.Interface([func])
  return abiInterface.getSighash(ethers.utils.Fragment.from(func))
}
