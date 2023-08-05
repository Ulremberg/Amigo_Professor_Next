"use client";
import React, { useState, useEffect } from "react";
import initSqlJs from "sql.js";
import "./QuestoesAleatorias.css";
import Question from "../Question/Question";

const SkeletonLoader = () => (
  <div className="skeleton-loader">
    <div className="skeleton-line"></div>
    <div className="skeleton-line"></div>
    <div className="skeleton-line"></div>
  </div>
);

const QuestoesAleatorias = () => {
  const [questoes, setQuestoes] = useState([]);
  const [respostas, setRespostas] = useState([]);
  const [pontuacao, setPontuacao] = useState(0);
  const [loading, setLoading] = useState(true);
  let numeroQuestao = 1;

  useEffect(() => {
    carregarQuestoes();
  }, []);

  const carregarQuestoes = async () => {
    const SQL = await initSqlJs({
      locateFile: (filename) =>
        `https://cdn.jsdelivr.net/npm/sql.js/dist/${filename}`,
    });
    const response = await fetch("/api/questoes");
    const uInt8Array = new Uint8Array(await response.arrayBuffer());
    const db = new SQL.Database(uInt8Array);

    const questoesAleatorias = [];

    const tabelas = [
      "tbl_questoes_algoritmos",
      "tbl_questoes_circuitos_digitais",
      "tbl_questoes_grafos",
      "tbl_questoes_inteligencia_artificial",
      "tbl_questoes_orientacao_objetos",
      "tbl_questoes_redes",
      "tbl_questoes_tautologia",
    ];

    tabelas.forEach((tabela) => {
      const query = `SELECT * FROM ${tabela} ORDER BY RANDOM() LIMIT 2`;
      const result = db.exec(query);
      const questoes = result[0].values;
      questoes.forEach((questao) => {
        questoesAleatorias.push({
          questao,
          tabela,
        });
      });
    });

    questoesAleatorias.sort(() => Math.random() - 0.5);

    setQuestoes(
      questoesAleatorias.map((questaoInfo, index) => ({
        ...questaoInfo,
        index,
        respostasSelecionadas: null,
      }))
    );

    setRespostas(
      questoesAleatorias.map((questaoInfo) => questaoInfo.questao[2])
    );
    setLoading(false);
  };

  // const embaralharQuestoes = () => {
  //   const shuffledQuestoes = questoes.map((questaoInfo) => ({
  //     ...questaoInfo,
  //     acertou: undefined,
  //     respostasSelecionadas: null,
  //   }));
  //   shuffledQuestoes.sort(() => Math.random() - 0.5);
  //   setQuestoes(shuffledQuestoes);
  //   setPontuacao(null);
  // };

  const verificarRespostas = () => {
    let pontuacao = 0;
    const newQuestoes = questoes.map((questaoInfo) => {
      const respostaSelecionada =
        questaoInfo.respostasSelecionadas?.toLowerCase();
      if (respostaSelecionada === questaoInfo.questao[2]) {
        pontuacao++;
        return { ...questaoInfo, acertou: true };
      }
      return { ...questaoInfo, acertou: false };
    });

    setPontuacao(pontuacao);
    setQuestoes(newQuestoes);
  };

  return (
    <>
      <h1>O Amigo do professor:</h1>
      <div id="questoes">
        {loading ? (
          <SkeletonLoader />
        ) : (
          <>
            {questoes.map((questaoInfo) => (
              <Question
                key={questaoInfo.index}
                questaoInfo={questaoInfo}
                numeroQuestao={numeroQuestao++}
                onInputChange={(value) =>
                  setQuestoes((prevState) =>
                    prevState.map((prevQuestao) =>
                      prevQuestao === questaoInfo
                        ? { ...prevQuestao, respostasSelecionadas: value }
                        : prevQuestao
                    )
                  )
                }
              />
            ))}
            <button onClick={verificarRespostas} className="btn btn-primary">
              Enviar Respostas
            </button>
            <button onClick={carregarQuestoes} className="btn btn-secondary">
              Carregar Novas Questões
            </button>
          </>
        )}
      </div>
      {pontuacao !== null && (
        <div>
          <p>Pontuação: {pontuacao}</p>
        </div>
      )}
    </>
  );
};

export default QuestoesAleatorias;
