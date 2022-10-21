import { DeleteIcon } from '@chakra-ui/icons';
import { Box, ChakraProvider, Flex, List, ListIcon, ListItem, useToast } from '@chakra-ui/react';
import { AppProps } from 'next/app';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { CgList } from 'react-icons/cg';
import { FaBookReader } from 'react-icons/fa';
import { HiUsers } from 'react-icons/hi';
import { IoTrashBinSharp } from 'react-icons/io5';
import { TfiBook } from 'react-icons/tfi';

// App is global
const App: FC<AppProps> = ({ Component, pageProps }) => {
  const router = useRouter();
  const toast = useToast();
  const isIndex = router.pathname === '/';
  const hoverStyles = {
    fontSize: '20px',
    transition: '0.5s ease-in',
    _hover: {
      textDecoration: 'underline',
      color: 'lightgreen',
    },
  };

  return (
    <ChakraProvider>
      {isIndex ? (
        <Component {...pageProps} />
      ) : (
        <Box height="100vh" overflow="hidden">
          <Box bg="#2ecc71" w="100%" p={4} color="white" height="50px"></Box>

          <Flex color="white">
            {/* LEFT SIDEBAR */}
            <Box height="calc(100vh - 50px)" bg="#2c3e50" w="250px">
              <List padding="20px" spacing="16px">
                <Link href="/admin/books">
                  <ListItem cursor="pointer" {...hoverStyles}>
                    <ListIcon as={TfiBook} color="green.500" />
                    Books
                  </ListItem>
                </Link>

                <Link href="/admin/archived-books">
                  <ListItem cursor="pointer" {...hoverStyles}>
                    <ListIcon as={IoTrashBinSharp} color="green.500" />
                    Archived Books
                  </ListItem>
                </Link>

                <Link href="/admin/users">
                  <ListItem cursor="pointer" {...hoverStyles}>
                    <ListIcon as={HiUsers} color="green.500" />
                    Users
                  </ListItem>
                </Link>

                <Link href="/admin/borrowers">
                  <ListItem cursor="pointer" {...hoverStyles}>
                    <ListIcon as={FaBookReader} color="green.500" />
                    Borrowers
                  </ListItem>
                </Link>

                <Link href="/admin/audit-log">
                  <ListItem cursor="pointer" {...hoverStyles}>
                    <ListIcon as={CgList} color="green.500" />
                    Audit Log
                  </ListItem>
                </Link>

                <ListItem
                  cursor="pointer"
                  onClick={() => {
                    router.push('/');
                    localStorage.removeItem('accessToken');
                  }}
                  {...hoverStyles}
                >
                  <ListIcon as={DeleteIcon} color="green.500" />
                  Logout
                </ListItem>
              </List>
            </Box>
            {/* RIGHT SIDEBAR */}
            <Box bg="#ecf0f1" w="100%" color="black" p={6} height="calc(100vh - 50px)" overflow="auto">
              <Component {...pageProps} />
            </Box>
          </Flex>
        </Box>
      )}
    </ChakraProvider>
  );
};

export default App;
