import React, { useState, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "";
// Access your API key (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(API_KEY);

function App() {
  const [image, setImage] = useState([]);
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");

  const handleImageUpload = (event) => {
    // 这里可能是多张图片
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImage((prev) => [...prev, reader.result]);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleQuestionChange = (event) => {
    setQuestion(event.target.value);
  };

  // Converts a File object to a GoogleGenerativeAI.Part object.
  async function fileToGenerativePart(file) {
    const base64EncodedDataPromise = new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]);
      reader.readAsDataURL(file);
    });
    return {
      inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
  }

  const handleSend = async () => {
    if (image && question) {
      try {
        // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = question;

        const fileInputEl = document.querySelector("input[type=file]");
        const imageParts = await Promise.all(
          [...fileInputEl.files].map(fileToGenerativePart)
        );

        const result = await model.generateContent([prompt, ...imageParts]);
        const response = await result.response;
        const text = response.text();

        setResponse(text);
      } catch (error) {
        console.error("Error:", error);
        setResponse("Error occurred while fetching the response.");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Image Question App</h1>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="mb-4"
        />
        {image?.map((item) => (
          <div className="mb-4">
            <img src={item} alt="Uploaded" className="w-full h-auto" />
          </div>
        ))}
        {/* {image && (
          <div className="mb-4">
            <img src={image} alt="Uploaded" className="w-full h-auto" />
          </div>
        )} */}
        <textarea
          value={question}
          onChange={handleQuestionChange}
          placeholder="Ask a question about the image..."
          className="w-full p-2 border rounded mb-4"
        />
        <button
          onClick={handleSend}
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Send
        </button>
        {response && (
          <div className="mt-4 p-2 border rounded bg-gray-50">
            <strong>Response:</strong> {response}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
