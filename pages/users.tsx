import { Box } from '@chakra-ui/react';
import { FC } from 'react';

const Users: FC = () => {
  const fruits = [{ name: "banana" }, { name: "69" }, { name: "banana" }];


  return <div>{
    fruits.map((item) => {
      return <Box bg='tomato' w='100%' p={4} color='white' mb='16px'>
        {item.name}
      </Box>
    })
  }</div>
}




export default Users;
