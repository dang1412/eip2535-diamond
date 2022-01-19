import { ethers } from "hardhat"
import { getCutAdd, DiamondCut, deployFacet } from "../helpers"
import { executeCut } from "./_executeCut"

export async function deployDiamond(facetNames: string[], init = ''): Promise<string> {
  // get owner account
  const accounts = await ethers.getSigners()
  const contractOwner = accounts[0]

  // deploy DiamondCutFacet
  const diamondCutFacet = await deployFacet('DiamondCutFacet')
  console.log('DiamondCutFacet deployed:', diamondCutFacet.address)

  // deploy Diamond
  const Diamond = await ethers.getContractFactory('Diamond')
  const diamond = await Diamond.deploy(contractOwner.address, diamondCutFacet.address)
  await diamond.deployed()
  console.log('Diamond deployed:', diamond.address)

  // deploy facets
  console.log('')
  console.log('Deploying facets')
  const FacetNames = [
    'DiamondLoupeFacet',
    'OwnershipFacet',
    ...facetNames
  ]
  const cut: DiamondCut[] = []
  for (const FacetName of FacetNames) {
    const facet = await deployFacet(FacetName)
    console.log(`${FacetName} deployed: ${facet.address}`)

    const newCut = await getCutAdd(facet)
    cut.push(newCut)
  }

  // upgrade diamond with facets
  await executeCut(diamond.address, cut, init)

  return diamond.address
}
