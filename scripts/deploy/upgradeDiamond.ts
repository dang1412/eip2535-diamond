import { DiamondCut, deployFacet, getCutUpdate } from "../helpers"
import { executeCut } from "./_executeCut"

export async function upgradeDiamond(diamonAddress: string, facetNames: string[], init = ''): Promise<void> {
  // get cut using getCutUpdate
  // - function exist: replace
  // - function not exist: add
  const cut: DiamondCut[] = []
  for (const facetName of facetNames) {
    const facet = await deployFacet(facetName)
    console.log(`${facetName} deployed: ${facet.address}`)

    const newCut = await getCutUpdate(diamonAddress, facet)
    cut.push(...newCut)
  }

  // upgrade diamond with facets
  await executeCut(diamonAddress, cut, init)
}
