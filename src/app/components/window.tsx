import '../globals.css';
import Image from "next/image";
import { useContext, useRef, useEffect } from 'react';
import { ToggleContext } from './toggleprovider';
import { useIsMobile } from '../hooks/useIsMobile';

type MessageType = {
  role: "user" | "assistant";
  content: string;
};

export default function Window({ messages }: { messages: MessageType[] }) {
  const { isToggled } = useContext(ToggleContext);
  const isMobile = useIsMobile();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className={`container ${isToggled ? `bg-customgray` : `bg-white`}`} style={{ height: isMobile ? '65vh' : '70vh', width: isMobile ? '100%': '50vw', overflowY: 'auto', marginTop: '30px'}}>
      <div>
        {messages != undefined && messages.length === 0 && (
          <div style={{ position: 'absolute', top: '45%', left: isMobile ? '50%': '53%', transform: 'translate(-50%, -50%)', zIndex: 999 }}>
            <Image
              src="/gordon-ramsay.png"
              alt='gordon-ramsay'
              width={isMobile ? 100 : 200}
              height={isMobile? 50: 100}
              style={{ display: 'block', margin: '0 auto' }} 
            />
            <h2 className={`${isToggled ? `text-white` : `text-black`}`} style={{ position: 'relative', textAlign: 'center', width: '100%'}}>How can I help you today?</h2>
          </div>
        )}
        {messages != undefined && messages.map((message, index) => (
          <div className="row" key={index}>
            {message.role === "assistant" && (
              <div className="col-auto">
                <Image 
                  src='/ramsay-pfp.png'
                  alt='ramsay-pfp'
                  width={isMobile ? 40 : 50}
                  height={isMobile ? 40: 50}
                  style={{ borderRadius: '50%' }} 
                />
              </div>
            )}
            <div className={`col`}>
            <div className={message.role === "assistant" ? (isMobile ? "bot-message-m" : "bot-message") : (isMobile ? "user-message-m" : "user-message")}>
              {message.content}
            </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>
    </div>
  );
}
