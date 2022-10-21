import { Box, Spinner, Table, TableContainer, Tag, Tbody, Td, Text, Th, Thead, Tr, useToast } from '@chakra-ui/react';
import dayjs from 'dayjs';
import { FC, useEffect, useState } from 'react';

const Borrowers: FC = () => {
  const [data, setData] = useState([]);
  const [borrowersLoading, setBorrowersLoading] = useState(false);
  const toast = useToast();

  const load = async () => {
    setBorrowersLoading(true);
    const data = await fetch('http://localhost:3002/borrow/audit-log');
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
        <Text fontSize="40px">Audit Log</Text>
      </Box>

      {borrowersLoading ? (
        <Spinner size="lg" />
      ) : (
        <TableContainer>
          <Table size="sm" colorScheme="teal">
            <Thead>
              <Tr>
                <Th>Username</Th>
                <Th>Book</Th>
                <Th>Quantity</Th>
                <Th>Date Borrowed</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.map((item: any) => {
                return (
                  <Tr key={item._id}>
                    <Td>{item.borrower.username}</Td>
                    <Td>{item.book.title}</Td>
                    <Td>{item.quantity}</Td>
                    <Td>{dayjs(item.createdAt).format('MMM DD, YYYY - hh:mm')}</Td>
                    <Td>
                      <Tag colorScheme={item.returned ? 'green' : 'red'}>
                        {item.returned ? 'Returned' : 'Not Returned'}
                      </Tag>
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

export default Borrowers;
