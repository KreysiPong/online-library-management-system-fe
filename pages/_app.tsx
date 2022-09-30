import { DeleteIcon, SettingsIcon } from '@chakra-ui/icons';
import { Box, ChakraProvider, Flex, List, ListIcon, ListItem } from '@chakra-ui/react';
import { AppProps } from 'next/app';
import Link from 'next/link';
import { FC } from 'react';

// App is global
const App: FC<AppProps> = ({ Component, pageProps }) => (
  <ChakraProvider>
    <Box height="100vh" overflow="hidden">
      <Box bg='#2ecc71' w='100%' p={4} color='white' height="50px">

      </Box>

      <Flex color='white'>
        {/* LEFT SIDEBAR */}
        <Box height="calc(100vh - 50px)" bg='#2c3e50' w="200px">
          <List padding="20px" spacing="16px">
            <Link href="/books">
              <ListItem cursor="pointer">
                <ListIcon as={DeleteIcon} color='green.500' />
                Books
              </ListItem>
            </Link>

            <Link href="/users">
              <ListItem cursor="pointer">
                <ListIcon as={DeleteIcon} color='green.500' />
                Users
              </ListItem>
            </Link>

            <Link href='/settings'>
              <ListItem cursor="pointer">
                <ListIcon as={SettingsIcon} color='green.500' />
                Settings
              </ListItem>
            </Link>

            <ListItem cursor="pointer">
              <ListIcon as={DeleteIcon} color='green.500' />
              Logout
            </ListItem>

          </List>
        </Box>
        {/* RIGHT SIDEBAR */}
        <Box bg='#ecf0f1' w="100%" color="black" p={6} height="calc(100vh - 50px)" overflow="auto">
          <Component {...pageProps} />
        </Box>
      </Flex>

    </Box>
  </ChakraProvider>
);

export default App;