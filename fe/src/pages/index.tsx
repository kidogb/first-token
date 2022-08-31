// src/pages/index.tsx
import type { NextPage } from 'next'
import Head from 'next/head'
import NextLink from "next/link"
import { VStack, Stack, Heading, Box } from '@chakra-ui/layout'
import { Text, Divider, Badge, Link, useToast } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { BigNumber, ethers } from 'ethers'
import { parseEther } from 'ethers/lib/utils'
import Header from 'components/header'
import Deposit from 'components/Deposit'
import Rewards from 'components/Rewards'
import Withdraw from 'components/Withdraw'
import RDX from 'abi/RDX.json';
import KCP from 'abi/KCP.json';
import MC from 'abi/Masterchef.json';
import { RDXADDRESS, KCPADDRESS, MCADDRESS } from 'abi/address';
import Footer from 'components/footer'

declare let window: any
interface Loading {
  approve: boolean,
  deposit: boolean,
  claim: boolean,
  viewRewards: boolean,
  withdraw: boolean
}

const Home: NextPage = () => {
  const [kcpContract, setKcpContract] = useState<ethers.Contract | undefined>()
  const [rdxContract, setRdxContract] = useState<ethers.Contract | undefined>()
  const [mcContract, setMcContract] = useState<ethers.Contract | undefined>()
  const [kcpBalance, setKcpBalance] = useState<string | undefined>('--')
  const [rdxBalance, setRdxBalance] = useState<string | undefined>('--')
  const [currentAccount, setCurrentAccount] = useState<string | undefined>()
  const [chainname, setChainName] = useState<string | undefined>('--')
  const [isDisconnect, setIsDisconnect] = useState(true)
  const [rewards, setRewards] = useState<string | undefined>('--')
  const [loading, setLoading] = useState<Loading>({ approve: false, deposit: false, claim: false, viewRewards: false, withdraw: false })
  const [totalDeposited, setTotalDeposited] = useState<string | undefined>('--')

  const toast = useToast()


  const displayNotify = (message: string, status: "info" | "warning" | "success" | "error" | undefined) => {
    toast({
      title: '',
      description: message,
      status: status,
      duration: 9000,
      isClosable: true
    })
  }

  const handleContractInteractionError = (error: any) => {
    if (error?.code === 4001) {
      displayNotify(`Error: ${error?.message || ''}. Code: ${error?.code || ''}`, 'error')
    } else {
      displayNotify(`Error: ${error?.error?.message || 'unknow error'}. Code: ${error?.error?.code || 'unknow code'}`, 'error')
    }
  }

  useEffect(() => {
    //get balance and network info only when having currentAccount 
    if (!currentAccount || !ethers.utils.isAddress(currentAccount)) return
    //client side code
    if (!window.ethereum) {
      console.log("please install MetaMask")
      return
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner();
    let rdx = new ethers.Contract(RDXADDRESS, RDX, signer);
    let kcp = new ethers.Contract(KCPADDRESS, KCP, signer);
    let mc = new ethers.Contract(MCADDRESS, MC, signer);
    setRdxContract(rdx)
    setKcpContract(kcp)
    setMcContract(mc)

    // check balance of wallet
    rdx.balanceOf(currentAccount).then((result: BigNumber) => {
      setRdxBalance(ethers.utils.formatEther(result));
    }).catch((e: any) => console.log(e))
    kcp.balanceOf(currentAccount).then((result: BigNumber) => {
      setKcpBalance(ethers.utils.formatEther(result));
    }).catch((e: any) => console.log(e))

    // check balance of pool
    kcp.balanceOf(MCADDRESS).then((result: BigNumber) => {
      setTotalDeposited(ethers.utils.formatEther(result));
    }).catch((e: any) => console.log(e))

    // check rewards
    mc.pendingRdx(0, currentAccount).then((result: any) => {
      setRewards(result)
    }).catch((e: any) => console.log(e))
    // repeat check rewards
    const interval = setInterval(() => {
      console.log('Checking rewards...')
      mc.pendingRdx(0, currentAccount).then((result: any) => {
        setRewards(result)
      }).catch((e: any) => console.log(e))
    }, 60000); // set query every 60s

    provider.getNetwork().then((result) => {
      setChainName(result.name)
    }).catch((e) => console.log(e))

    return () => clearInterval(interval)
  }, [currentAccount])

  //click connect
  const onClickConnect = () => {
    //client side code
    if (!window.ethereum) {
      displayNotify('Please install Metamask!', 'warning')
      return
    }

    //we can do it using ethers.js
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    provider.send("eth_requestAccounts", [])
      .then((accounts) => {
        if (accounts.length > 0) setCurrentAccount(accounts[0])
        setIsDisconnect(false);
      }).catch((e) => console.log(e))

  }

  //click disconnect
  const onClickDisconnect = () => {
    console.log("onClickDisConnect")
    setKcpBalance(undefined)
    setRdxBalance(undefined)
    setCurrentAccount(undefined)
    setIsDisconnect(true)
    setRewards(undefined)
    setTotalDeposited(undefined)
  }

  // update wallet balances and pool
  const updatePoolAndWallet = () => {
    viewPendingRewards()
    viewBalances()
    viewPoolBalance()
  }

  // check total balalance in pool
  const viewPoolBalance = async () => {
    try {
      if (currentAccount && kcpContract) {
        const kcpPoolBalance = await kcpContract.balanceOf(MCADDRESS)
        setTotalDeposited(ethers.utils.formatEther(kcpPoolBalance));
      }
    } catch (error) {
      console.log('View pool balances error: ', error)
    }
  }

  // check wallet balance
  const viewBalances = async () => {
    try {
      if (currentAccount && rdxContract) {
        const rdxBalance = await rdxContract.balanceOf(currentAccount)
        setRdxBalance(ethers.utils.formatEther(rdxBalance));
      }

      if (currentAccount && kcpContract) {
        const kcpBalance = await kcpContract.balanceOf(currentAccount)
        setKcpBalance(ethers.utils.formatEther(kcpBalance));
      }
    } catch (error) {
      console.log('View balances error: ', error)
    }

  }

  const onClickApprove = async (amount: string) => {
    if (currentAccount && kcpContract) {
      try {
        setLoading({ ...loading, approve: true })
        const txApprove = await kcpContract.approve(MCADDRESS, parseEther(amount))
        txApprove.wait().then(() => {
          displayNotify('Approve successfully', 'success')
          setLoading({ ...loading, approve: false })
        })
      } catch (error) {
        handleContractInteractionError(error)
        setLoading({ ...loading, approve: false })
      }
    }
  }

  const onClickDeposit = async (amount: string) => {
    if (currentAccount && mcContract) {
      try {
        setLoading({ ...loading, deposit: true })
        // asume already has 1 pool with _pid = 0
        const txDeposit = await mcContract.deposit(0, parseEther(amount))
        txDeposit.wait().then(() => {
          displayNotify('Deposit successfully', 'success')
          updatePoolAndWallet()
          setLoading({ ...loading, deposit: false })
        }).catch((e: any) => {
          handleContractInteractionError(e)
          setLoading({ ...loading, deposit: true })
        })
      } catch (error) {
        handleContractInteractionError(error)
        setLoading({ ...loading, deposit: false })
      }
    }
  }

  const onClickWithdraw = async (_pid: Number, amount: string) => {
    if (currentAccount && mcContract) {
      try {
        setLoading({ ...loading, withdraw: true })
        // asume already has 1 pool with _pid = 0
        const txWithdraw = await mcContract.withdraw(0, parseEther(amount))
        txWithdraw.wait().then(() => {
          displayNotify('Withdraw successfully', 'success')
          updatePoolAndWallet()
          setLoading({ ...loading, withdraw: false })
        }).catch((e: any) => {
          handleContractInteractionError(e)
          setLoading({ ...loading, deposit: true })
        })
      } catch (error) {
        handleContractInteractionError(error)
        setLoading({ ...loading, withdraw: false })
      }
    }
  }

  const viewPendingRewards = async () => {
    if (currentAccount && mcContract) {
      try {
        setLoading({ ...loading, viewRewards: true })
        const rewards = await mcContract.pendingRdx(0, currentAccount)
        setRewards(rewards)
        setLoading({ ...loading, viewRewards: false })
      } catch (error) {
        handleContractInteractionError(error)
        setLoading({ ...loading, viewRewards: false })
      }
    }
  }

  const onClickClaimRewards = async () => {
    if (currentAccount && mcContract) {
      try {
        setLoading({ ...loading, claim: true })
        const txClaim = await mcContract.claimPendingRdx(0)
        txClaim.wait().then(() => {
          displayNotify('Claim successfully', 'success')
          updatePoolAndWallet()
          setLoading({ ...loading, claim: false })
        }).catch((e: any) => {
          handleContractInteractionError(e)
          setLoading({ ...loading, deposit: true })
        })
      } catch (error) {
        handleContractInteractionError(error)
        setLoading({ ...loading, claim: false })
      }
    }
  }


  return (
    <>
      <Head>
        <title>My Masterchef</title>
      </Head>

      <Header connect={onClickConnect} disconnect={onClickDisconnect} isDisconnect={isDisconnect} />
      <VStack>

        {currentAccount
          && <Box mb={0} p={4} w='100%' borderWidth="1px" borderRadius="lg">
            <Badge fontSize='xl' colorScheme='green'>{chainname?.toUpperCase()}</Badge>
            <Heading my={4} fontSize='xl'>
              <Link href={`https://goerli.etherscan.io/address/${currentAccount}`} isExternal>
                <Text as='samp' noOfLines={1} variant='outline' fontSize='xl' colorScheme='blue'>{currentAccount}</Text>
              </Link>
            </Heading>
            <Text as='em' noOfLines={1} fontSize='md'>{kcpBalance} KCP</Text>
            <Text as='em' noOfLines={1} fontSize='md'>{rdxBalance} RDX</Text>
          </Box>
        }
        {currentAccount &&
          <Box mb={0} p={4} w='100%' borderWidth="1px" borderRadius="lg">
            <Text noOfLines={1} fontWeight='bold'>
              DEPOSITED: {totalDeposited} KCP
            </Text>
            <Text noOfLines={1} fontSize='sm'>1 RDX per block</Text>
            <Divider mt={2} mb={5} />
            <Stack direction={['column', 'row']} spacing='10px'>

              <Box mb={0} p={1} w='100%' borderWidth="1px" borderRadius="lg">
                <Heading my={4} fontSize='xl'></Heading>
                <Deposit
                  currentAccount={currentAccount}
                  onApprove={onClickApprove}
                  onDeposit={onClickDeposit}
                  loadingApprove={loading?.approve}
                  loadingDeposit={loading?.deposit}
                />
              </Box>
              <Box mb={0} p={1} w='100%' borderWidth="1px" borderRadius="lg">
                <Heading my={4} fontSize='xl'></Heading>
                <Rewards
                  currentAccount={currentAccount}
                  rewards={rewards}
                  loadingRewards={loading.viewRewards}
                  loadingClaim={loading.claim}
                  onClaim={onClickClaimRewards}
                  onViewRewards={viewPendingRewards}
                />
              </Box>
              <Box mb={0} p={1} w='100%' borderWidth="1px" borderRadius="lg">
                <Heading my={4} fontSize='xl'></Heading>
                <Withdraw
                  currentAccount={currentAccount}
                  onWithdraw={onClickWithdraw}
                  loadingWithdraw={loading.withdraw}
                />
              </Box>

            </Stack>
          </Box>}
      </VStack>

      <Footer />

    </>
  )
}

export default Home