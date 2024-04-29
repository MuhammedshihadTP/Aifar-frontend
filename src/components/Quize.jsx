import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Box,
} from "@mui/material";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';

function Quize() {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const totalQuestions = questions.length;
  const [attendedQuestions, setAttendedQuestions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({}); // State to store selected options

  const handleNext = () => {
    if (currentQuestion < totalQuestions) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };




  const handlePrev = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleQuestionClick = (questionNumber) => {
    setCurrentQuestion(questionNumber);
  };

  const handleOptionSelect = (optionIndex, questionId) => {
    setSelectedOptions({
      ...selectedOptions,
      [questionId]: optionIndex,
    });
  };

  const handleSubmit = async () => {
    try {

    console.log("Submitted:", selectedOptions);
    const response = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/check-answer`,selectedOptions)
   
      toast.success(response.mesage)
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    } catch (error) {
   
      toast.error(error.response.data.message)
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    }
    
  };

  const fetchQustions = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_API_URL}/qustions`
      );
      setQuestions(response.data);
    } catch (error) {}
  };

  useEffect(() => {
    fetchQustions();
  }, []);

  const currentQuestionData = questions[currentQuestion - 1];

 
  const allQuestionsAttended = Object.keys(selectedOptions).length === totalQuestions;

  return (
    <>
    <ToastContainer/>
     
      <div
        style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" }}
      >
        <div>
          <Paper
            elevation={3}
            sx={{ marginTop: "20px", width: "100%", height: "auto" }}
          >
            <div style={{ margin: "20px" }}>
              <Typography variant="h6" gutterBottom>
                Question {currentQuestion}:
              </Typography>

              <Typography>
                {currentQuestionData?.question}
              </Typography>
            </div>
          </Paper>

          {currentQuestionData?.options?.map((option, index) => (
            <Paper
              key={index}
              elevation={3}
              sx={{
                marginTop: "20px",
                width: "100%",
                height: "40px",
                backgroundColor:
                  selectedOptions[currentQuestionData.id] === index ? "#9b59b6" : "",
              }}
              onClick={() => handleOptionSelect(index, currentQuestionData.id)}
            >
              <Typography sx={{ margin: "20px", color: selectedOptions[currentQuestionData.id] === index ? "white" : "" }}>
                {option}
              </Typography>
            </Paper>
          ))}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              marginTop: "20px",
              width: "90%",
            }}
          >
            <Button
              variant="contained"
              onClick={handlePrev}
              disabled={currentQuestion === 1}
            >
              Previous
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={currentQuestion === totalQuestions}
            >
              Next
            </Button>
          </Box>

          <Paper
            elevation={3}
            sx={{ marginTop: "20px", width: "100%", height: "auto" }}
          >
            <div style={{ margin: "20px" }}>
              <Typography variant="h6" gutterBottom>
                Explanation
              </Typography>
              <Typography>
                {currentQuestionData?.explanation}
              </Typography>
            </div>
          </Paper>

          {allQuestionsAttended && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                marginTop: "20px",
              }}
            >
              <Button variant="contained" onClick={handleSubmit}>
                Submit
              </Button>
            </Box>
          )}
        </div>

        <div>
          <Paper
            elevation={3}
            style={{ marginTop: "20px", height: "auto", padding: "20px" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                marginBottom: "20px",
                flexWrap: "wrap",
              }}
            >
              {[...Array(totalQuestions)].map((_, index) => (
                <div
                  key={index}
                  onClick={() => handleQuestionClick(index + 1)}
                  style={{
                    backgroundColor: selectedOptions[index + 1] !== undefined ? "#9b59b6" : "black",
                    color: selectedOptions[index + 1] !== undefined ? "white" : "white",
                    borderRadius: "50%",
                    width: "50px",
                    height: "50px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "10px",
                    cursor: "pointer",
                  }}
                >
                  <Typography variant="body1">{index + 1}</Typography>
                </div>
              ))}
            </div>
            <Typography sx={{ margin: "20px" }}>Questions Attended</Typography>
          </Paper>
        </div>
      </div>
    </>
  );
}

export default Quize;
