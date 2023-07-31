"use client";
import React, { useState } from "react";
import initSqlJs from "sql.js";

const QuestoesAleatorias = () => {
  const [questoes, setQuestoes] = useState([]);
  const [respostas, setRespostas] = useState([]);
  const [pontuacao, setPontuacao] = useState(0);

  const tabelaAssuntoMap = {
    tbl_questoes_algoritmos: "Algoritmos",
    tbl_questoes_circuitos_digitais: "Circuitos Digitais",
    tbl_questoes_grafos: "Grafos",
    tbl_questoes_inteligencia_artificial: "Inteligência Artificial",
    tbl_questoes_orientacao_objetos: "Orientação a Objetos",
    tbl_questoes_redes: "Redes",
    tbl_questoes_tautologia: "Tautologia",
  };

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
  };

  const verificarRespostas = () => {
    let pontuacao = 0;
    questoes.forEach((questaoInfo) => {
      const respostaSelecionada =
        questaoInfo.respostasSelecionadas?.toLowerCase();
      if (respostaSelecionada === questaoInfo.questao[2]) {
        pontuacao++;
      }
    });
    setPontuacao(pontuacao);
  };

  return (
    <>
      <h1>O Amigo do professor:</h1>
      <div id="questoes">
        {questoes.length === 0 ? (
          <button onClick={carregarQuestoes} className="btn btn-primary">
            Carregar Questões Aleatórias
          </button>
        ) : (
          <>
            {questoes.map((questaoInfo) => (
              <div
                key={questaoInfo.index}
                className={`question col-8 ${
                  questaoInfo.respostasSelecionadas
                    ? questaoInfo.respostasSelecionadas ===
                      questaoInfo.questao[2]
                      ? "acertou"
                      : "errou"
                    : ""
                }`}
              >
                <p>
                  Questão {questaoInfo.index + 1} (Assunto:{" "}
                  {tabelaAssuntoMap[questaoInfo.tabela]}):
                </p>
                <p>{questaoInfo.questao[1]}</p>
                <div style={{ marginBottom: "10px" }} className="col-12">
                  <div className="col linha">
                    <input
                      type="radio"
                      name={`questao_${questaoInfo.index}`}
                      value="A"
                      onChange={() => (questaoInfo.respostasSelecionadas = "A")}
                    />
                    {questaoInfo.questao[3]}
                  </div>
                  <div className="col linha">
                    <input
                      type="radio"
                      name={`questao_${questaoInfo.index}`}
                      value="B"
                      onChange={() => (questaoInfo.respostasSelecionadas = "B")}
                    />
                    {questaoInfo.questao[4]}
                  </div>
                  <div className="col linha">
                    <input
                      type="radio"
                      name={`questao_${questaoInfo.index}`}
                      value="C"
                      onChange={() => (questaoInfo.respostasSelecionadas = "C")}
                    />
                    {questaoInfo.questao[5]}
                  </div>
                  <div className="col linha">
                    <input
                      type="radio"
                      name={`questao_${questaoInfo.index}`}
                      value="D"
                      onChange={() => (questaoInfo.respostasSelecionadas = "D")}
                    />
                    {questaoInfo.questao[6]}
                  </div>
                </div>
                <hr />
              </div>
            ))}
            <button onClick={verificarRespostas} className="btn btn-primary">
              Enviar Respostas
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
