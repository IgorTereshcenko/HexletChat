import { useState } from "react";
import ChanelBox from "../components/ChanelBox";
import Messages from "../components/Messages";
import Modals from "../components/Modals";

const Chat = () => {

    const [modalState, setModalState] = useState({ show: false, type: "" });

    const handleModal = (modalType) => {
        setModalState({ show: !modalState.show, type: modalType });
    };

    return (
        <div className="container mt-5 rounded shadow" style={{height:'80%'}}>
            <div className="row h-100 d-flex">
                <ChanelBox
                    handleModal={handleModal}/>
                <Modals
                    modalState={modalState}
                    handleModal={handleModal}/>
                <Messages/>
            </div>    
        </div>
    )
}

export default Chat;