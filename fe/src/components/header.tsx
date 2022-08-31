//src/components/header.tsx
import NextLink from "next/link"
import { Flex, Button, useColorModeValue, Spacer, Heading, LinkBox, LinkOverlay } from '@chakra-ui/react'

type Props = {
  connect: () => void,
  disconnect: () => void,
  isDisconnect: boolean
}

const siteTitle = "My Masterchef"
export default function Header({ connect, disconnect, isDisconnect=true }: Props) {

  return (
    <Flex as='header' bg={useColorModeValue('gray.100', 'gray.900')} p={4} alignItems='center'>
      <LinkBox>
        <NextLink href={'/'} passHref>
          <LinkOverlay>
            <Heading size="md">{siteTitle}</Heading>
          </LinkOverlay>
        </NextLink>
      </LinkBox>
      <Spacer />
      <Button onClick={isDisconnect ? connect : disconnect}>{isDisconnect ? 'Connect' : 'Disconnect'} </Button>
    </Flex>
  )
}
