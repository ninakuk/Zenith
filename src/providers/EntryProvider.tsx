import { createContext, useContext } from "react";

export const EntryContext = createContext({});


// const EntryProvider = ({children}) => {
//     return (
//         <EntryContext.Provider value={{items: [], onSaveItem: () => {} }}>
//             {children}
//         </EntryContext.Provider>
//     )
// }

//export default EntryProvider;