import {
  Box,
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
import { useState } from 'react';
import RequiredFields from './RequiredFields';

const AddBookModal = ({ isOpen, onClose, setData, prevData }) => {
  // ADD BOOK STATES
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [edition, setEdition] = useState('');
  const [volume, setVolume] = useState('');
  const [pages, setPages] = useState(0);
  const [publisher, setPublisher] = useState('');
  const [year, setYear] = useState('');
  const [remarks, setRemarks] = useState('');
  const [locator, setLocator] = useState('');
  const [isbn, setIsbn] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [loading, setLoading] = useState(false);
  const [className, setClassName] = useState('');
  const [sourceOfFund, setSourceOfFund] = useState('');
  const toast = useToast();

  const isDisabled =
    !title || loading || !edition || !volume || !pages || !publisher || !year || !locator || !isbn || !quantity;

  const resetForm = () => {
    setTitle('');
    setAuthor('');
    setEdition('');
    setVolume('');
    setPages(0);
    setPublisher('');
    setYear('');
    setRemarks('');
    setLocator('');
    setIsbn('');
    setSourceOfFund('');
    setClassName('');
    setQuantity(0);
  };

  const onModalClose = () => {
    resetForm();
    onClose();
    setLoading(false);
  };

  const addBook = async () => {
    setLoading(true);
    const body = {
      title,
      author,
      edition,
      class: className,
      volume,
      pages,
      publisher,
      year,
      remarks,
      locator,
      isbn,
      quantity,
      source_of_fund: sourceOfFund,
    };

    const data = await fetch('http://localhost:3002/books/create', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const response = await data.json();

    if (response.status) {
      toast({
        title: 'Add book successfully',
        status: 'success',
        isClosable: true,
      });
      onClose();
      const temp = [...prevData];
      temp.push(response.data);
      setData(temp);
    } else {
      toast({
        title: 'Error upon creating book',
        status: 'error',
        isClosable: true,
      });
    }

    onModalClose();
  };

  return (
    <form>
      <Modal isOpen={isOpen} onClose={onModalClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Book</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex justifyContent="space-evenly">
              <Box>
                <FormControl>
                  <FormLabel>
                    Title <RequiredFields />
                  </FormLabel>
                  <Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                </FormControl>
                <FormControl>
                  <FormLabel>
                    Author <RequiredFields />
                  </FormLabel>
                  <Input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} />
                </FormControl>
                <FormControl>
                  <FormLabel>
                    Edition <RequiredFields />
                  </FormLabel>
                  <Input type="text" value={edition} onChange={(e) => setEdition(e.target.value)} />
                </FormControl>
                <FormControl>
                  <FormLabel>
                    Volume <RequiredFields />
                  </FormLabel>
                  <Input type="text" value={volume} onChange={(e) => setVolume(e.target.value)} />
                </FormControl>
                <FormControl>
                  <FormLabel>
                    Pages <RequiredFields />
                  </FormLabel>
                  <Input type="number" value={pages} onChange={(e) => setPages(parseInt(e.target.value))} />
                </FormControl>
                <FormControl>
                  <FormLabel>
                    Publisher <RequiredFields />
                  </FormLabel>
                  <Input type="text" value={publisher} onChange={(e) => setPublisher(e.target.value)} />
                </FormControl>
                <FormControl>
                  <FormLabel>
                    Class <RequiredFields />
                  </FormLabel>
                  <Input type="text" value={className} onChange={(e) => setClassName(e.target.value)} />
                </FormControl>
              </Box>
              <Box>
                <FormControl>
                  <FormLabel>
                    Year <RequiredFields />
                  </FormLabel>
                  <Input type="number" value={year} onChange={(e) => setYear(e.target.value)} />
                </FormControl>
                <FormControl>
                  <FormLabel>Remarks</FormLabel>
                  <Input type="text" value={remarks} onChange={(e) => setRemarks(e.target.value)} />
                </FormControl>
                <FormControl>
                  <FormLabel>
                    Locator <RequiredFields />
                  </FormLabel>
                  <Input type="text" value={locator} onChange={(e) => setLocator(e.target.value)} />
                </FormControl>
                <FormControl>
                  <FormLabel>
                    ISBN <RequiredFields />
                  </FormLabel>
                  <Input type="text" value={isbn} onChange={(e) => setIsbn(e.target.value)} />
                </FormControl>
                <FormControl>
                  <FormLabel>Source of Fund</FormLabel>
                  <Input type="text" value={sourceOfFund} onChange={(e) => setSourceOfFund(e.target.value)} />
                </FormControl>
                <FormControl>
                  <FormLabel>
                    Quantity <RequiredFields />
                  </FormLabel>
                  <Input type="number" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))} />
                </FormControl>
              </Box>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="teal" onClick={addBook} disabled={isDisabled} isLoading={loading}>
              Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </form>
  );
};

export default AddBookModal;
