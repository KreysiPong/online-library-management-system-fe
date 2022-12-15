import {
  Button,
  Flex,
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
  useToast,
} from '@chakra-ui/react';
import { FC, useState } from 'react';
import RequiredFields from './RequiredFields';

const AddStudentModal: FC = ({ isOpen, onClose, setData, prevData }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [course, setCourse] = useState('');
  const [studentId, setStudentId] = useState<number>();
  const [year, setYear] = useState<number>();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const isDisabled =
    !firstName || loading || !lastName || !course || !studentId || !year || !year || !username || !email;

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setCourse('');
    setStudentId(0);
    setYear(0);
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const onModalClose = () => {
    resetForm();
    onClose();
    setLoading(false);
  };

  const addStudent = async () => {
    const body = {
      first_name: firstName,
      last_name: lastName,
      course,
      student_id: studentId,
      year,
      username,
      email,
      password,
    };

    const data = await fetch('http://localhost:3002/users/signup', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const response = await data.json();

    if (response.message === 'Successfully Created user') {
      toast({
        title: response.message,
        status: 'success',
        isClosable: true,
      });
      onClose();
      const temp = [...prevData];
      temp.push(response.data);
      setData(temp);
      onModalClose();
    } else {
      toast({
        title: response.message,
        status: 'error',
        isClosable: true,
      });
    }
  };

  return (
    <form>
      <Modal isOpen={isOpen} onClose={onModalClose} size="xl" closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Student</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex mb="16px">
              <FormControl mr="8px">
                <FormLabel>
                  First Name <RequiredFields />
                </FormLabel>
                <Input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </FormControl>
              <FormControl>
                <FormLabel>
                  Last Name <RequiredFields />
                </FormLabel>
                <Input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </FormControl>
            </Flex>
            <Flex mb="16px">
              <FormControl mr="8px">
                <FormLabel>
                  Course <RequiredFields />
                </FormLabel>
                <Input type="text" value={course} onChange={(e) => setCourse(e.target.value)} />
              </FormControl>
              <FormControl>
                <FormLabel>
                  Student Id <RequiredFields />
                </FormLabel>
                <Input type="text" value={studentId} onChange={(e) => setStudentId(+e.target.value)} />
              </FormControl>
            </Flex>
            <Flex mb="16px">
              <FormControl mr="8px">
                <FormLabel>
                  Year <RequiredFields />
                </FormLabel>
                <Input type="number" value={year} onChange={(e) => setYear(parseInt(e.target.value))} />
              </FormControl>
              <FormControl>
                <FormLabel>
                  Username <RequiredFields />
                </FormLabel>
                <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
              </FormControl>
            </Flex>
            <Flex mb="16px">
              <FormControl mr="8px">
                <FormLabel>
                  Password <RequiredFields />
                </FormLabel>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </FormControl>
              <FormControl>
                <FormLabel>
                  Confirm Password <RequiredFields />
                </FormLabel>
                <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </FormControl>
            </Flex>
            <FormControl mr="8px">
              <FormLabel>
                Email <RequiredFields />
              </FormLabel>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="teal" onClick={addStudent} disabled={isDisabled} isLoading={loading}>
              Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </form>
  );
};

export default AddStudentModal;
