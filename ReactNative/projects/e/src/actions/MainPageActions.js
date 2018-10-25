/**
 * main page component select action creator
 * @param {*} component
 */
export const switchComponent = (component) => {
    return {
        type: 'switch component',
        payload: {
            hamburgerMenuSelect: component
        }
    }
};



export const currentHamburgerMarkAt = (component, displayHamburgerMenuList) => {
    return {
        type: 'Current Hamburger MarkAt',
        payload: {
            currentHamburgerMarkAt: component,
            displayHamburgerMenuList: displayHamburgerMenuList,
        }
    }
};

