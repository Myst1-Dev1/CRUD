import { 
  Box, 
  Button, 
  Flex, 
  Text, 
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useToast
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { InputForm } from "../components/input";
import api from "../services/api";


export default function Home() {
  const toast = useToast();

  const [clients, setClients] = useState([]);
  const [ísFormOpen, setIsFormOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [id, setId] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const [errors, setErrors] = useState({name: null, email: null});

  const isValidFormData = () => {
    if(!name) {
      setErrors({name: 'Name is required'});
      return false;
    }

    if(!email) {
      setErrors({email: 'E-mail is required'});
      return false;
    }

    if(clients.some(client => client.email === email && client._id !== id)) {
      setErrors({email: 'Email already in use'});
      return;
    }

    setErrors({});
    return true;
  }

  const handleSubmitCreateClient = async (e) => {
    e.preventDefault();

    if(!isValidFormData()) return ;

    try {
      setIsLoading(true)
      const {data} = await api.post('/clients', {name, email});

      setClients(clients.concat(data.data));
      setName("");
      setEmail("");
      handleOpenForm();
      setIsLoading(false);

      toast({
        title: 'Client created',
        status: 'success',
        duration:3000,
        isClosable: true,
      })
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  const handleSubmitUpdateClient = async (e) => {
    e.preventDefault();

    if(!isValidFormData()) return ;

    try {
      setIsLoading(true)
      await api.put(`/clients/${id}`, {name, email})

      setClients(clients.map(client => client._id === id ? {name, email, _id: id} : client));

      setName("");
      setEmail("");
      setId(null);
      handleOpenForm();
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }

   
  }

  const handleShowUpdateClientForm = (client) =>  {
    setId(client._id);
    setName(client.name);
    setEmail(client.email);
    setIsFormOpen(true);
  }
 
  const handleDeleteClient = async (_id) => {
    try {
      await api.delete(`/clients/${_id}`);
      setClients(clients.filter(client => client._id !== _id))
    } catch (error) {
      console.log(error);
    }

  }

  const handleChangeName = (text) => {
    setName(text);
  }

  const handleChangeEmail = (text) => {
    setEmail(text);
  }

  const handleOpenForm = () => {
    setIsFormOpen(!ísFormOpen);
  }

 
  useEffect(() => {
    api.get('/clients').then(({data}) => {
      setClients(data.data);
    })
  }, [])

  return (
    <Box m = "4">
      <Flex justifyContent = "space-between">
        <Text fontSize = "2xl">Lista de clientes</Text>
        <Button colorScheme = "blue" onClick={handleOpenForm}>{ísFormOpen ? '-' : '+'}</Button>
      </Flex>

      {ísFormOpen && (
          <VStack my = "1" as = "form" onSubmit={id ? handleSubmitUpdateClient : handleSubmitCreateClient}>
            <InputForm 
              label = "Nome" 
              name = "name"
              value = {name}
              onChange={e => handleChangeName(e.target.value)}
              error = {errors.name}  
            />
            <InputForm 
              label = "E-mail" 
              name = "email" 
              type = "email"
              value = {email}
              onChange={e => handleChangeEmail(e.target.value)}
              error = {errors.email}  
            />
    
            <Button 
              fontSize = "md" 
              alignSelf = "flex-end" 
              colorScheme="blue" 
              type = "submit"
              isLoading={isLoading}
            >
              {id ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </VStack>
      )}
    

      <TableContainer my = "10">
        <Table variant='simple'>
          <Thead bg = "blue.500">
            <Tr>
              <Th textColor = "white">Name</Th>
              <Th textColor = "white">E-mail</Th>
              <Th textColor = "white">Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {clients.map((client, index) => (
              <Tr key = {index} bg = 'black' textColor = 'white'>
                <Td>{client.name}</Td>
                <Td>{client.email}</Td>
                <Td>
                  <Flex justifyContent="space-between">
                    <Button 
                      size="sm" 
                      fontSize="smaller" 
                      colorScheme="yellow" 
                      mr = "2" 
                      onClick={() => handleShowUpdateClientForm(client)}>Editar</Button>
                    <Button 
                      size="sm" 
                      fontSize="smaller" 
                      colorScheme="red" 
                      onClick={() => handleDeleteClient(client._id)}>Remover</Button>
                  </Flex>
                </Td>
             </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  )
}
