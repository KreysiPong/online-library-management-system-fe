import { Box, Input, Spinner, Table, TableContainer, Tag, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import dayjs from 'dayjs';
import { FC, useEffect, useState } from 'react';

const Books: FC = () => {
  const [data, setData] = useState([]);
  const [bookLoading, setBookLoading] = useState(false);

  const getBooks = async () => {
    setBookLoading(true);
    const data = await fetch('http://localhost:3002/books/archive');
    const response = await data.json();
    setData(response);
    setBookLoading(false);
  };

  useEffect(() => {
    getBooks();
  }, []);

  return (
    <Box>
      <Box d="flex" justifyContent="space-between" alignItems="center" mb="20px">
        <Box d="flex" alignItems="center">
          <Text fontSize="40px">Archived</Text>
          <Input placeholder="Search" marginLeft="30px" border="1px solid lightgray" />
        </Box>
        <Box></Box>
      </Box>

      {bookLoading ? (
        <Spinner size="lg" />
      ) : (
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
                <Th>Quantity</Th>
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
                    <Td>{dayjs(book.createdAt).format('MMM DD,YYYY HH:mm')}</Td>
                    <Td>{book.isbn}</Td>
                    <Td>
                      {book.quantity < 5 && <Tag colorScheme="red">{book.quantity}</Tag>}
                      {book.quantity > 5 && book.quantity < 20 && <Tag colorScheme="orange">{book.quantity}</Tag>}
                      {book.quantity > 20 && <Tag colorScheme="green">{book.quantity}</Tag>}
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default Books;
