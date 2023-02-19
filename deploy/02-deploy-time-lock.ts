import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { MIN_DELAY } from "../helper-hardhat-config"

const deployTimeLock: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { getNamedAccounts, deployments } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    log("Deploying Time Lock...")
    const timeLock = await deploy("TimeLock", {
        from: deployer,
        args: [MIN_DELAY, [], [], deployer],
        log: true,
        // waitConfirmations:
    })
    log(`Deployed Time Lock to address ${timeLock.address}`)
}

export default deployTimeLock
deployTimeLock.tags = ["all", "timelock"]
