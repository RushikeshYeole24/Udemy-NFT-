// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Migrations {
  address public immutable owner; // Owner is immutable after deployment
  uint public last_completed_migration;

  // Constructor to initialize the owner
  constructor() {
    owner = msg.sender;
  }

  // Modifier to restrict access to the owner
  modifier restricted() {
    require(
      msg.sender == owner,
      "This function is restricted to the contract's owner"
    );
    _;
  }

  // Function to set the last completed migration, restricted to the owner
  function setCompleted(uint completed) public restricted {
    last_completed_migration = completed;
  }
}
