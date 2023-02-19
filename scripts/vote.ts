import { mine } from "@nomicfoundation/hardhat-network-helpers"
import { readFileSync } from "fs"
import { ethers, network } from "hardhat"
import { developmentChains, proposalsFile, VOTING_PERIOD } from "../helper-hardhat-config"

const index = 0

async function main(proposalIndex: number) {
    const proposals = JSON.parse(readFileSync(proposalsFile, "utf-8"))
    const proposalId = proposals[network.config.chainId!.toString()][proposalIndex]
    const voteWay = 1
    const governor = await ethers.getContract("GovernorContract")
    const reason = "I like a do da cha"

    const voteTxResponse = await governor.castVoteWithReason(proposalId, voteWay, reason)
    await voteTxResponse.wait(1)

    if (developmentChains.includes(network.name)) {
        console.log("Moving Blocks...")
        await mine(VOTING_PERIOD + 1)
    }
    console.log("Voted! Ready to go!")
}

main(index).catch((error) => {
    console.error(error)
    process.exitCode = 1
})
