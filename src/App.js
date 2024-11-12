import logo from "./logo.svg";
import "./App.css";
import TicTacToe from "./TicTacToe/TicTacToe";
import { useEffect, useState } from "react";
import TicTacToeWithAi from "./TicTacToe/TicTacToeWithAi";

function App() {
  const [intergrateAi, setIntergrateAi] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIntergrateAi(intergrateAi === true ? false : true)}
      >
        {intergrateAi === true ? "Switch to Ai" : "Switch 2 sv 2"}
      </button>
      <div>{intergrateAi ? <TicTacToe /> : <TicTacToeWithAi />}</div>
    </div>
  );
}

export default App;
