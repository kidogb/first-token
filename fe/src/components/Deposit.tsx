import React, { useState } from 'react'
import { Badge, Button, Center, InputGroup, InputRightAddon, NumberInput, NumberInputField, FormControl, FormLabel } from '@chakra-ui/react'

interface Props {
  currentAccount: string | undefined,
  loadingApprove: boolean,
  loadingDeposit: boolean,
  onApprove: (amount: string) => void,
  onDeposit: (amount: string) => void
}


export default function Deposit({ currentAccount, loadingApprove, loadingDeposit, onApprove, onDeposit }: Props) {

  const [amount, setAmount] = useState<string>('2')

  async function approve(event: React.FormEvent) {
    event.preventDefault()
    onApprove(amount)
  }

  async function deposit(event: React.MouseEvent) {
    event.preventDefault()
    onDeposit(amount)
  }

  const handleChange = (value: string) => setAmount(value)


  return (
    <div>
      <FormControl>
        <FormLabel htmlFor='amount' h='8'>Amount: </FormLabel>
        <InputGroup>
          <NumberInput defaultValue={amount} min={1} max={1000} onChange={handleChange}>
            <NumberInputField />
          </NumberInput>
          <InputRightAddon><Badge>KCP</Badge></InputRightAddon>
        </InputGroup>


        <Center mt={2}>
          <Button isLoading={loadingApprove} loadingText='Approving' onClick={approve} mr={2} isDisabled={!currentAccount}>Approve</Button>
          <Button isLoading={loadingDeposit} loadingText='Depositing' mr={2} onClick={deposit} isDisabled={!currentAccount}>Deposit</Button>
        </Center>
      </FormControl>
    </div>
  )
}
