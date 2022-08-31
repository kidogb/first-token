//src/components/header.tsx
import NextLink from "next/link"
import { Badge, Center, Text, useColorModeValue, Link } from '@chakra-ui/react'
import { KCPADDRESS } from "abi/address"


export default function Footer() {

  return (
    <Center as="footer" bg={useColorModeValue('gray.100', 'gray.700')} p={6}>

      <Text fontSize="md">An example of Masterchef. You can mint token <Link color='blue' href={`https://goerli.etherscan.io/address/${KCPADDRESS}#writeContract#F2`} isExternal>here</Link></Text>

    </Center >
  )
}
