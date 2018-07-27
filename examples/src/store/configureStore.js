import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import rootReducer from './reducers'
import rootSage from './sagas'

const devtools = process.env.NODE_ENV === 'development' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ 

const sagaMiddleware = createSagaMiddleware()
const enhancer = (devtools || compose)(
  applyMiddleware(sagaMiddleware)
)

export default function() {
  const store = createStore(rootReducer, enhancer)
  sagaMiddleware.run(rootSage)
  return store
}
