import React, {useState} from 'react'
// import TopicRoom from './TopicRoom';
// import Rooms from './PublicRooms';
// import { nanoid } from 'nanoid';

// export default function InboxRooms () {

//     const [PublicMode, setPublicMode] = useState<boolean>(true)
//     const [ProtectedMode, setProtectedMode] = useState<boolean>(true)
//     const [PrivateMode, setPrivateMode] = useState<boolean>(true)
//     const initState = false;
//     return (
//         <div>
//             <section className="inbox">
//                 <nav>
//                     <button>Messages<span></span></button>
//                     <button className="active">Channels<span></span></button>
//                 </nav>
//                 {
//                 initState 
//                 &&
//                     <aside>
//                         <p>No DMs available Yet
//                         Unlock a world of gaming
//                         excitement, by creating 
//                         or joining existing ones
//                         </p>
//                     </aside>
//                 }
//                 <div className="contentRooms">
//                     <TopicRoom roomType="Public Channels" mode={PublicMode} setter={setPublicMode} />
//                     {PublicMode && <Rooms />}
//                     <TopicRoom roomType="Protected Channels"mode={ProtectedMode} setter={setProtectedMode} />
//                     {ProtectedMode && <Rooms />}
//                     {/* <ProtectedRooms /> */}
//                     <TopicRoom roomType="Private Channels" mode={PrivateMode} setter={setPrivateMode} />
//                     {PrivateMode && <Rooms />}
//                     {/* <PrivateRooms /> */}
//                 </div>
//             </section>
//         </div>
//     );
// }


export default function InboxRooms () {
    return (
        <div className="chat_inbox">
            <h2>ROOMS MESSAGES</h2>
        </div>
    );
}