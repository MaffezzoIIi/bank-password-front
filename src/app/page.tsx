"use client";
import { Delete } from "lucide-react";
import { useEffect, useState } from "react";

interface Pairs {
  pairs?: number[][];
  validator?: number;
}

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [randomPairs, setRandomPairs] = useState<Pairs | undefined>(undefined);

  const [pairs, setPairs] = useState<number[][]>([]);

  useEffect(() => {
    fetch("http://localhost:8080/pairs")
      .then((response) => response.json())
      .then((data) => setRandomPairs(data));
  }, []);

  const onHandleButtonClick = (pair: number[]) => {
    setInputValue((prev) => prev + "*");

    setPairs((prev) => [...prev, pair]);
  };

  const handleSubmit = () => {
    fetch("http://localhost:8080/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password: pairs, validator: randomPairs?.validator, pairs: randomPairs?.pairs }),
    }).then((response) => {
      if (response.ok) {
        alert("Acesso permitido");
      } else {
        alert("Acesso negado");
      }
    });

    setPairs([]);
  }

  const buttonsClasses = "bg-slate-200 text-black p-2 rounded-lg text-center flex justify-center cursor-pointer hover:bg-slate-300 transition duration-100";

  return (
    <div className="flex flex-col justify-center items-center h-screen ">
      <div className="bg-blue-200 p-4 rounded-md flex gap-4">
        <div className="grid grid-col justify-center items-center gap-4">
          <p className="text-4xl">Teclado bancario</p>
          <div className="flex flex-col gap-2">
            <label htmlFor="">Insira sua senha nos botões ao lado</label>
            <input
              type="password"
              className="border border-slate-700 rounded-md"
              readOnly
              value={inputValue}
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 bg-slate-50 p-4 rounded-md">
          {randomPairs && randomPairs?.pairs?.map((pair, index) => (
            <button
              key={index}
              className={buttonsClasses}
              onClick={() => onHandleButtonClick(pair)}>
              {pair[0]} ou {pair[1]}
            </button>
          ))}
          <button className={buttonsClasses} onClick={() => {
            setInputValue((prev) => prev.slice(0, -1));
            setPairs((prev) => prev.slice(0, -1));
            setInputValue("");
          }}><Delete /></button>
          <div className="col-span-3 grid grid-cols-2 gap-2 ">
            <button className={buttonsClasses} onClick={handleSubmit}>Acessar</button>
            <button className={buttonsClasses} onClick={() => {
              setInputValue("");
            }}>Limpar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
