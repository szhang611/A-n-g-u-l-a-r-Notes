import { createStore, combineReducers, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import promise from 'redux-promise';
import { composeWithDevTools } from 'redux-devtools-extension';

import AppReducer, { appInitialState } from './reducers/AppReducer';
import InitReducer, { initInitialState } from './reducers/InitReducer';
import SceneReducer, { sceneInitialState } from './reducers/SceneReducer';
import MainPageReducer, { mainPageInitialState } from './reducers/MainPageReducer';
import NavigationReducer, {navState} from './reducers/NavigationReducer';
import SocialReducer, {socialInitialState} from './reducers/SocialReducer';

const logger = createLogger();

const initialState = {
    app: appInitialState,
    nav: navState,
    init: initInitialState,
    scene: sceneInitialState,
    hamburgerActions: mainPageInitialState,
    socialMsg: socialInitialState,
};

const composeEnhancers = composeWithDevTools({ realtime: true });
export default (state = initialState) => (createStore(
    combineReducers({
        app: AppReducer,
        nav: NavigationReducer,
        init: InitReducer,
        scene: SceneReducer,
        hamburgerActions: MainPageReducer,
        socialMsg: SocialReducer,
    }), state,
    composeEnhancers(
        applyMiddleware(logger, promise)
    )
));
