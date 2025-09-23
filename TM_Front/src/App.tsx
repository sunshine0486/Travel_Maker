import Comments from "./comments/Comments"

function App() {

  return (
    <>
      <Comments boardId={1} loggedInUser={{ id: 1 }} />
    </>
  )
}

export default App
