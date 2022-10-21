import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import { FC, useEffect, useState } from 'react';

const Borrowers: FC = () => {
  const [data, setData] = useState([]);
  const [borrowersLoading, setBorrowersLoading] = useState(false);
  const toast = useToast();

  const load = async () => {
    setBorrowersLoading(true);
    const data = await fetch('http://localhost:3002/borrow');
    const response = await data.json();
    setData(response);
    setBorrowersLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const takeBack = async (id) => {
    const response = await fetch(`http://localhost:3002/borrow/return/${id}`, {
      method: 'POST',
    });
    const json = await response.json();

    if (json.status) {
      load();
      toast({
        title: 'Successfully returned book',
        status: 'success',
      });
    }
  };

  return (
    <Box>
      <Box d="flex" justifyContent="space-between" alignItems="center" mb="20px">
        <Text fontSize="40px">Borrowers</Text>
      </Box>

      {borrowersLoading ? (
        <Spinner size="lg" />
      ) : (
        <>
          {!data.length ? (
            <Alert status="error">
              <AlertIcon />
              <AlertTitle>No Borrowers Found!</AlertTitle>
            </Alert>
          ) : (
            <TableContainer>
              <Table variant="striped" colorScheme="teal">
                <Thead>
                  <Tr>
                    <Th>Username</Th>
                    <Th>Book</Th>
                    <Th>Quantity</Th>
                    <Th>Date Borrowed</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <>
                    {data.map((item: any) => {
                      return (
                        <Tr key={item._id}>
                          <Td>{item.borrower.username}</Td>
                          <Td>{item.book.title}</Td>
                          <Td>{item.quantity}</Td>
                          <Td>{dayjs(item.createdAt).format('MMM DD, YYYY - hh:mm')}</Td>
                          <Td>
                            <Popover placement="left">
                              <PopoverTrigger>
                                <Button colorScheme="blue" size="sm">
                                  Return
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent>
                                <PopoverArrow />
                                <PopoverCloseButton />
                                <PopoverHeader>Confirmation!</PopoverHeader>
                                <PopoverBody>
                                  <Box>
                                    Are you sure you want to take this back?
                                    <br />
                                    <Button mt="4" colorScheme="blue" onClick={() => takeBack(item._id)}>
                                      Confirm
                                    </Button>
                                  </Box>
                                </PopoverBody>
                              </PopoverContent>
                            </Popover>
                          </Td>
                        </Tr>
                      );
                    })}
                  </>
                </Tbody>
              </Table>
            </TableContainer>
          )}
        </>
      )}
    </Box>
  );
};

export default Borrowers;
