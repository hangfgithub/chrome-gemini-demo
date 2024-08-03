import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim()) {
      let newMessage = [...messages, { text: input.trim(), type: 'user' }, { text: 'Loading...', type: 'bot' }]
      setMessages(newMessage);

       // 使用内置 AI 服务
      const session = await window.ai.createTextSession();
      // 以普通的方式返回
      const response = await session.prompt(input.trim());
      newMessage.splice(newMessage.length - 1, 1, { text: response, type: 'bot' });
      setMessages(newMessage);

      // // 以流式返回
      // const stream = await session.promptStreaming(input.trim());
      // for await (const response of stream) {
      //   newMessage.splice(newMessage.length - 1, 1, { text: response, type: 'bot' });
      //   console.log(response);
      //   setMessages(newMessage);
      // }

      setInput('');
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-10 bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-6 h-96 overflow-y-scroll">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} mb-2`}
          >
            <div
              className={`p-2 rounded-lg ${msg.type === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              <ReactMarkdown
                components={{
                  code: ({ node, inline, className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={solarizedlight}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  }
                }}
              >
                {msg.text}
              </ReactMarkdown>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="border-t border-gray-200">
        <div className="flex p-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="ask gemini anything"
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatBox;
