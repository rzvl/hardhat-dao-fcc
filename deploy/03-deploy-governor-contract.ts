import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { QUORUM_PERCENTAGE, VOTING_DELAY, VOTING_PERIOD } from "../helper-hardhat-config"
import { ethers } from "hardhat"

const deployGovernorContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { getNamedAccounts, deployments } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    const governanceToken = await ethers.getContract("GovernanceToken")
    const timeLock = await ethers.getContract("TimeLock")

    const args = [
        governanceToken.address,
        timeLock.address,
        QUORUM_PERCENTAGE,
        VOTING_PERIOD,
        VOTING_DELAY,
    ]

    log("Deploying Governor Contract...")
    const governorContract = await deploy("GovernorContract", {
        from: deployer,
        args: args,
        log: true,
        // waitConfirmations:
    })
    log(`Deployed Governor Contract to address ${governorContract.address}`)
}

export default deployGovernorContract
deployGovernorContract.tags = ["all", "governancecontract"]
