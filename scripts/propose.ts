import { ethers, network } from "hardhat"
import {
    NEW_STORE_VALUE,
    FUNC,
    proposalDescription,
    VOTING_DELAY,
    developmentChains,
    proposalsFile,
} from "../helper-hardhat-config"
import { mine } from "@nomicfoundation/hardhat-network-helpers"
import fs from "fs"

async function propose(functionCall: string, args: any[]) {
    const governer = await ethers.getContract("GovernorContract")
    const box = await ethers.getContract("Box")
    const encodedFunctionCall = box.interface.encodeFunctionData(functionCall, args)
    console.log(`Proposing ${functionCall} on ${box.address} with ${args}`)

    const proposeTx = await governer.propose(
        [box.address],
        [0],
        [encodedFunctionCall],
        proposalDescription
    )
    const proposalReceipt = await proposeTx.wait(1)
    const proposalId = proposalReceipt.events[0].args.proposalId
    console.log(`Proposed with proposal ID:\n  ${proposalId}`)

    if (developmentChains.includes(network.name)) {
        await mine(VOTING_DELAY + 1)
        console.log(`Moved ${VOTING_DELAY + 1} blocks!`)
    }

    let proposals: any = JSON.parse(fs.readFileSync(proposalsFile, "utf-8"))
    const chainId = network.config.chainId!.toString()
    proposals[chainId].push(proposalId.toString())
    fs.writeFileSync(proposalsFile, JSON.stringify(proposals), "utf8")
}

propose(FUNC, [NEW_STORE_VALUE])
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
