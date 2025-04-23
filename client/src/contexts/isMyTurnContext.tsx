import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from "react";

//we only want useOnline to be called once, by something that is always mounted, so it can properly keep track of how many time the network status has changed and display the correct messages to the user. So we call it in a context and use that context to provide the isOnline information to the rest of the app.

type isMyTurnContext = {
    myTurn: boolean;
    setMyTurn: Dispatch<SetStateAction<boolean>>;
    isStarting: boolean;
    setIsStating: Dispatch<SetStateAction<boolean>>;
    ChangeTurns: () => void

}
const IsMyTurnContext = createContext<isMyTurnContext>({} as isMyTurnContext);

export function IsMyTurnProvider({ children }: { children: ReactNode }) {
    const [myTurn, setMyTurn] = useState<boolean>(false);
    const [isStarting, setIsStating] = useState<boolean>(false);

    const ChangeTurns = () => { 
        setMyTurn(prevTurn => !prevTurn);
    }

    return (
        <IsMyTurnContext.Provider
            value={{
                myTurn,
                setMyTurn,
                setIsStating,
                isStarting,
                ChangeTurns
            }}>
            {children}
        </IsMyTurnContext.Provider>
    )
}

export const useMyTurnContext = () => { return useContext(IsMyTurnContext) };