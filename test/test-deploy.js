const { ethers } = require("hardhat"); 
const { expect, assert } = require("chai");

// 用 describe 方法描述测试内容
describe("SimpleStorage", function () {

  let SimpleStorageFactory, simpleStorage;

  // 测试执行前需要执行的操作，这里要先部署合约
  beforeEach(async function () {
    SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
    simpleStorage = await SimpleStorageFactory.deploy();
    await simpleStorage.deployed();
  })

  // 如果需要单独运行某一个测试，有两种方法: 
  // 1. 可以使用命令 yarn hardhat test -grep [pattern]，pattern 用于匹配测试的 
  //    `title` 部分，这样 hardhat 就只会执行满足匹配条件的测试
  // 2. 将唯一要执行的测试写在 it.only() 方法中，这样运行 yarn hardhat test 命令
  // 时，hardhat 只会运行这一个测试

  // 用 it() 方法描述测试过程·
  it("Should start with a favorite number of 0", async function () {
    const currentValue = await simpleStorage.retrieve();
    const expectedValue = "0";
    // 断言 currentValue 应该等于 expectedValue
    // 等价于 expect(currentValue.toString()).to.equal(expectedValue);
    assert.equal(currentValue.toString(), expectedValue);
  })

  it("Should update when we call store", async function () {
    const expectedValue = "7";
    const transactionResponse = await simpleStorage.store(expectedValue);
    const transactionReceipt = await transactionResponse.wait(1);
    const currentValue = await simpleStorage.retrieve();
    assert.equal(currentValue.toString(), expectedValue);
  })
  
})