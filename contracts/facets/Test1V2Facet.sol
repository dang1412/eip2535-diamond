// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { AppStorage } from "../libraries/LibAppStorage.sol";

contract Test1V2Facet {
    event TestEvent(address something);

    AppStorage s;

    function test1Func1() external {}

    function changeX() external {
        s.x += 10;
    }

    function getX() external view returns (uint256) {
        return s.x;
    }

    function changeY() external {
        s.y += 20;
    }

    function getY() external view returns (uint256) {
        return s.y;
    }
}
