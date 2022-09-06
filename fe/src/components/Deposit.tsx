import React, { useEffect, useState } from 'react'
import { Text, Flex, Spacer, Box, Badge, Button, Center, InputGroup, InputRightAddon, NumberInput, NumberInputField, FormControl, FormLabel } from '@chakra-ui/react'
import { ethers } from 'ethers'

interface Props {
  currentAccount: string | undefined,
  kcpBalance: string | undefined,
  loadingApprove: boolean,
  loadingDeposit: boolean,
  allowance: string | undefined,
  onApprove: (amount: string) => void,
  onDeposit: (amount: string) => void
}


export default function Deposit({ currentAccount, kcpBalance, loadingApprove, loadingDeposit, allowance, onApprove, onDeposit }: Props) {

  const [amount, setAmount] = useState<string>('0')
  const [needApproved, setNeedApproved] = useState<boolean>(true)

  useEffect(() => {
    if (allowance && amount !== "")
      setNeedApproved(ethers.utils.parseUnits(allowance, 18).lt(ethers.utils.parseUnits(amount, 18)))
    else
      setNeedApproved(true)
  }, [allowance, amount])

  async function approve(event: React.FormEvent) {
    event.preventDefault()
    onApprove(amount)
  }

  async function deposit(event: React.MouseEvent) {
    event.preventDefault()
    onDeposit(amount)
  }

  const handleChange = (value: string) => {
    setAmount(value)
  }


  return (
    <div>
      <FormControl>
        <Flex p={2}>
          <Box>
            <Text as='samp' noOfLines={1} variant='outline' fontSize='sm'>Amount:</Text>
          </Box>
          <Spacer />
          <Box>
            <Text onClick={() => setAmount(kcpBalance || '')} as='samp' noOfLines={1} variant='outline' fontSize='sm'>{kcpBalance}</Text>
          </Box>
        </Flex>
        <InputGroup>
          <NumberInput value={amount} min={0} onChange={handleChange}>
            <NumberInputField />
          </NumberInput>
          <InputRightAddon><Badge>KCP</Badge></InputRightAddon>
        </InputGroup>

        <Center mt={2}>
          {needApproved ? <Button isLoading={loadingApprove} loadingText='Approving' onClick={approve} mr={2} isDisabled={!currentAccount}>Approve</Button> :
            <Button isLoading={loadingDeposit} loadingText='Depositing' mr={2} onClick={deposit} isDisabled={!currentAccount}>Deposit</Button>}
        </Center>
      </FormControl>
    </div>
  )
}
