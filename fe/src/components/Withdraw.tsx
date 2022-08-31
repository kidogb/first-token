// src/components/TransferERC20.tsx
import React, { useState } from 'react'
import { Badge, Button, Center, InputGroup, InputRightAddon, NumberInput, NumberInputField, FormControl, FormLabel } from '@chakra-ui/react'

interface Props {
  currentAccount: string | undefined
  loadingWithdraw: boolean,
  onWithdraw: (_pid: Number, amount: string) => void
}


export default function Withdraw({ currentAccount, loadingWithdraw, onWithdraw }: Props) {
  const [amount, setAmount] = useState<string>('0')

  async function handleWithdraw(event: React.FormEvent) {
    event.preventDefault()
    onWithdraw(0, amount)
  }

  const handleChange = (value: string) => setAmount(value)

  return (
    <form onSubmit={handleWithdraw}>
      <FormControl>
        <FormLabel htmlFor='amount' h='8'>Withdraw: </FormLabel>
        <InputGroup>
          <NumberInput defaultValue={amount} min={1} max={1000} onChange={handleChange}>
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
