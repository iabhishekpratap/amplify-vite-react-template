import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from '@aws-amplify/ui-react';
const client = generateClient<Schema>();

function App() {
  const { signOut } = useAuthenticator();
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content") });
  }

  function deleteTodo(id: string) {
    client.models.Todo.delete({ id });
    setTodos(todos.filter(todo => todo.id !== id));
  }

  return (
    <main>
      <h1>My todos</h1>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            {todo.content}
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <button onClick={createTodo}>Add Todo</button>
      <button onClick={signOut}>Sign out</button>
    </main>
  );
}

export default App;