import React, { useState } from "react";
import ChatBox from "../../componets/ChatBox";

const BuiltIn = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim()) {
      let newMessage = [
        ...messages,
        { text: input.trim(), type: "user" },
        { text: "Loading...", type: "bot" },
      ];
      setMessages(newMessage);

      // 使用内置 AI 服务
      const session = await window.ai.assistant.create();
      // 以普通的方式返回
      const response = await session.prompt(input.trim());
      newMessage.splice(newMessage.length - 1, 1, {
        text: response,
        type: "bot",
      });
      setMessages(newMessage);

      // // 以流式返回
      // const stream = await session.promptStreaming(input.trim());
      // for await (const response of stream) {
      //   newMessage.splice(newMessage.length - 1, 1, { text: response, type: 'bot' });
      //   console.log(response);
      //   setMessages(newMessage);
      // }

      setInput("");
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold underline text-center">Built-in AI</h1>
      <ChatBox
        handleSubmit={handleSubmit}
        input={input}
        setInput={setInput}
        messages={messages}
      />
    </>
  );
};

export default BuiltIn;
