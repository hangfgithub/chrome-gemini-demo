import React, { useState } from 'react';
import ChatBox from '../../componets/ChatBox';
import Multimodal from './Multimodal'
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = '';
const genAI = new GoogleGenerativeAI(API_KEY);
// 选择一个想用的模型 这里我选择gemini-1.5-flash
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

const GoogleAIWeb = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim()) {
      let newMessage = [...messages, { text: input.trim(), type: 'user' }, { text: 'Loading...', type: 'bot' }]
      setMessages(newMessage);

      // prompt 输入的提示文本
      const result = await model.generateContent(input);
      const response = await result.response;
      const text = response.text();

      newMessage.splice(newMessage.length - 1, 1, { text, type: 'bot' });
      setMessages(newMessage);
      setInput('');
    }
  };

  return (
    <>
    <h1 className="text-3xl font-bold underline text-center">GoogleAIWeb</h1>
    {/* * 聊天框展示 */}
    {/* <ChatBox handleSubmit={handleSubmit} input={input} setInput={setInput} messages={messages}/> */}
    
    {/** 多模态聊天框展示 */}
    <Multimodal handleSubmit={handleSubmit} input={input} setInput={setInput} messages={messages}/>
    
    </>
  )
};

export default GoogleAIWeb;
