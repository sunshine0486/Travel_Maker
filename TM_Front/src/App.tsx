import Comments from "./comments/pages/Comments"

import { Container } from "@mui/material"
import Header from "./main/components/Header"
// import MainPage from "./main/pages/MainPage"
import AdminTabs from "./admin/pages/AdminTabs"

export default function App() {

  return (
    <>
    {/* main */}
      {/* <CssBaseline /> */}
      <Header />
      {/* <Container maxWidth="lg">
        <MainPage />
      </Container> */}
    {/* comment */}
      <Comments boardId={1} loggedInUser={{ id: 1 }} />
    {/* admin */}
      <Container maxWidth="lg">
        <AdminTabs />
      </Container>
    </>
  )
}

