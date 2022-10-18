import { Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { FC } from "react";

const TableList: FC<{ data: any }> = ({ data }) => {
    return (
        <>
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
                            data?.map((book: any) => {
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
        </>
    )
}

export default TableList