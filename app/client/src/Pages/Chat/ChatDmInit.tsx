import React from 'react'
import ChatSearchBox from './ChatSearchBox';
import ChatOverview from './ChatOverview';
import InboxDm from './InboxDm';


export default function ChatDmInit () {
    return (
        <>
        <InboxDm />
        <div className="chat_main chat_main_init">
            <article>
                <h2>
                <img width="48" height="48" src="https://img.icons8.com/emoji/48/waving-hand-emoji.png" alt="waving-hand-emoji"/>
                Begin now your
                </h2>
                <h2>
                friend-finding journey
                </h2>
                <p>
                Use the search feature to seek out friends
                to connect, and grow your social circle
                </p>
            </article>
            <ChatSearchBox />
        </div>
        </>
    );
}