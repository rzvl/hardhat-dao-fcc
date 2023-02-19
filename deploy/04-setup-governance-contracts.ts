import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { ethers } from "hardhat"
import { ADDRESS_ZERO } from "../helper-hardhat-config"

const setupContracts: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { getNamedAccounts, deployments } = hre
    const { log } = deployments
    const { deployer } = await getNamedAccounts()

    const timeLock = await ethers.getContract("TimeLock", deployer)
    const governor = await ethers.getContract("GovernorContract", deployer)

    log("Setting up roles...")

    const proposalRole = await timeLock.PROPOSER_ROLE()
    const executorRole = await timeLock.EXECUTOR_ROLE()
    const adminRole = await timeLock.TIMELOCK_ADMIN_ROLE()

    const proposeTx = await timeLock.grantRole(proposalRole, governor.address)
    await proposeTx.wait(1)
    const executorTx = await timeLock.grantRole(executorRole, ADDRESS_ZERO)
    await executorTx.wait(1)
    const revokeTx = await timeLock.revokeRole(adminRole, deployer)
    await revokeTx.wait(1)
}

export default setupContracts
setupContracts.tags = ["all", "setupcontracts"]
