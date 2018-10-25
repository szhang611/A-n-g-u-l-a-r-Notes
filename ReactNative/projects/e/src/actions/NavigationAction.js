/**
 * navigation action:
 * @param {*} from, from_subTab, to, to_subTab, params
 * * * * * * * * * * * * * * * * * * * * * * * *
 * All tabs and sub tabs list:
 *
 * Tab: Info,         SubTab: home, allCast, cast, allLocation
 * Tab: Shop,        SubTab: home, allProducts, productDetails
 * Tab: Location,   SubTab: home,
 * Tab: Travel,       SubTab: home,
 * Tab: Social,       SubTab: home,
 * Tab: Viewing,     SubTab: home,
 * * * * * * * * * * * * * * * * * * * * * * * *
 */
export const navigateTo = (from, from_subTab, to, to_subTab, params) => {
    return {
        type: 'navigate',
        payload: {
            from,
            from_subTab,
            to,
            to_subTab,
            params
        }
    }
}