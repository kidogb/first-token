import { expect } from 'chai';
import { Contract } from 'ethers';
import hre, { ethers } from 'hardhat';


describe('masterchef', () => {
    let kcpContract: Contract
    let rdxContract: Contract
    let masterchefContract: Contract

    beforeEach(async () => {
        const rdxPerBlock = 1; // in decimals
        const startBlock = 0;

        const kcp = await ethers.getContractFactory('KCP')
        kcpContract = await kcp.deploy()

        const rdx = await ethers.getContractFactory('RDX')
        rdxContract = await rdx.deploy()

        const masterchef = await ethers.getContractFactory('MyMasterchef')
        masterchefContract = await masterchef.deploy(kcpContract.address, rdxPerBlock, startBlock)
    })

    it('deposit token and check reward', async () => {
        const [owner, addr1, addr2] = await ethers.getSigners()
        // mint kcp token
        await kcpContract.mintToken(owner.address, ethers.utils.parseEther("1000"))
        // add a pool to Masterchef
        await masterchefContract.add(1, kcpContract.address)
        // transfer RDX to Masterchef
        await rdxContract.connect(owner).transfer(masterchefContract.address, ethers.utils.parseEther("1000"));
        // approve and deposit kcp token
        await kcpContract.connect(owner).approve(masterchefContract.address, ethers.utils.parseEther("100"))
        await masterchefContract.connect(owner).deposit(0, ethers.utils.parseEther("10"))

        // wait for 10 block       
        await hre.network.provider.send("hardhat_mine", ["0xA"]);
        const rdxRewards = await masterchefContract.connect(owner).pendingRdx(0, owner.address)
        expect(rdxRewards).to.equal(ethers.utils.parseEther("10").toString())

    })

    it('deposit token and withdraw', async () => {
        const [owner, addr1, addr2] = await ethers.getSigners()
        // mint kcp token
        await kcpContract.mintToken(owner.address, ethers.utils.parseEther("1000"))
        // add a pool to Masterchef
        await masterchefContract.add(1, kcpContract.address)
        // transfer RDX to Masterchef
        await rdxContract.connect(owner).transfer(masterchefContract.address, ethers.utils.parseEther("1000"));
        // approve and deposit kcp token to pool
        await kcpContract.connect(owner).approve(masterchefContract.address, ethers.utils.parseEther("100"))
        await masterchefContract.connect(owner).deposit(0, ethers.utils.parseEther("10"))
        // withdraw kcp token from pool
        await masterchefContract.connect(owner).withdraw(0, ethers.utils.parseEther("5"))
        const userInfo = await masterchefContract.connect(owner).userInfo(0, owner.address)
        expect(userInfo.amount).to.equal(ethers.utils.parseEther("5").toString())
    })

});



