// src/components/TransferERC20.tsx
import React, { useState } from 'react'
import { Spacer, Flex, Box, Text, Badge, Button, IconButton, Center, InputGroup, InputRightAddon, NumberInput, NumberInputField, FormControl, FormLabel, Grid, GridItem } from '@chakra-ui/react'
import { VscDebugRestart } from 'react-icons/vsc'

interface Props {
  currentAccount: string | undefined,
  rewards: string | undefined,
  loadingRewards: boolean,
  loadingClaim: boolean,
  loadingClaimAll: boolean,
  onClaim: (amount: string) => void,
  onClaimAll: () => void,
  onViewRewards: () => void
}

export default function Rewards({ currentAccount, rewards, loadingRewards, loadingClaim, loadingClaimAll, onClaim, onClaimAll, onViewRewards }: Props) {
  const [amount, setAmount] = useState<string>('0')

  async function claim(event: React.FormEvent) {
    event.preventDefault()
    onClaim(amount)
  }

  async function claimAll(event: React.FormEvent) {
    event.preventDefault()
    onClaimAll()
  }

  const handleChange = (value: string) => setAmount(value)

  return (
    <div>
      <FormControl>
        <Flex p={2}>
          <Box>
            <Text onClick={() => setAmount(rewards || '')} as='samp' noOfLines={1} variant='outline' fontSize='sm'>Rewards:</Text>
          </Box>
          <Spacer />
          <Box>
            <Text onClick={() => setAmount(rewards || '')} as='samp' noOfLines={1} variant='outline' fontSize='sm'>{rewards}</Text>
          </Box>
        </Flex>


        {/* <GridItem colStart={24} colEnd={24} h='10'>
            <IconButton
              isDisabled={!currentAccount}
              onClick={onViewRewards}
              variant='outline'
              size='xs'
              aria-label='View rewards'
              icon={<VscDebugRestart />}
              isLoading={loadingRewards}
            />
          </GridItem> */}

        <InputGroup>
          <NumberInput min={0} max={Number(rewards)} value={amount} onChange={handleChange}>
            <NumberInputField />
          </NumberInput>
          <InputRightAddon><Badge>RDX</Badge></InputRightAddon>
        </InputGroup>

        <Center mt={2}>
          <Button
            mr={3}
            onClick={claim}
            isDisabled={!currentAccount}
            isLoading={loadingClaim}
            loadingText='Claiming'
          >
            Claim
          </Button>
          <Button
            mr={3}
            onClick={claimAll}
            isDisabled={!currentAccount}
            isLoading={loadingClaimAll}
            loadingText='Claiming'
          >
            Claim all
          </Button>
        </Center>
      </FormControl>
    </div>
  )
}
