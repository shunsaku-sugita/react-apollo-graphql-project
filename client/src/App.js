import { ApolloProvider } from '@apollo/client';
import { RouterProvider } from "react-router-dom";
import { client } from './apolloClient';
import { router } from './router';
import './App.css';

export const App = () => {
  return (
    <ApolloProvider client={client}>
      <RouterProvider router={router} />
    </ApolloProvider>
  );
}
