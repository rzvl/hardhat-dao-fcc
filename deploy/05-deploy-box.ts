import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { ethers } from "hardhat"

const deployBox: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { getNamedAccounts, deployments } = hre
    const { deployer } = await getNamedAccounts()
    const { deploy, log } = deployments

    log("Deploying Box...")
    const box = await deploy("Box", {
        from: deployer,
        args: [],
        log: true,
    })

    const timeLock = await ethers.getContract("TimeLock")
    const boxContract = await ethers.getContractAt("Box", box.address)
    const transferOwnerTx = await boxContract.transferOwnership(timeLock.address)
    await transferOwnerTx.wait(1)

    log("YOU DONE IT!")
}

export default deployBox
deployBox.tags = ["all", "deploybox"]
