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
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Select,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import AddBookModal from 'component/AddBookModal';
import { FC, useEffect, useState } from 'react';
import { GiNotebook } from 'react-icons/gi';
import { HiTrash } from 'react-icons/hi';
import { RiHandCoinFill, RiHealthBookLine } from 'react-icons/ri';

const Books: FC = () => {
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedBook, setSelectedBook] = useState('');
  const [lendLoading, setLendLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isAddBookOpen, onOpen: onAddBookOpen, onClose: onAddBookClose } = useDisclosure();
  const toast = useToast();
  const [bookLoading, setBookLoading] = useState(false);

  const getBooks = async () => {
    setBookLoading(true);
    const data = await fetch('http://localhost:3002/books');
    const response = await data.json();
    setData(response);
    setBookLoading(false);
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

  const lend = async () => {
    setLendLoading(true);
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
    if (response.status) {
      toast({
        title: 'Lend book successfully',
        status: 'success',
        isClosable: true,
      });
      onClose();

      getBooks();
    } else {
      toast({
        title: 'Error upon lending book',
        status: 'error',
        isClosable: true,
      });
    }
    setLendLoading(false);
  };

  const onDelete = async (id) => {
    const deletableBook = await fetch(`http://localhost:3002/books/${id}`, {
      method: 'DELETE',
    });
    const response = await deletableBook.json();
    if (response.acknowledged) {
      toast({
        title: 'Successfully deleted book',
        status: 'success',
        isClosable: true,
      });
      const prevData = [...data];
      const temp = prevData.filter((q: any) => q._id !== id);
      setData(temp);
    } else {
      toast({
        title: 'Error on deleting book',
        status: 'error',
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    getBooks();
    getUsers();
  }, []);

  return (
    <Box>
      <Box d="flex" justifyContent="space-between" alignItems="center" mb="20px">
        <Text fontSize="40px">Books</Text>
        <Button colorScheme="blue" onClick={onAddBookOpen}>
          <RiHealthBookLine />
          &nbsp;Add book
        </Button>
      </Box>

      {bookLoading ? (
        <Spinner size="lg" />
      ) : (
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
                      <Tooltip label="Lend book">
                        <Button
                          disabled={!book.quantity}
                          colorScheme="cyan"
                          color="white"
                          onClick={() => {
                            setSelectedBook(book._id);
                            openModal(book.quantity);
                          }}
                        >
                          <RiHandCoinFill />
                        </Button>
                      </Tooltip>
                      <Tooltip label="Delete book">
                        <Popover placement="left">
                          <PopoverTrigger>
                            <Button ml="2" colorScheme="red">
                              <HiTrash />
                            </Button>
                          </PopoverTrigger>
                          <Portal>
                            <PopoverContent>
                              <PopoverArrow />
                              <PopoverHeader>Are you sure you want to delete this book?</PopoverHeader>
                              <PopoverCloseButton />
                              <PopoverBody>
                                <Button colorScheme="red" onClick={() => onDelete(book._id)}>
                                  Confirm
                                </Button>
                              </PopoverBody>
                            </PopoverContent>
                          </Portal>
                        </Popover>
                      </Tooltip>

                      <Tooltip label="Update book">
                        <Button ml="2" colorScheme="orange">
                          <GiNotebook />
                        </Button>
                      </Tooltip>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      )}

      {/* LEND BOOK MODAL */}
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
            <Button
              colorScheme="teal"
              disabled={!Boolean(selectedUser) || lendLoading}
              onClick={() => lend()}
              isLoading={lendLoading}
            >
              Lend
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* ADD BOOK MODAL */}
      <AddBookModal prevData={data} isOpen={isAddBookOpen} onClose={onAddBookClose} setData={setData} />
    </Box>
  );
};

export default Books;
