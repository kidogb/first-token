//src/components/header.tsx
import NextLink from "next/link"
import { Text, Flex, useColorModeValue, Spacer, Heading, LinkBox, LinkOverlay, Button } from '@chakra-ui/react'

type Props = {
  connect: () => void,
  disconnect: () => void,
  rdxBalance: string | undefined,
  isDisconnect: boolean
}

const siteTitle = "My Masterchef"
export default function Header({ connect, disconnect, rdxBalance, isDisconnect = true }: Props) {

  return (
    <Flex as='header' bg={useColorModeValue('gray.100', 'gray.900')} p={3} alignItems='center'>
      <LinkBox>
        <NextLink href={'/'} passHref>
          <LinkOverlay>
            <Heading size="md">{siteTitle}</Heading>
          </LinkOverlay>
        </NextLink>
      </LinkBox>
      <Spacer />

      <>
        {!isDisconnect && <Text mr={5} as='em' noOfLines={1} fontSize='md'>{parseFloat(rdxBalance || '0').toLocaleString('en')} RDX</Text>}
        <Button onClick={isDisconnect ? connect : disconnect}>{isDisconnect ? 'Connect' : 'Disconnect'} </Button>
      </>


    </Flex>
  )
}
