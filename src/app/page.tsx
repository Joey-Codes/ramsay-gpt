'use client'

import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useContext, ChangeEvent } from 'react';
import { ToggleContext } from './components/toggleprovider';
import { SidebarContext } from './components/sidebarprovider';
import { useIsMobile } from './hooks/useIsMobile';
import axios from 'axios';
import Window from './components/window';
import Sidebar from './components/sidebar';

type MessageType = {
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [chatWindows, setChatWindows] = useState<MessageType[][]>([[]]);
  const { isToggled } = useContext(ToggleContext);
  const isMobile = useIsMobile();
  const { selectedChatIndex, changeConvo, changeActive, toggleHidden } = useContext(SidebarContext);


  const handleHideSidebar = () => {
    toggleHidden();
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setIsTyping(value.trim().length > 0);
  };

  const handleMessageSubmit = async (windowIndex?: number) => {
    if (inputValue !== '') {
      setIsSubmitting(true);
      const updatedMessages: MessageType[] = [
        ...(windowIndex !== undefined ? chatWindows[windowIndex] : []),
        { role: "user", content: inputValue }
      ];
      setChatWindows(prevChatWindows => {
       if (windowIndex !== undefined) {
        const updatedChatWindows = [...prevChatWindows];
        updatedChatWindows[windowIndex] = updatedMessages;
        return updatedChatWindows;
       } else {
        return [...prevChatWindows, updatedMessages];
       }
      });
      await getResponse(updatedMessages, windowIndex || 0);
      setInputValue('');
    }
    setIsSubmitting(false);
  };  
  
  const getResponse = async (messages: MessageType[], windowIndex: number) => {
    try {
      const response = await axios.post('/api/chatcomplete', { userMessage: messages });
      const botReply = response.data.botReply;
      setChatWindows(prevChatWindows => {
        const updatedChatWindows = [...prevChatWindows];
        updatedChatWindows[windowIndex] = [
          ...messages,
          { role: "assistant", content: botReply }
        ];
        return updatedChatWindows;
      });
    } catch (err) {
      console.log("Error: ", err);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, windowIndex?: number) => {
    if (e.key === 'Enter') {
      handleMessageSubmit(windowIndex);
    }
  };

  const handleNewChat = () => {
    const newChat: MessageType[] = [];
    const updatedConvos = [...chatWindows, newChat];
    const newIndex = updatedConvos.length - 1;
    changeConvo(newIndex);
    changeActive(-1);
  };

  if (selectedChatIndex === chatWindows.length) {
    if (!chatWindows[selectedChatIndex - 1].length) {
      changeConvo(selectedChatIndex - 1);
    } else {
      setChatWindows(prevChatWindows => [...prevChatWindows, []]);
    }
  };

  return (
    <>
      <Sidebar conversations={chatWindows}/>
      <div className={`container-fluid ${isToggled ? 'bg-customgray' : 'bg-white'}`} style={{height: isMobile ? '93vh' : '100vh'}}>
        <div className={`d-flex justify-content-center align-items-center ${isMobile ? 'flex-column text-align border-bottom' : 'pt-5'}`}>
          <div className='d-flex mt-3'>
            {isMobile && (
              <button type="button" style={{border: 'none', backgroundColor: isToggled ? '#212121' : 'white', color: isToggled ? "white" : "black"}} onClick={handleHideSidebar}>
                <svg width="30" height="30" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M3 8C3 7.44772 3.44772 7 4 7H20C20.5523 7 21 7.44772 21 8C21 8.55228 20.5523 9 20 9H4C3.44772 9 3 8.55228 3 8ZM3 16C3 15.4477 3.44772 15 4 15H14C14.5523 15 15 15.4477 15 16C15 16.5523 14.5523 17 14 17H4C3.44772 17 3 16.5523 3 16Z" fill="currentColor"></path>
                </svg>
              </button>
            )}
            <h1 className={`${isToggled ? 'text-white' : 'text-black'} ${isMobile ? 'ms-4 mt-2 me-4 fs-4' : 'me-5 fs-2'}`}>GordonRamsayGPT</h1>
            {isMobile && (
              <button type="button" style={{border: 'none', backgroundColor: isToggled ? '#212121' : 'white', color: isToggled ? "white" : "black"}} onClick={handleNewChat}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M16.7929 2.79289C18.0118 1.57394 19.9882 1.57394 21.2071 2.79289C22.4261 4.01184 22.4261 5.98815 21.2071 7.20711L12.7071 15.7071C12.5196 15.8946 12.2652 16 12 16H9C8.44772 16 8 15.5523 8 15V12C8 11.7348 8.10536 11.4804 8.29289 11.2929L16.7929 2.79289ZM19.7929 4.20711C19.355 3.7692 18.645 3.7692 18.2071 4.2071L10 12.4142V14H11.5858L19.7929 5.79289C20.2308 5.35499 20.2308 4.64501 19.7929 4.20711ZM6 5C5.44772 5 5 5.44771 5 6V18C5 18.5523 5.44772 19 6 19H18C18.5523 19 19 18.5523 19 18V14C19 13.4477 19.4477 13 20 13C20.5523 13 21 13.4477 21 14V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V6C3 4.34314 4.34315 3 6 3H10C10.5523 3 11 3.44771 11 4C11 4.55228 10.5523 5 10 5H6Z" fill="currentColor"></path>
                </svg>
              </button>
            )}
          </div>
        </div>
        <div>
          <Window messages={chatWindows[selectedChatIndex]} />
          <div className='row justify-content-center pt-5'>
            <div className={`col-12 col-md-6`}>
              <div className={`input-group ${isMobile ? 'input-group-custom-m' : 'input-group-custom'}`}>
                <input 
                  type='text' 
                  className="form-control py-2 px-3 bg-white"
                  placeholder='Message Gordon Ramsay...' 
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={(e) => handleKeyPress(e, selectedChatIndex)} 
                  disabled={isSubmitting} />
                <button 
                  className={`btn col-2 col-md-1 btn-outline-dark ${isToggled ? (isTyping ? 'btn-light' : 'bg-customdark2') : (isTyping ? 'btn-dark' : 'bg-customgray2')}`}
                  type='button'
                  onClick={() => handleMessageSubmit(selectedChatIndex)} 
                  disabled={isSubmitting} >
                    <svg 
                      width={isMobile ? '30' : '50'} 
                      height={isMobile ? '30' : '50'} 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      className={`${isToggled ? (isTyping ? 'text-dark' : 'text-dark') : (isTyping ? 'text-white' : 'text-white')}`}
                    >
                      <path d="M7 11L12 6L17 11M12 18V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                </button>
              </div>
              <div className="text-center mt-3" style={{color: '#9b9b9b', fontSize: isMobile ? '11px' : '15px'}}><span>Note: GordonRamsayGPT is meant to be very insulting. So if you can&apos;t take the heat, get out of the kitchen.</span></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );  
}
