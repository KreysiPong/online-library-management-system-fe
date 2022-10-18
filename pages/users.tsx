import { Box, Button, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { FC, useEffect, useState } from 'react';

const Users: FC = () => {
  const [data, setData] = useState([]);

  const load = async () => {
    const data = await fetch('http://localhost:3002/users');
    const response = await data.json();
    setData(response.data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Box>
      <Box d="flex" justifyContent="space-between" alignItems="center" mb="20px">
        <Text fontSize="40px">Registered Students</Text>
        <Button colorScheme="blue">Add Student</Button>
      </Box>

      <TableContainer>
        <Table variant="striped" colorScheme="teal">
          <Thead>
            <Tr>
              <Th>Full Name</Th>
              <Th>Course</Th>
              <Th>Student ID</Th>
              <Th>Year</Th>
              <Th>Username</Th>
              <Th>Email</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((user: any) => {
              return (
                <Tr key={user._id}>
                  <Td>
                    {user.first_name} {user.last_name}
                  </Td>
                  <Td>{user.course}</Td>
                  <Td>{user.student_id}</Td>
                  <Td>{user.year}</Td>
                  <Td>{user.username}</Td>
                  <Td>{user.email}</Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Users;
