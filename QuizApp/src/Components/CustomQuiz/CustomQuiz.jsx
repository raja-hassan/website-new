import React from 'react';
import CustomRadioField from '../CustomRadioField/CustomRadioField';

function CustomQuiz({ options, questionId, onAnswerSelect }) {
  return (
    <div className="quiz-wrap mb-4 p-3 rounded shadow-sm" style={{ backgroundColor: "#f9f9f9" }}>
      {options.map((option, index) => (
        <CustomRadioField
          key={`${questionId}-${index}`}
          label={option.opText}
          id={`${questionId}-option${index}`}
          name={questionId}
          onChange={() => onAnswerSelect(questionId, option.opID)}
          style={{ margin: "8px 0" }}
        />
      ))}
    </div>
  );
}

export default CustomQuiz;