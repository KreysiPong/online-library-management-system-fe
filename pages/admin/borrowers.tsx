import { Box, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { FC, useEffect, useState } from 'react';

const Borrowers: FC = () => {
  const [data, setData] = useState([]);

  const load = async () => {
    const data = await fetch('http://localhost:3002/borrow');
    const response = await data.json();
    setData(response);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Box>
      <Box d="flex" justifyContent="space-between" alignItems="center" mb="20px">
        <Text fontSize="40px">Borrowers</Text>
      </Box>

      <TableContainer>
        <Table variant="striped" colorScheme="teal">
          <Thead>
            <Tr>
              <Th>Username</Th>
              <Th>Book</Th>
              <Th>Quantity</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((item: any) => {
              return (
                <Tr key={item._id}>
                  <Td>{item.borrower.username}</Td>
                  <Td>{item.book.title}</Td>
                  <Td>{item.quantity}</Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Borrowers;
