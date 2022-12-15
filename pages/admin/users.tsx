import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
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
import AddStudentModal from 'component/AddStudentModal';
import { FC, useEffect, useState } from 'react';
import { BiUserX } from 'react-icons/bi';

const Users: FC = () => {
  const [data, setData] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const { isOpen: isAddStundentOpen, onOpen: onAddStundentOpen, onClose: onAddStundentClose } = useDisclosure();
  const toast = useToast();

  const load = async () => {
    setUsersLoading(true);
    const data = await fetch('http://localhost:3002/users');
    const response = await data.json();
    setData(response?.data);
    setUsersLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const onDelete = async (id) => {
    const deletableStudent = await fetch(`http://localhost:3002/users/${id}`, {
      method: 'DELETE',
    });
    const response = await deletableStudent.json();
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

  return (
    <Box>
      <Box d="flex" justifyContent="space-between" alignItems="center" mb="20px">
        <Text fontSize="40px">Registered Students</Text>
        <Button colorScheme="blue" onClick={onAddStundentOpen}>
          Add Student
        </Button>
      </Box>

      {usersLoading ? (
        <Spinner size="lg" />
      ) : (
        <>
          {data.length ? (
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
                      <Tr key={user?._id}>
                        <Td>
                          {user?.first_name} {user?.last_name}
                        </Td>
                        <Td>{user?.course}</Td>
                        <Td>{user?.student_id}</Td>
                        <Td>{user?.year}</Td>
                        <Td>{user?.username}</Td>
                        <Td>{user?.email}</Td>
                        <Td>
                          <Tooltip label="Delete Student">
                            <Button colorScheme="red" onClick={() => onDelete(user?._id)}>
                              <BiUserX />
                            </Button>
                          </Tooltip>
                          {/* <Tooltip label="Update Student">
                        <Button colorScheme="orange" ml="2" color="white">
                          <RiUserSettingsLine color="white" />
                        </Button>
                      </Tooltip> */}
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </TableContainer>
          ) : (
            <Alert status="error">
              <AlertIcon />
              <AlertTitle>No Students Found!</AlertTitle>
            </Alert>
          )}
        </>
      )}

      <AddStudentModal prevData={data} isOpen={isAddStundentOpen} onClose={onAddStundentClose} setData={setData} />
    </Box>
  );
};

export default Users;
