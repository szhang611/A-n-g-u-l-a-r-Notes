export const sceneInitialState = {
    scene_id: null,
    // latestSceneid :null
};

export default (state = sceneInitialState, action = {}) => {[[]]
    switch (action.type) {
        case 'getLatestScene': // get latest scene
            return Object.assign({}, state, action.payload);
        default:
            return state;
    }
}