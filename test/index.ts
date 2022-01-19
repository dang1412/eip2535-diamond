import { expect } from "chai"
import { ethers } from "hardhat"

import { deployDiamond, upgradeDiamond } from '../scripts/deploy'

describe("Diamond", () => {
  it("Should deploy and upgrade", async () => {
    const diamondAddress = await deployDiamond(['Test1Facet', 'Test2Facet'], 'init')

    const test1Facet = await ethers.getContractAt('Test1Facet', diamondAddress)
    expect(await test1Facet.getX()).to.equal(100)

    // x: 100 => 101
    await test1Facet.changeX()
    expect(await test1Facet.getX()).to.equal(101)

    // upgrade
    await upgradeDiamond(diamondAddress, ['Test1V2Facet'], 'init2')
    const test1V2Facet = await ethers.getContractAt('Test1V2Facet', diamondAddress)
    expect(await test1V2Facet.getY()).to.equal(200)

    // x: 101 => 111
    await test1Facet.changeX()
    expect(await test1Facet.getX()).to.equal(111)
  })
})
