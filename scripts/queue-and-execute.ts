import { mine, time } from "@nomicfoundation/hardhat-network-helpers"
import { ethers, network } from "hardhat"
import {
    NEW_STORE_VALUE,
    FUNC,
    MIN_DELAY,
    proposalDescription,
    developmentChains,
} from "../helper-hardhat-config"

async function queueAndExecute() {
    const args = [NEW_STORE_VALUE]
    const functionToCall = FUNC
    const box = await ethers.getContract("Box")
    const encodedFunctionCall = box.interface.encodeFunctionData(functionToCall, args)
    const descriptionHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(proposalDescription))

    const governer = await ethers.getContract("GovernorContract")
    console.log("Queueing...")
    const queueTx = await governer.queue([box.address], [0], [encodedFunctionCall], descriptionHash)
    await queueTx.wait(1)

    if (developmentChains.includes(network.name)) {
        await time.increase(MIN_DELAY + 1)
        console.log(`Moved forward ${MIN_DELAY + 1} seconds!`)
        await mine(1)
        console.log("Moved 1 block forward!")
    }

    console.log("Executing...")
    const executeTx = await governer.execute(
        [box.address],
        [0],
        [encodedFunctionCall],
        descriptionHash
    )
    await executeTx.wait(1)

    const boxNewValue = await box.retrieve()
    console.log(`Box new value: ${boxNewValue.toString()}`)
}

queueAndExecute().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
