import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
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
  Tag,
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
import dayjs from 'dayjs';
import { FC, useEffect, useState } from 'react';
import { GiNotebook } from 'react-icons/gi';
import { HiTrash } from 'react-icons/hi';
import { RiHandCoinFill, RiHealthBookLine } from 'react-icons/ri';
import { SiMicrosoftexcel } from 'react-icons/si';
import * as XLSX from 'xlsx';

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

  const openModal = () => {
    onOpen();
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
        title: 'Borrow book successfully',
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
        <input
          style={{ visibility: 'hidden' }}
          type="file"
          id="upload"
          onChange={(e) => {
            e.preventDefault();
            setImporting(true);

            try {
              const files = e.target.files,
                f = files?.[0];

              const reader = new FileReader();
              reader.onload = function (e) {
                const data = (e.target as any).result;
                const readedData = XLSX.read(data, { type: 'binary' });
                const wsname = readedData.SheetNames[0];
                const ws = readedData.Sheets[wsname];

                const dataParse = XLSX.utils.sheet_to_json(ws, { header: 1 });
                const book = {};
                dataParse.map(async (q: Array<any>, i) => {
                  if (i !== 0) {
                    if (q.length > 10) {
                      if (book[q[4]]) {
                        const temp = book[q[4]];

                        if (
                          temp.title === q[4] &&
                          temp.isbn === q[13] &&
                          temp.year === q[10] &&
                          temp.publisher === q[9] &&
                          temp.pages === q[7] &&
                          temp.edition === q[5] &&
                          temp.author === q[3] &&
                          temp.class === q[2]
                        ) {
                          temp.quantity = temp.quantity + 1;
                        } else {
                          book[`${q[4]} v2`] = {
                            class: q[2],
                            author: q[3],
                            title: q[4],
                            edition: q[5],
                            volume: q[6],
                            pages: q[7],
                            source_of_fund: q[8],
                            publisher: q[9],
                            year: q[10],
                            remarks: q[11],
                            locator: q[12],
                            isbn: q[13],
                            quantity: 1,
                          };
                        }
                      } else {
                        book[q[4]] = {
                          class: q[2],
                          author: q[3],
                          title: q[4],
                          edition: q[5],
                          volume: q[6],
                          pages: q[7],
                          source_of_fund: q[8],
                          publisher: q[9],
                          year: q[10],
                          remarks: q[11],
                          locator: q[12],
                          isbn: q[13],
                          quantity: 1,
                        };
                      }
                    }
                  }
                });

                const importableBooks = Object.values(book);
                void Promise.all(
                  importableBooks.map(async (q: any) => {
                    try {
                      await fetch('http://localhost:3002/books/create', {
                        method: 'POST',
                        headers: {
                          'Content-type': 'application/json',
                        },
                        body: JSON.stringify({
                          class: q.class,
                          author: q.author,
                          title: q.title,
                          edition: q.edition,
                          volume: q.volume,
                          pages: q.pages,
                          source_of_fund: q.source_of_fund,
                          publisher: q.publisher,
                          year: q.year,
                          remarks: q.remarks,
                          locator: q.locator,
                          isbn: q.isbn,
                          quantity: q.quantity,
                        }),
                      });
                    } catch (ex) {}
                  })
                ).then(() => {
                  toast({
                    title: 'Books imported successfully. Reloading page...',
                    status: 'success',
                    duration: 10000,
                  });
                  const timeout = setTimeout(() => {
                    location.reload();
                    clearTimeout(timeout);
                  }, 5000);
                });
              };
              reader.readAsBinaryString(f as any);
            } catch (ex) {
              setImporting(false);
            }
          }}
        />
        <Box>
          <Button
            colorScheme="cyan"
            color="white"
            onClick={() => {
              document.getElementById('upload')?.click();
            }}
            marginRight="8px"
          >
            <SiMicrosoftexcel />
            &nbsp;
          </Button>
          <Button
            colorScheme="cyan"
            color="white"
            onClick={() => {
              // setSelectedBook(book._id);
              openModal();
            }}
            marginRight="8px"
          >
            <RiHandCoinFill />
            &nbsp;
          </Button>
          <Button colorScheme="blue" onClick={onAddBookOpen}>
            <RiHealthBookLine />
            &nbsp;
          </Button>
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
                      <Th>Actions</Th>
                      <Th>year</Th>
                      <Th>Class</Th>
                      <Th>Title</Th>
                      <Th>Author</Th>
                      <Th>Publisher</Th>
                      <Th>Date Acquired</Th>
                      <Th>ISBN</Th>
                      <Th>Quantity</Th>
                    </Tr>
                  </Thead>
                  <Box h="24.5px" />
                  <Tbody>
                    {books.map((book: any) => {
                      if (book.title) {
                        return (
                          <Tr key={book._id}>
                            <Td>
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
                            <Td>{book.year}</Td>
                            <Td>{book.class}</Td>
                            <Td>{book.title.length > 50 ? `${book.title.substr(0, 26)}...` : book.title}</Td>
                            <Td>{book.author}</Td>
                            <Td>{book.publisher}</Td>
                            <Td>{dayjs(book.createdAt).format('MMM DD,YYYY HH:mm')}</Td>
                            <Td>{book.isbn}</Td>
                            <Td>
                              {book.quantity < 5 && <Tag colorScheme="red">{book.quantity}</Tag>}
                              {book.quantity > 5 && book.quantity < 20 && (
                                <Tag colorScheme="orange">{book.quantity}</Tag>
                              )}
                              {book.quantity > 20 && <Tag colorScheme="green">{book.quantity}</Tag>}
                            </Td>
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

      {/* Borrow BOOK MODAL */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Borrow Book</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Student</FormLabel>
              <Select placeholder="Select student" onChange={(e): void => setSelectedUser(e.target.value)}>
                {users.map((user: any) => {
                  return (
                    <option key={user._id} value={user._id}>
                      {user.first_name} {user.last_name}
                    </option>
                  );
                })}
              </Select>
            </FormControl>

            <FormControl marginTop="15px">
              <FormLabel>Book</FormLabel>
              <Select placeholder="Select book" onChange={(e) => setSelectedBook(e.target.value)}>
                {data
                  .filter((q: any) => q.quantity)
                  .map((q: any) => {
                    return <option value={q._id}>{q.title}</option>;
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

      {/* IMPORTING MODAL */}
      <Modal
        closeOnOverlayClick={false}
        isOpen={importing}
        onClose={() => {
          setImporting(false);
        }}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalBody pb={6} d="grid" placeContent="center" m="auto" p="10">
            <>
              <Text fontSize="20px" textAlign="center">
                Importing Books. Please wait.
              </Text>
              <Center mt="16px">
                <Spinner textAlign="center" size="lg" />
              </Center>
            </>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Books;
