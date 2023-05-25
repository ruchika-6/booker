import { createContext, useReducer } from "react"

const INITIAL_STATE = {
    city:undefined,
    date:[{
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      }],
    options:{
        adult:1,
        children:0,
        room:1
    }
}

export const SearchContext = createContext(INITIAL_STATE);

const SearchReducer = (state,action) =>{
    switch(action.type){
        case "NEW_SEARCH":
            return action.payload
        case "RESET_SEARCH":
            return INITIAL_STATE
        default:
            return state
    }
}
//passed value = {} to children components
export const SearchContextProvider = ({children}) => {
    const [state,dispatch] = useReducer(SearchReducer,INITIAL_STATE);
    return(
        <SearchContext.Provider value={{city:state.city, date: state.date, options: state.options, dispatch}}>
            {children}  
        </SearchContext.Provider>
    )
}