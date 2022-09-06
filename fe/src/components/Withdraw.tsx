// src/components/TransferERC20.tsx
import React, { useState } from 'react'
import { Text, Flex, Spacer, Box, Badge, Button, Center, InputGroup, InputRightAddon, NumberInput, NumberInputField, FormControl, FormLabel } from '@chakra-ui/react'

interface Props {
  currentAccount: string | undefined
  kcpDeposited: string | undefined,
  loadingWithdraw: boolean,
  onWithdraw: (_pid: Number, amount: string) => void
}


export default function Withdraw({ currentAccount, kcpDeposited, loadingWithdraw, onWithdraw }: Props) {
  const [amount, setAmount] = useState<string>('0')

  async function handleWithdraw(event: React.FormEvent) {
    event.preventDefault()
    onWithdraw(0, amount)
  }

  const handleChange = (value: string) => setAmount(value)

  return (
    <form onSubmit={handleWithdraw}>
      <FormControl>
        <Flex p={2}>
          <Box>
            <Text as='samp' noOfLines={1} variant='outline' fontSize='sm'>Withdraw:</Text>
          </Box>
          <Spacer />
          <Box>
            <Text onClick={() => setAmount(kcpDeposited || '')} as='samp' noOfLines={1} variant='outline' fontSize='sm'>{kcpDeposited}</Text>
          </Box>
        </Flex>
        <InputGroup>
          <NumberInput value={amount} min={1} max={1000} onChange={handleChange}>
            <NumberInputField />
          </NumberInput>
          <InputRightAddon><Badge>KCP</Badge></InputRightAddon>
        </InputGroup>
        <Center mt={2}>
          <Button
            type="submit"
            isDisabled={!currentAccount}
            isLoading={loadingWithdraw}
            loadingText='Withdrawing'
          >
            Withdraw
          </Button>
        </Center>
      </FormControl>
    </form>
  )
}
