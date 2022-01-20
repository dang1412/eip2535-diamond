# EIP2535 Diamond

This sample implementation is originally based on Nick Mudgen's [diamon-1-hardhat](https://github.com/mudgen/diamond-1-hardhat) implementation but uses Typescript and goes into further detail about how to deploy, initialize and upgrade.

## LibAppStorage

Adding `contracts/libraries/LibAppStorage.sol`, gathering all variables used by all facets in a struct in one place

```solidity
pragma solidity ^0.8.0;

struct AppStorage {
    uint256 x;
    uint256 y;
}
```

Used in `Test1Facet`

```solidity
pragma solidity ^0.8.0;

import { AppStorage } from "../libraries/LibAppStorage.sol";

contract Test1Facet {
    event TestEvent(address something);

    AppStorage s;

    function test1Func1() external {}

    function changeX() external {
        s.x += 1;
    }

    function getX() external view returns (uint256) {
        return s.x;
    }
}
```

## Scripts

Providing 2 Typescript functions for deploy and upgrade:

`scripts/deploy/deployDiamond.ts`

```ts
/**
 *  @param facetNames: facetNames to be deployed beside 'DiamondCutFacet' 'DiamondLoupeFacet' 'OwnershipFacet', all selectors will be 'add'
 *  @param init: init function to be invoked in DiamondInit contract
 *  @return Diamond contract address
 */
export async function deployDiamond(facetNames: string[], init = ''): Promise<string>
```

`scripts/deploy/upgradeDiamond.ts`

```ts
/**
 *  @param diamonAddress: deployed diamond address
 *  @param facetNames: facetNames to be upgraded, selectors:
 *    - non-exists: will be 'add'
 *    - exists: will be 'replace'
 *  @param init: init function to be invoked in DiamondInit contract
 *  @return none
 */
export async function upgradeDiamond(diamonAddress: string, facetNames: string[], init = ''): Promise<string>
```

Check usage sample in `test/index.ts`.
