const initialState = {
    transactions: [],
    handover: [],
    messages: []
}

const consumerReducer = (state = initialState, action) => {
    switch (action.type) {
        case "REFRESH_TRANSACTIONS":
            if (action.user_type === "consumer" || action.user_type === "vendor") {
                if (state.transactions !== action.transactions)
                {
                    return {
                        ...state,
                        transactions: action.transactions
                    }
                }
            }
            break
        case "REFRESH_HANDOVER":
            if (state.handover !== action.handover)
            {
                return {
                    ...state,
                    handover: action.handover
                }
            }
            break
        case "REFRESH_MESSAGES":
            if (state.messages !== action.messages)
            {
                return {
                    ...state,
                    messages: action.messages
                }
            }
        default:
            return state
    }
}

export default consumerReducer