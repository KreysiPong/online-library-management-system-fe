import { Box, Button, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { FC, useEffect, useState } from 'react';

const Books: FC = () => {
  // const [count, setCount] = useState(1);
  const [data, setData] = useState([]);

  const load = async () => {
    const data = await fetch("http://localhost:3002/books");
    const response = await data.json();
    // console.log(response)
    setData(response);
  };



  useEffect(() => {
    load();
  }, []);

  return (
    <Box >
      <Box d="flex" justifyContent="space-between" alignItems="center" mb="20px">
        <Text fontSize="40px">Books</Text>
        <Button colorScheme='blue'>Add book</Button>
      </Box>

      <TableContainer>
        <Table variant='striped' colorScheme='teal'>
          <Thead>
            <Tr>
              <Th>year</Th>
              <Th>Class</Th>
              <Th >Title</Th>
              <Th >Author</Th>
              <Th >Publisher</Th>
              <Th >ISBN</Th>
            </Tr>
          </Thead>
          <Tbody>
            {
              data.map((book: any) => {
                return (
                  <Tr key={book._id}>
                    <Td>{book.year}</Td>
                    <Td>{book.class}</Td>
                    <Td>{book.title}</Td>
                    <Td>{book.author}</Td>
                    <Td>{book.publisher}</Td>
                    <Td>{book.isbn}</Td>
                  </Tr>)
              })
            }
          </Tbody>

        </Table>
      </TableContainer>
    </Box>
  )
}

export default Books;
