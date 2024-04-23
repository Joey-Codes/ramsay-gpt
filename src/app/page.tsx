'use client'

import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useContext, ChangeEvent } from 'react';
import { ToggleContext } from './components/toggleprovider';
import { SidebarContext } from './components/sidebarprovider';
import { useIsMobile } from './hooks/useIsMobile';
import axios from 'axios';
import Window from './components/window';

type MessageType = {
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([])
  const { isToggled } = useContext(ToggleContext);
  const isMobile = useIsMobile();
  const { toggleHidden } = useContext(SidebarContext);

  const handleHideSidebar = () => {
    toggleHidden();
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setIsTyping(value.trim().length > 0);
  };

  const handleMessageSubmit = async () => {
    if (inputValue !== '') {
      setIsSubmitting(true);
      const updatedMessages: MessageType[] = [
        ...messages,
        { role: "user", content: inputValue }
      ];
      setMessages(updatedMessages);
      await getResponse(updatedMessages);
      setInputValue('');
    }
    setIsSubmitting(false);
  };  
  
  const getResponse = async (messages: MessageType[]) => {
    try {
      const response = await axios.post('/api/chatgptapi', { userMessage: messages });
      const botReply = response.data.botReply;
      setMessages(prevMessages => [
        ...prevMessages,
        { role: "assistant", content: botReply }
      ]);
    } catch (err) {
      console.log("Error: ", err);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleMessageSubmit();
    }
  };

  return (
    <div className={`container-fluid ${isToggled ? `bg-customgray` : `bg-white`}`} style={{minHeight: '100vh'}}>
      <div className={`d-flex justify-content-center align-items-center ${isMobile ? "flex-column text-align" : "pt-5"}`}>
        <div className='d-flex mt-3'>
          {isMobile && (
            <button type="button" style={{border: "none", backgroundColor: "white"}} onClick={handleHideSidebar}>
              <svg width="34" height="34" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M3 8C3 7.44772 3.44772 7 4 7H20C20.5523 7 21 7.44772 21 8C21 8.55228 20.5523 9 20 9H4C3.44772 9 3 8.55228 3 8ZM3 16C3 15.4477 3.44772 15 4 15H14C14.5523 15 15 15.4477 15 16C15 16.5523 14.5523 17 14 17H4C3.44772 17 3 16.5523 3 16Z" fill="currentColor"></path>
              </svg>
            </button>
          )}
          <h1 className={`${isToggled ? `text-white` : `text-black`} ${isMobile ? "ms-3 mt-2 fs-5" : "me-5 fs-2"}`}>GordonRamsayGPT</h1>
        </div>
      </div>
      <div> 
        <Window messages={messages}/>
      </div>
      <div className='row justify-content-center pt-5 pb-5'>
        <div className={`col-12 col-md-6`}>
          <div className={`input-group ${isMobile ? "input-group-custom-m" : "input-group-custom"}`}>
            <input 
              type='text' 
              className="form-control py-2 px-3 bg-white"
              placeholder='Message Gordon Ramsay...' 
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress} 
              disabled={isSubmitting} />
            <button 
              className={`btn col-2 col-md-1 btn-outline-dark ${isToggled ? (isTyping ? 'btn-light' : 'bg-customdark2') : (isTyping ? 'btn-dark' : 'bg-customgray2')}`}
              type='button'
              onClick={handleMessageSubmit} 
              disabled={isSubmitting} >
                <svg 
                  width={isMobile ? "30" : "50"} 
                  height={isMobile ? "30" : "50"} 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  className={`${isToggled ? (isTyping ? 'text-dark' : 'text-dark') : (isTyping ? 'text-white' : 'text-white')}`}
                ><path d="M7 11L12 6L17 11M12 18V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>
            </button>
          </div>
          <div className="text-center mt-3" style={{color: "#9b9b9b", fontSize: isMobile ? "11px" : "15px"}}><span>GordonRamsayGPT can make mistakes. Consider checking important information.</span></div>
        </div>
      </div>
    </div>
  );
}
