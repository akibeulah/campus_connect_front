const initialState = {
    banks: []
}

const finReducer = (state = initialState, action) => {
    switch (action.type) {
        case "FETCH_ALL_BANKS":
            return {
                ...initialState,
                banks: action.response
            }
    }
}