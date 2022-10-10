const { ethers, run, network } = require("hardhat");

async function main() 
{
  // * 在hardhat 上部署合约
  // Hardhat 为我们内置了 blockchain，我们可以不需要指定钱包和 RPC 直接将合约部署到这个网
  // 络上，如果我们想要连接其他 blockchain，例如 goerli，首先要在 hardhat.config.js 中的
  // module.export 中添加并配置 networks 属性（详见 hardhat.config.js），然后使用
  // yarn hardhat run scripts/deploy.js --network goerli 来指定使用 goerli 网络
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
  console.log("Deploying contract ...");
  // 发送 transaction
  const simpleStorage = await SimpleStorageFactory.deploy();
  // transaction 完成
  await simpleStorage.deployed();
  console.log(`Deployed contract to ${simpleStorage.address}`);
  // console.log(network.config);

  // * 使用 hardhat 验证合约
  // 仅当在 goerli 网络上且环境变量中配置了 ETHERSCAN_API_KEY 时才进行 verify
  if (network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) {
    console.log("Waiting for block txes ...");
    await simpleStorage.deployTransaction.wait(6);
    await verify(simpleStorage.address, []);
  }

  // * 使用 hardhat 与合约交互
  // 调用 retrieve() 方法
  const currentValue = await simpleStorage.retrieve();
  console.log(`The current value is ${currentValue}`);
  // 调用 store() 方法
  const transactionResponse = await simpleStorage.store(7);
  await transactionResponse.wait(1);
  const updatedValue = await simpleStorage.retrieve();
  console.log(`The updated value is ${updatedValue}`);
}

async function verify(contractAddress, args) 
{
  console.log("Verifying contract ...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArgs: args,
    });
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already Verified!");
    } else {
      console.log(e);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
