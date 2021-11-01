/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Main, UsersContainer, CreateConversation, Message,Sidebar, ConversationsContainer,  MessagesContainer, ChatText, ChatMessages} from './Style';
import {getConversations} from '../../Services/Axios/chatService';
import { useProfileUser } from '../../Context';

const ChatScreen = () => {

  const { user, startModal } = useProfileUser();
  console.log(user);

  useEffect(() => {
    getConversations(user._id, startModal);
  }, []);  

  const users = {
      "123222": {
        "status": 0,
        "userName": "Moacir"
      },
      "222321": {
        "status": 0,
        "userName": "Moacir"
      },
      "1": {
        "status": 0,
        "userName": "Moacir"
      },
      "222321111111111111111121": {
        "status": 1,
        "userName": "Moacir"
      },
      "3": {
        "status": 1,
        "userName": "Moacir"
      },
      "4": {
        "status": 1,
        "userName": "Moacir"
      },
      "5": {
        "status": 1,
        "userName": "Moaciraaaaaa"
      },
      "6": {
        "status": 1,
        "userName": "Moacir"
      },
      "7": {
        "status": 1,
        "userName": "teste"
      },
      "12314": {
        "status": 1,
        "userName": "Moacir"
      }
  };
  const currentUser = 'Moacir';
  const list = [];
  for (let key in users) {

    const user = {};
    user.conversationID = key;
    user.status = users[key].status;
    user.userName = users[key].userName;
    list.push(user);
  }

  const messages = [
    {
      "userId": "335",
      "userName": "Moacir",
      "toId": "400",
      "toUserName": "Arthur",
      "message": "eae aaaaaaaaaaaaaaaaaaaaa aaaaaa aaaaaa aaaaaa aaaaaa aaaaaa aaaaaa aaaaaa aaaaaa",
      "roomId": "",
      "date": "2021-10-24T19:00:34.135Z"
    },
    {
      "userId": "335",
      "userName": "Arthur",
      "toId": "400",
      "toUserName": "Moacir",
      "message": "opa",
      "roomId": "335400",
      "date": "2021-10-24T19:01:48.244Z"
    },
    {
      "userId": "335",
      "userName": "Moacir",
      "toId": "400",
      "toUserName": "Arthur",
      "message": "beleza? aaaaaaaa aa aa aaaaa aaaaaaaaaa aa aaaaa aaa aaaaaaaa aa aa aaaaa aaaaaaaaaa aa aaaaa aaa aaaaaaaa aa aa aaaaa aaaaaaaaaa aa aaaaa aaa aaaaaaaa aa aa aaaaa aaaaaaaaaa aa aaaaa aaa aaaaaaaa aa aa aaaaa aaaaaaaaaa aa aaaaa aaa aaaaaaaa aa aa aaaaa aaaaaaaaaa aa aaaaa aaa aaaaaaaa aa aa aaaaa aaaaaaaaaa aa aaaaa aaa aaaaaaaa aa aa aaaaa aaaaaaaaaa aa aaaaa aaa aaaaaaaa aa aa aaaaa aaaaaaaaaa aa aaaaa aaa aaaaaaaa aa aa aaaaa aaaaaaaaaa aa aaaaa aaa aaaaaaaa aa aa aaaaa aaaaaaaaaa aa aaaaa aaa aaaaaaaa aa aa aaaaa aaaaaaaaaa aa aaaaa aaa aaaaaaaa aa aa aaaaa aaaaaaaaaa aa aaaaa aaa aaaaaaaa aa aa aaaaa aaaaaaaaaa aa aaaaa aaa aaaaaaaaaaaaaaa",
      "roomId": "335400",
      "date": "2021-10-24T19:01:56.173Z"
    },
    
  ];

  const toFormatDate = (date) => {
    const d = new Date(date);
    let hour = d.getHours();
    let minute = d.getMinutes();
    let day = d.getDate();
    let month = d.getMonth() + 1;
    let year = d.getFullYear();

    if(minute < 10)
      minute = "0" + String(minute); 

    return `${day}/${month}/${year}  -  ${hour}:${minute}`;
  };

  console.log(list);
  return (
    <Main>
      <UsersContainer>
        <Sidebar>
          <ConversationsContainer>
            <CreateConversation>
              <h3>
                Iniciar conversa
              </h3>
              </CreateConversation>
            {list.map((item, index) => (
              <MessagesContainer>
                {item.status === 1 ?<h4 style={{color: "red"}}>{item.userName}</h4> : <h4>{item.userName}</h4>}
              </MessagesContainer>
            ))}
          </ConversationsContainer>
        </Sidebar>
        <ChatText>
            <ChatMessages>
              {messages.reverse().map((item, index) => (
                <Message size={item.message.lenght} color={currentUser == item.userName ? "#7fffd4" : "#ccc"} margin={currentUser == item.userName ? -15 : 15}>
                  {toFormatDate(item.date)} {item.userName !== currentUser ? "Eu" : item.userName}:
                    <br />
                    <br />

                    {item.message}
                </Message>
              ))}
            </ChatMessages>
        </ChatText>
      </UsersContainer>
    </Main>
  );
};

export default ChatScreen;
