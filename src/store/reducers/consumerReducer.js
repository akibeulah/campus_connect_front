const initialState = {
    transactions: [],
}

const consumerReducer = (state = initialState, action) => {
    switch (action.type) {
        case "REFRESH_TRANSACTIONS":
            if (action.user_type === "consumer") {
                return {
                    ...initialState,
                    transactions: action.transactions
                }
            }
            break
        default:
            return state
    }
}

export default consumerReducer