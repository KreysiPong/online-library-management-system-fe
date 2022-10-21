import { Box, Button, Spinner, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tooltip, Tr } from '@chakra-ui/react';
import { FC, useEffect, useState } from 'react';
import { BiUserX } from 'react-icons/bi';
import { RiUserSettingsLine } from 'react-icons/ri';

const Users: FC = () => {
  const [data, setData] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  const load = async () => {
    setUsersLoading(true);
    const data = await fetch('http://localhost:3002/users');
    const response = await data.json();
    setData(response.data);
    setUsersLoading(false);
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

      {usersLoading ? (
        <Spinner size="lg" />
      ) : (
        <TableContainer>
          <Table variant="striped" colorScheme="teal" size="sm">
            <Thead>
              <Tr>
                <Th>Full Name</Th>
                <Th>Course</Th>
                <Th>Student ID</Th>
                <Th>Year</Th>
                <Th>Username</Th>
                <Th>Email</Th>
                <Th>Actions</Th>
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
                    <Td>
                      <Tooltip label="Delete Student">
                        <Button colorScheme="red">
                          <BiUserX />
                        </Button>
                      </Tooltip>
                      <Tooltip label="Update Student">
                        <Button colorScheme="orange" ml="2" color="white">
                          <RiUserSettingsLine color="white" />
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
    </Box>
  );
};

export default Users;
