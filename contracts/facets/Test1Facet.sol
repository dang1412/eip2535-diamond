// SPDX-License-Identifier: MIT
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
