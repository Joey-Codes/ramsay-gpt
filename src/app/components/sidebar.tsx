import Toggle from "./toggle";
import Image from "next/image";
import { useContext, FC, useEffect, useState } from "react";
import { ToggleContext } from "./toggleprovider";
import { SidebarContext } from "./sidebarprovider";
import { useIsMobile } from "../hooks/useIsMobile";
import axios from "axios";
import "../globals.css";

type MessageType = {
  role: "user" | "assistant";
  content: string;
}

interface SidebarProps {
  conversations: MessageType[][];
}

const Sidebar: FC<SidebarProps> = ({conversations}) => {
  const { isToggled } = useContext(ToggleContext);
  const { isHidden, toggleHidden, changeConvo } = useContext(SidebarContext);
  const [prevLength, setPrevLength] = useState(0);
  const [chatSummaries, setChatSummaries] = useState<string[]>([]);
  const [sidebarConvos, setSidebarConvos] = useState<MessageType[][]>([]);
  const [activeButton, setActiveButton] = useState(-1);
  const isMobile = useIsMobile();
  

  const handleHideSidebar = () => {
    toggleHidden();
  };

  const handleChangeConvo = (index: number) => {
    changeConvo(index);
    setActiveButton(index);
    toggleHidden();
  };

  const handleNewChat = () => {
    const newChat: MessageType[] = [];
    const updatedConvos = [...conversations, newChat];
    const newIndex = updatedConvos.length - 1;
    changeConvo(newIndex);
    setActiveButton(-1);
    toggleHidden();
  };

  useEffect(() => {
    if (conversations.length > 0 && conversations[conversations.length - 1].length === 0) {
      setSidebarConvos(conversations.slice(0, -1));
    } else {
      setSidebarConvos(conversations);
    }
  }, [conversations]);

  useEffect(() => {
    const fetchChatSummary = async () => {
      const newConversationsLength = conversations.length;
      if (newConversationsLength > prevLength) {
        const lastArray = conversations[newConversationsLength - 1];
        const newMessage = lastArray.length > 0 ? lastArray[0].content : null;
        if (newMessage) { 
          try {
            const response = await axios.post('/api/chatsummarize', { userMessage: newMessage });
            const botReply = response.data.botReply;
            setChatSummaries(prevSummaries => [...prevSummaries, botReply]);
          } catch (error) {
            console.error("Error fetching chat summary:", error);
          }
          setPrevLength(newConversationsLength);
        }
      }
    };

    fetchChatSummary();
    
  }, [conversations, prevLength]);

  return (
    <div className={`offcanvas offcanvas-start ${isMobile ? (isHidden ? "" : "show") : "show"} ${isToggled ? `bg-customdark` : `bg-light`}`} tabIndex={-1} id="offcanvas" aria-labelledby="offcanvasLabel" style={{"borderRight": "none"}} >
        <div className="offcanvas-header">
            <button className={`d-flex align-items-center btn ${isToggled ? "btn-dark-custom" : "btn-light"} col-12 mt-4 fs-5`} style={{fontFamily: "Sohne", textAlign: "left"}} onClick={handleNewChat}>
              <Image 
                  src='/ramsay-pfp.png'
                  alt='ramsay-pfp'
                  width={50}
                  height={40}
                  style={{borderRadius: '50%', paddingRight: '10px'}} 
                />
              <h4 className="mt-2" style={{ paddingRight: isMobile ? '80px' : '150px' }}>New chat</h4>
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg" 
                className="icon-md ">
              <path 
                fillRule="evenodd" 
                clipRule="evenodd" 
                d="M16.7929 2.79289C18.0118 1.57394 19.9882 1.57394 21.2071 2.79289C22.4261 4.01184 22.4261 5.98815 21.2071 7.20711L12.7071 15.7071C12.5196 15.8946 12.2652 16 12 16H9C8.44772 16 8 15.5523 8 15V12C8 11.7348 8.10536 11.4804 8.29289 11.2929L16.7929 2.79289ZM19.7929 4.20711C19.355 3.7692 18.645 3.7692 18.2071 4.2071L10 12.4142V14H11.5858L19.7929 5.79289C20.2308 5.35499 20.2308 4.64501 19.7929 4.20711ZM6 5C5.44772 5 5 5.44771 5 6V18C5 18.5523 5.44772 19 6 19H18C18.5523 19 19 18.5523 19 18V14C19 13.4477 19.4477 13 20 13C20.5523 13 21 13.4477 21 14V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V6C3 4.34314 4.34315 3 6 3H10C10.5523 3 11 3.44771 11 4C11 4.55228 10.5523 5 10 5H6Z" 
                fill="currentColor"></path></svg>
              </button>
              <button type="button" className={`btn-close ${isToggled ? "btn-close-white" : ""} mb-5 text-reset ${isMobile ? "" : "d-none"}`} data-bs-dismiss="offcanvas" aria-label="Close" onClick={handleHideSidebar}></button>
        </div>
        <div className="offcanvas-body mt-5" style={{minHeight: "300px"}}>
            <h3 className='fs-5 mb-4' style={{color: "#B4B4B4"}}>Conversations</h3>
            <div className="overflow-auto"> 
            {sidebarConvos.length > 0 && sidebarConvos.map((conversation, index) => (
              <button 
                key={index}
                className={`d-flex align-items-center btn ${isToggled ? (activeButton === index ?  "bg-customgray-active" : "btn-dark-custom") : "btn-light"} ${activeButton === index ? (isToggled ? "" : "bg-customgray2") : ""} col-12 mt-2`} style={{fontFamily: "Sohne", textAlign: "left"}} onClick={() => handleChangeConvo(index)}>
                <h5 style={{paddingRight: '10px'}}>{chatSummaries[index]}</h5>
              </button>
            ))}
          </div>
        </div>
        <div className="mt-auto">
          <div className="p-3">
            <h3 className="fs-5" style={{color: "#B4B4B4"}}>Settings</h3>
            <Toggle/>
          </div>
        </div>
        <div style={{paddingTop: "300px"}}></div>
      </div>
    );
  }

  export default Sidebar;