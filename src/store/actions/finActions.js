const Flutterwave = require('flutterwave-node-v3');

export const fetchAllBanks = () => {
    const flw = new Flutterwave(process.env.REACT_APP_FLW_PLK, process.env.REACT_APP_FLW_SCK);

    return async (dispatch) => {
        const response = await flw.Bank.country({"country": "NG"})
        console.log(response)

        dispatch({
            type: "FETCH_ALL_BANKS",
            response: response
        })
    }
}
