import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import '../src/styles/App.css';
import { testStr } from './utils/constants';

const App = () => {
  const characterLength = useRef(0);
  const testTextAsArr = useRef(testStr.split(''));
  // const enteredTextArr = useRef('');
  const idxToCheck = useRef(0);
  const inputRef = useRef<any>();
  const backspaceFlag = useRef(false);
  const timerCalled = useRef(false);
  const setIntervalRef = useRef(0);

  const [indexToRender, setIndexToRender] = useState(0);
  const [timer, setTimer] = useState(0);
  const [end, setEnd] = useState(false);

  useEffect(() => {
    if (timer === 10) {
      clearInterval(setIntervalRef.current);
      setEnd(true);
    }
  }, [timer]);

  const calculateLPS = () => {
    if (timer === 0) return 0;
    return (characterLength.current / timer).toFixed(2);
  };

  const startCountdown = () => {
    if (!timerCalled.current) {
      setIntervalRef.current = setInterval(() => setTimer((p) => p + 1), 1000);
    }
    timerCalled.current = true;
  };

  const handleOnChange = (ch: string) => {
    startCountdown();
    // console.log(ch, ch[characterLength.current], characterLength.current);
    if (ch === '') {
      characterLength.current = 0;
      idxToCheck.current = 0;
      setIndexToRender(0);
    } else {
      // if (ch[characterLength.current] === ' ') {
      //   enteredTextArr.current = ch;
      //   if (enteredTextArr.current === testTextAsArr.current[idxToCheck.current]) {
      //     console.log('matched');
      //     idxToCheck.current++;
      //   }
      // }
      if (
        !backspaceFlag.current &&
        characterLength.current === idxToCheck.current &&
        ch[characterLength.current] === testStr[idxToCheck.current]
      ) {
        console.log('matched', idxToCheck.current);
        idxToCheck.current++;
        setIndexToRender((p) => p + 1);
      }
      if (!backspaceFlag.current) characterLength.current++;
    }
    backspaceFlag.current = false;
  };

  const handleDeletes = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && characterLength.current > 0) {
      backspaceFlag.current = true;
      if (characterLength.current <= idxToCheck.current) {
        idxToCheck.current--;
        setIndexToRender((p) => p - 1);
      }
      characterLength.current--;
    }
    // if(key === "Delete")
    if (e.ctrlKey) {
      e.preventDefault();
    }
  };

  return (
    <div className="typingContainer">
      <div>{`${calculateLPS()} ${timer}`}</div>
      <div className="typingTextContainer">
        {testTextAsArr.current.map((ch, i) => (
          <h3
            style={{ whiteSpace: 'pre', color: i <= indexToRender - 1 ? 'green' : 'white' }}
            key={i}
          >
            {/* {i === testTextAsArr.current.length - 1 ? ch : `${ch} `} */}
            {ch}
          </h3>
        ))}
      </div>
      <input
        autoFocus
        ref={inputRef}
        disabled={end}
        placeholder="Start typing to begin"
        onChange={(e) => handleOnChange(e.target.value)}
        className="styledInput"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => inputRef.current.focus()}
        onKeyDown={(e) => handleDeletes(e)}
      />
    </div>
  );
};

export default App;
