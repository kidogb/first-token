// src/components/TransferERC20.tsx
import React, { useState } from 'react'
import { Badge, Button, IconButton, Center, InputGroup, InputRightAddon, NumberInput, NumberInputField, FormControl, FormLabel, Grid, GridItem } from '@chakra-ui/react'
import { VscDebugRestart } from 'react-icons/vsc'

interface Props {
  currentAccount: string | undefined,
  rewards: string | undefined,
  loadingRewards: boolean,
  loadingClaim: boolean,
  onClaim: () => void,
  onViewRewards: () => void
}

export default function Rewards({ currentAccount, rewards, loadingRewards, loadingClaim, onClaim, onViewRewards }: Props) {

  async function transfer(event: React.FormEvent) {
    event.preventDefault()
    onClaim()
  }

  return (
    <form onSubmit={transfer}>
      <FormControl>
        <Grid>
          <GridItem colSpan={2} h='10'>
            <FormLabel htmlFor='amount'>Rewards: </FormLabel>
          </GridItem>
          <GridItem colStart={24} colEnd={24} h='10'>
            <IconButton
              isDisabled={!currentAccount}
              onClick={onViewRewards}
              variant='outline'
              size='xs'
              aria-label='View rewards'
              icon={<VscDebugRestart />}
              isLoading={loadingRewards}
            />
          </GridItem>

        </Grid>
        <InputGroup>
          <NumberInput isDisabled value={rewards}>
            <NumberInputField />
          </NumberInput>
          <InputRightAddon><Badge>RDX</Badge></InputRightAddon>
        </InputGroup>

        <Center mt={2}>
          <Button
            type="submit"
            isDisabled={!currentAccount}
            isLoading={loadingClaim}
            loadingText='Claiming'
          >
            Claim
          </Button>
        </Center>
      </FormControl>
    </form>
  )
}
