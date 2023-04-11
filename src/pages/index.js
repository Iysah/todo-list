import Head from 'next/head'
import { useEffect, useState } from 'react'
import { Inter } from 'next/font/google'
import Navbar from '@/components/navbar'
import { createTodo, deleteTodo, readTodos, updateTodo } from '../functions'
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  List,
  ListItem,
  ListIcon,
  Flex
} from '@chakra-ui/react'
import { MdDelete } from 'react-icons/md'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const [todo, setTodo] = useState({ title: "", content: "" })
  const [todos, setTodos] = useState(null)
  const [currentId, setCurrentId] = useState(0)


  // enable users to update existing list from the form
  useEffect(() => {
    let currentTodo = currentId != 0 ? todos.find(todo => todo._id === currentId) : { title: '', content: '' }
    setTodo(currentTodo)
  }, [currentId])
  
  // clears the form field
  const clear = () => {
    setCurrentId(0)
    setTodo({ title: '', content: ''})

  }
  useEffect(() => {
    const clearField = (e) => {
      if (e.keyCode === 27) {
        clear()
      }
    }
    window.addEventListener('keydown', clearField)
    return window.removeEventListener('keydown', clearField)
  }, [])



  // fetches data 
  useEffect(() => {
    const fetchData = async () => {
      const result = await readTodos();
      setTodos(result);
    }
    fetchData()
  }, [currentId])
  


  // this funciton handles the submit process
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (currentId === 0) {
      const result = await createTodo(todo)
      setTodos([...todos, result ])
      clear()
    } else {
      await updateTodo(currentId, todo)
      clear()
    }
  }

  const removeTodo = async (id) => {
    await deleteTodo(id);

    const todosCopy = [...todos];
    todosCopy.filter(todo => todo._id !== id)
    setTodos(todosCopy);
    clear()
  }
  return (
    <div>
      <Head>
        <title>Todo List</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Navbar />
        {/* <pre>{JSON.stringify(todo)}</pre> */}
        <form onSubmit={onSubmitHandler}>
          <FormControl mb='10px'>
            <FormLabel>Title: </FormLabel>
            <Input placeholder='Enter your title here' onChange={e => setTodo({...todo, title: e.target.value })} value={todo?.title} />
          </FormControl>
          <FormControl>
            <FormLabel>List: </FormLabel>
            <Input placeholder='Enter your list here' onChange={e => setTodo({...todo, content: e.target.value })} value={todo?.content} />
          </FormControl>
          <Button
            width="150px"
            mt={4}
            colorScheme='teal'
            type='submit'
          >
            Submit
          </Button>
        </form>

        <div className='bottom'>
          {/* Preloader goes here */}

          { 
            !todos ? <div className="spinner-3"></div> : todos.length > 0 ?
              <List spacing={3} >
                {todos.map(todo => (
                  <ListItem key={todo?._id} onClick={() => setCurrentId(todo._id)} width="100%" border='1px' borderColor='gray.200' bboxShadow='sm' p='4' rounded='md' bg='white' mb="10px">
                    <h4>{todo?.title}</h4>
                    <Flex gap="10px" alignItems="center" justifyContent="space-between">
                      <p>{todo?.content}</p>
                      <ListIcon cursor="pointer" as={MdDelete} color='teal.500' onClick={() => removeTodo(todo._id) }/>
                    </Flex>
                  </ListItem>
                ))}
              </List> : <div><h4>Enter New List</h4></div>
          
          }
          
          {/* Output goes here  */}
        </div>
      </main>
    </div>
  )
}
