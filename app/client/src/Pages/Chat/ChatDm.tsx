import React, {useEffect, useRef, useContext, useState} from 'react'
import { useParams, Navigate } from 'react-router-dom'
import ChatHeader from './ChatHeader';
import io, {Socket} from 'socket.io-client'
import UserContext from '../../Context/UserContext';
import { InboxItem, MessageData, PlayerData, User } from '../../../../global/Interfaces';
import MessageBox from '../../Components/MessageBox';
import axios from 'axios'
import InboxDm from './InboxDm';
import ContactDetail from './ContactDetail';
import { getUserImage } from '../../Hooks/getUserImage';
import InboxContext from '../../Context/InboxContext';
import useEffectOnUpdate from '../../Hooks/useEffectOnUpdate';
import { handleReceivedMsg, updateInbox ,updateInboxBySending ,updateInboxByReceiving} from '../../Helpers/chatdm.utils';
import useChatOverview, { fetchChatOverview } from '../../Hooks/useChatOverview';
import ChatWindow from "./ChatWindow"
import ChatOverview from './ChatOverview';
import {scrollLogic} from "./scrollLogic"
import ChatInput from './chatInput';

export default function ChatDm () {
    const {user} = useContext(UserContext)
    const {id} = useParams()
    let viewId = Number(id);
    const {inboxList, setInboxList, setUpdate} = useContext(InboxContext)
    
    const [userOverview, setUserOverview] = React.useState<PlayerData>({} as PlayerData);
    const [socket, setSocket] = useState<Socket | null>(null)
    const [messageToSendValue, setMessageToSendValue] = useState<string>("");
    const [messagesList, setMessagesList] = useState<MessageData[]>([]);
    const [avatar, setAvatar] = useState<string>();

    const {outerDiv, innerDiv, prevInnerDivHeight} = useContext(InboxContext)

    function handleSubmit (e: React.FormEvent<HTMLElement>) {
        e.preventDefault()
        if (messageToSendValue.trim() !== "") {
            const sendMsg: MessageData = {
                receiverId: viewId,
                authorId: user.id,
                message: messageToSendValue,
                creationTime : new Date().toString()
            }
            setMessageToSendValue("")
            setMessagesList((prevList:MessageData[]) => {
                return [...prevList, sendMsg]
            })
            socket?.emit('SendMessage', sendMsg)
            updateInboxBySending(sendMsg, setInboxList);
        }
    }
    
    
    const loadConversation = async ()  => {
        try {
            const res = await axios.get(`../api/chat/${id}`)
            setMessagesList(res.data)
        } catch (error) {
            console.log(error);
        }
    }

    /**EFFECTS     */
    useEffectOnUpdate(() => {

        const value = document.cookie.split('=')[1]
        const newSocket = io('ws://localhost:4000', {
            auth: {
              token: value
            }})
        setSocket(newSocket)
        if (id === undefined)
          return ;
        fetchChatOverview(viewId, setUserOverview)
        loadConversation();
        // setInboxList((prevInbox:InboxItem[]) => {
        //     return prevInbox.map((inbx) => {
        //         return inbx.author?.id === viewId ? {...inbx, unseenMessages: 0}: inbx
        //     })
        // })

        //cleanup function
        return  () => {
            if (socket)
                socket.disconnect()
            viewId = 0
        }
    } 
    , [viewId])


    useEffect(() => {
        socket?.on('message', (recMsg: MessageData) => {
            console.log("recMsg", recMsg);
            if (recMsg.authorId === viewId)
                setMessagesList((prevMsgs) => [...prevMsgs, recMsg])
            updateInboxByReceiving(recMsg, setInboxList, recMsg.authorId === viewId);
        })
    }, [socket])

    useEffectOnUpdate(() => {
        scrollLogic(outerDiv, innerDiv, prevInnerDivHeight);
    }, [messagesList])

    useEffectOnUpdate(scrollLogic(outerDiv, innerDiv, prevInnerDivHeight), [messagesList])

    const messagesElements = messagesList.map((msg:MessageData) => {
        if (msg.message !== "") {
            return (
                <MessageBox
                // key={msg.creationTime?.getTime()}
                id={msg.authorId !== user?.id}
                >
                {msg.message}
            </MessageBox>
           )
        } 
        return null
    })
    
    return (
        <>
            <InboxDm/>
            <div className="chat_main">
                <ChatHeader
                id={id}
                avatar={userOverview.image}
                username={userOverview.username}
                online={true}
                />

                <ChatWindow id={id}>
                    {messagesElements}
                </ChatWindow>
                <ChatInput 
                message={messageToSendValue} 
                setMessage={setMessageToSendValue} 
                sender={handleSubmit} 
                id={id} 
                />
            </div>
            {/* <ContactDetail oview={userOverview} id={(String(id))}/> */}
            <ChatOverview oview={userOverview} id={id}/>
    </>
    );
}