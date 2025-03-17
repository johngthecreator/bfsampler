import { createBrowserRouter, RouterProvider } from "react-router";
import { Home, Splitter } from "@/views";
import Session from './views/Session';

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <div> Something went wrong!</div>,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "splitter",
        element: <Splitter />,
      },
      {
        path: "sessions",
        element: <Session />,
      },
    ],
  },
]);


function App() {
    return (
        <RouterProvider router={router} />
    );
}

export default App;