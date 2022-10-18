import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';
import { FC, useEffect, useState } from 'react';

const Books: FC = () => {
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedBook, setSelectedBook] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();

  const getBooks = async () => {
    const data = await fetch('http://localhost:3002/books');
    const response = await data.json();
    setData(response);
  };

  const getUsers = async () => {
    const data = await fetch('http://localhost:3002/users');
    const response = await data.json();
    setUsers(response.data);
  };

  const openModal = (quantity: number) => {
    if (quantity) {
      onOpen();
    }
  };

  const lend = async (id) => {
    const data = await fetch('http://localhost:3002/borrow/book', {
      method: 'POST',
      body: JSON.stringify({
        userId: selectedUser,
        bookId: selectedBook,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const response = await data.json();
    console.log(response);
  };

  useEffect(() => {
    getBooks();
    getUsers();
  }, []);

  return (
    <Box>
      <Box d="flex" justifyContent="space-between" alignItems="center" mb="20px">
        <Text fontSize="40px">Books</Text>
        <Button colorScheme="blue">Add book</Button>
      </Box>

      <TableContainer>
        <Table variant="striped" colorScheme="teal">
          <Thead>
            <Tr>
              <Th>year</Th>
              <Th>Class</Th>
              <Th>Title</Th>
              <Th>Author</Th>
              <Th>Publisher</Th>
              <Th>ISBN</Th>
              <Th>Quantity</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((book: any) => {
              return (
                <Tr key={book._id}>
                  <Td>{book.year}</Td>
                  <Td>{book.class}</Td>
                  <Td>{book.title}</Td>
                  <Td>{book.author}</Td>
                  <Td>{book.publisher}</Td>
                  <Td>{book.isbn}</Td>
                  <Td>{book.quantity}</Td>
                  <Td>
                    <Button
                      disabled={!book.quantity}
                      colorScheme="cyan"
                      color="white"
                      onClick={() => {
                        setSelectedBook(book._id);
                        openModal(book.quantity);
                      }}
                    >
                      Lend
                    </Button>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Lend Book</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Student</FormLabel>
              <Select placeholder="Select student" onChange={(e) => setSelectedUser(e.target.value)}>
                {users.map((user: any) => {
                  return (
                    <option value={user._id}>
                      {user.first_name} {user.last_name}
                    </option>
                  );
                })}
              </Select>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="teal" disabled={!Boolean(selectedUser)} onClick={() => lend()}>
              Lend
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Books;
