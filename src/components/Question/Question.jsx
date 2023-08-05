import React from "react";
import RadioInput from "../RadioInput/RadioInput";

const decideBackground = (questaoInfo) => {
  return questaoInfo.acertou === true
    ? "acertou"
    : questaoInfo.acertou === false
    ? "errou"
    : "";
};

const tabelaAssuntoMap = {
  tbl_questoes_algoritmos: "Algoritmos",
  tbl_questoes_circuitos_digitais: "Circuitos Digitais",
  tbl_questoes_grafos: "Grafos",
  tbl_questoes_inteligencia_artificial: "Inteligência Artificial",
  tbl_questoes_orientacao_objetos: "Orientação a Objetos",
  tbl_questoes_redes: "Redes",
  tbl_questoes_tautologia: "Tautologia",
};
const Question = ({ questaoInfo, numeroQuestao, onInputChange }) => (
  <div
    key={questaoInfo.index}
    className={`question col-8 ${decideBackground(questaoInfo)}`}
  >
    <p>
      Questão {numeroQuestao} (Assunto: {tabelaAssuntoMap[questaoInfo.tabela]}):
    </p>
    <p>{questaoInfo.questao[1]}</p>
    <div style={{ marginBottom: "10px" }} className="col-12">
      {["A", "B", "C", "D"].map((value) => (
        <RadioInput
          key={value}
          name={`questao_${questaoInfo.index}`}
          value={value}
          label={questaoInfo.questao[value.charCodeAt(0) - 65 + 3]}
          onChange={() => {
            onInputChange(value);
          }}
          checked={questaoInfo.respostasSelecionadas === value}
        />
      ))}
    </div>
    <hr />
  </div>
);
export default Question;
