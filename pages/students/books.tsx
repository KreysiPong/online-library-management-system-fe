import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Center,
  Input,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import { FC, useEffect, useState } from 'react';

const Books: FC = () => {
  const [data, setData] = useState<any>([]);

  const [searchText, setSearchText] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedBook, setSelectedBook] = useState('');
  const [lendLoading, setLendLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isAddBookOpen, onOpen: onAddBookOpen, onClose: onAddBookClose } = useDisclosure();
  const toast = useToast();
  const [bookLoading, setBookLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [page, setPage] = useState(1);
  const [fetching, setFetching] = useState(false);

  const getBooks = async () => {
    setBookLoading(true);
    const data = await fetch(
      `http://localhost:3002/books?${new URLSearchParams({
        page: `${page}`,
      })}`
    );
    const response = await data.json();
    setData(response);

    setBookLoading(false);
  };

  const getUsers = async () => {
    const data = await fetch(`http://localhost:3002/users`);
    const response = await data.json();
    setUsers(response.data);
  };

  useEffect(() => {
    getBooks();
    getUsers();
  }, []);

  const loadMore = async (): Promise<void> => {
    // https://stackoverflow.com/a/34550171/7881576 - How to detect if the user has scrolled to the bottom
    // const element = e.target;
    // if (element?.scrollHeight - element?.scrollTop === element?.clientHeight) {
    //   // console.log('scrolled');
    setFetching(true);
    const fetched = await fetch(
      `http://localhost:3002/books?${new URLSearchParams({
        page: `${page + 1}`,
      })}`
    );

    const response = await fetched.json();
    setData([...data, ...response]);
    setPage(page + 1);
    setFetching(false);
    // }
  };

  const books = data.filter((q: any) => q.title.toLowerCase().includes(searchText.toLowerCase()));

  return (
    <Box>
      <Box d="flex" justifyContent="space-between" alignItems="center" mb="20px">
        <Box d="flex" alignItems="center">
          <Text fontSize="40px">Books</Text>
          <Input
            placeholder="Search"
            marginLeft="30px"
            border="1px solid lightgray"
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
          />
        </Box>
      </Box>

      {bookLoading ? (
        <Spinner size="lg" />
      ) : (
        <>
          <Box height="70vh" overflow="scroll" overflowX="hidden">
            {books.length ? (
              <TableContainer>
                <Table size="sm">
                  <Thead>
                    <Tr>
                      <Th>year</Th>
                      <Th>Class</Th>
                      <Th>Title</Th>
                      <Th>Author</Th>
                      <Th>Publisher</Th>
                      <Th>Date Acquired</Th>
                      <Th>ISBN</Th>
                    </Tr>
                  </Thead>
                  <Box h="24.5px" />
                  <Tbody>
                    {books.map((book: any) => {
                      if (book.title) {
                        return (
                          <Tr key={book._id}>
                            <Td>{book.year}</Td>
                            <Td>{book.class}</Td>
                            <Td>{book.title.length > 50 ? `${book.title.substr(0, 26)}...` : book.title}</Td>
                            <Td>{book.author?.length > 50 ? `${book.author.substr(0, 26)}...` : book.author}</Td>
                            <Td>{book.publisher}</Td>
                            <Td>{dayjs(book.createdAt).format('MMM DD,YYYY HH:mm')}</Td>
                            <Td>{book.isbn}</Td>
                          </Tr>
                        );
                      }
                    })}
                  </Tbody>
                </Table>
              </TableContainer>
            ) : (
              <Alert status="error">
                <AlertIcon />
                <AlertTitle>No Books Found!</AlertTitle>
              </Alert>
            )}
          </Box>

          <Center>
            <Button colorScheme="blue" mt="3" isLoading={fetching} onClick={loadMore}>
              Load More
            </Button>
          </Center>
        </>
      )}
    </Box>
  );
};

export default Books;
