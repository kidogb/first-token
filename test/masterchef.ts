import { expect } from 'chai';
import { Contract } from 'ethers';
import hre, { ethers } from 'hardhat';


describe('masterchef', () => {
    let lpContract: Contract
    let rdxContract: Contract
    let masterchefContract: Contract

    beforeEach(async () => {
        const rdxPerBlock = 1; // in decimals
        const startBlock = 0;

        const lp = await ethers.getContractFactory('Token')
        lpContract = await lp.deploy("LP", "LP")

        const rdx = await ethers.getContractFactory('RDX')
        rdxContract = await rdx.deploy()

        const masterchef = await ethers.getContractFactory('MyMasterchef')
        masterchefContract = await masterchef.deploy(lpContract.address, rdxPerBlock, startBlock)
    })

    it('deposit token and check reward', async () => {
        const [owner, user1] = await ethers.getSigners()
        // mint lp token
        await lpContract.mintFrom(owner.address, ethers.utils.parseEther("1000"))
        await lpContract.mintFrom(user1.address, ethers.utils.parseEther("1000"))
        // add a pool to Masterchef
        await masterchefContract.add(1, lpContract.address)
        // transfer RDX to Masterchef
        await rdxContract.connect(owner).transfer(masterchefContract.address, ethers.utils.parseEther("1000"));
        // approve and deposit lp token
        await lpContract.connect(owner).approve(masterchefContract.address, ethers.utils.parseEther("100"))
        await lpContract.connect(user1).approve(masterchefContract.address, ethers.utils.parseEther("100"))
        await masterchefContract.connect(owner).deposit(0, ethers.utils.parseEther("9"))
        await masterchefContract.connect(user1).deposit(0, ethers.utils.parseEther("1"))
        // verify pool balance
        const lpPool = await lpContract.balanceOf(masterchefContract.address)
        expect(lpPool).to.equal(ethers.utils.parseEther("10"))

        // wait for 10 block       
        await hre.network.provider.send("hardhat_mine", ["0xA"]);
        const ownerRdxRewards = await masterchefContract.connect(owner).pendingRdx(0, owner.address)
        const user1RdxRewards = await masterchefContract.connect(user1).pendingRdx(0, user1.address)
        expect(ownerRdxRewards).to.equal(ethers.utils.parseUnits("9.999999999999", 18))
        expect(user1RdxRewards).to.equal(ethers.utils.parseUnits("1.0"))


    })

    it('deposit token twice and check reward', async () => {
        const [owner] = await ethers.getSigners()
        // mint lp token
        await lpContract.mintFrom(owner.address, ethers.utils.parseEther("1000"))
        // add a pool to Masterchef
        await masterchefContract.add(1, lpContract.address)
        // transfer RDX to Masterchef
        await rdxContract.connect(owner).transfer(masterchefContract.address, ethers.utils.parseEther("1000"));
        // approve and deposit lp token
        await lpContract.connect(owner).approve(masterchefContract.address, ethers.utils.parseEther("100"))
        await masterchefContract.connect(owner).deposit(0, ethers.utils.parseEther("10"))
        // const d1 = await hre.ethers.provider.getBlock("latest")
        // wait for 10 block       
        await hre.network.provider.send("hardhat_mine", ["0xA"])
        // const d2 = await hre.ethers.provider.getBlock("latest")
        // deposit lp token
        await masterchefContract.connect(owner).deposit(0, ethers.utils.parseEther("10"))
        // const d3 = await hre.ethers.provider.getBlock("latest")
        // console.log(d1.number, d2.number, d3.number)
        // check the rewards
        const rdxRewards = await masterchefContract.connect(owner).pendingRdx(0, owner.address)
        // console.log(ethers.utils.formatEther(rdxRewards));
        expect(rdxRewards).to.equal(ethers.utils.parseEther("11").toString())

    })

    it('deposit token and withdraw', async () => {
        const [owner, addr1, addr2] = await ethers.getSigners()
        // mint lp token
        await lpContract.mintFrom(owner.address, ethers.utils.parseEther("1000"))
        // add a pool to Masterchef
        await masterchefContract.add(1, lpContract.address)
        // transfer RDX to Masterchef
        await rdxContract.connect(owner).transfer(masterchefContract.address, ethers.utils.parseEther("1000"));
        // approve and deposit lp token to pool
        await lpContract.connect(owner).approve(masterchefContract.address, ethers.utils.parseEther("100"))
        await masterchefContract.connect(owner).deposit(0, ethers.utils.parseEther("10"))
        // withdraw lp token from pool
        await masterchefContract.connect(owner).withdraw(0, ethers.utils.parseEther("5"))
        const userInfo = await masterchefContract.connect(owner).userInfo(0, owner.address)
        expect(userInfo.amount).to.equal(ethers.utils.parseEther("5").toString())
    })

    it.skip('deposit token and claim', async () => {
        const [owner] = await ethers.getSigners()
        // mint lp token
        await lpContract.mintFrom(owner.address, ethers.utils.parseEther("1000"))
        // add a pool to Masterchef
        await masterchefContract.add(1, lpContract.address)
        // transfer RDX to Masterchef
        await rdxContract.connect(owner).transfer(masterchefContract.address, ethers.utils.parseEther("1000"))
        expect(await rdxContract.balanceOf(masterchefContract.address)).to.equal(ethers.utils.parseEther("1000"))
        // approve and deposit lp token to pool
        await lpContract.connect(owner).approve(masterchefContract.address, ethers.utils.parseEther("100"))
        await masterchefContract.connect(owner).deposit(0, ethers.utils.parseEther("10"))
        // wait for 10 block       
        await hre.network.provider.send("hardhat_mine", ["0xA"])
        // claim lp token from pool
        const rdxOwnerBeforeClaim = await rdxContract.balanceOf(owner.address)
        const userInfo0 = await masterchefContract.userInfo(0, owner.address)
        console.log("Before: ", ethers.utils.formatEther(userInfo0.reward).toString())
        const rdxRewards = await masterchefContract.connect(owner).pendingRdx(0, owner.address)
        await masterchefContract.connect(owner).claimPendingRdx(0, rdxRewards)
        const userInfo1 = await masterchefContract.userInfo(0, owner.address)
        console.log("After: ", ethers.utils.formatEther(userInfo1.reward).toString())
        const rdxOwnerAfterClaim = await rdxContract.balanceOf(owner.address)
        console.log(ethers.utils.formatEther(rdxOwnerBeforeClaim), ethers.utils.formatEther(rdxOwnerAfterClaim), ethers.utils.formatEther(rdxRewards.div(2)))
        // expect(rdxOwnerAfterClaim - rdxOwnerBeforeClaim).to.equal(rdxRewards)
    })

});



