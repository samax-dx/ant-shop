export const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);
export const SpList = {
    create: (items, resultCount) => {
        const newItems = [...items];
        newItems.resultCount = resultCount;
        return newItems;
    }
};