import { combineReducers } from 'redux';
import authReducer from './authReducer';
import consumerReducer from './consumerReducer';
import finReducer from './finReducer'

const rootReducer = combineReducers({
    auth: authReducer,
    consumer: consumerReducer,
    fin: finReducer
})

export default rootReducer;