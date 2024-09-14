export const savedTableService = {
    fetch(http, filter, data) {
        return Promise.resolve(
            http.post('/get-saved-tables', { filter: { ...filter }, managerId: data.managerId })
        )
    },
};
