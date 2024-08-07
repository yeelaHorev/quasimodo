import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from "react";

//we only want useOnline to be called once, by something that is always mounted, so it can properly keep track of how many time the network status has changed and display the correct messages to the user. So we call it in a context and use that context to provide the isOnline information to the rest of the app.

type nicknameContext = {
    nickname: string;
    setNickname: Dispatch<SetStateAction<string>>;
}
const NicknameContext = createContext<nicknameContext>({} as nicknameContext);

export function NicknameProvider({ children }: { children: ReactNode }) {
    const [nickname, setNickname] = useState<string>("");

    return (
        <NicknameContext.Provider
            value={{
                nickname,
                setNickname
            }}>
            {children}
        </NicknameContext.Provider>
    )
}

export const useNicknameContext = () => { return useContext(NicknameContext) };