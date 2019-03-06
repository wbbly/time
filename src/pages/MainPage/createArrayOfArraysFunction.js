export function createArayOfArrays(arr = []) {
    const formattedLogsDates = []; // ['YYYY-MM-DD', 'YYYY-MM-DD']
    const formattedLogsDatesValues = []; // [[{}, {}, {}, {}, {}], []]

    for (let i = 0; i < arr.length; i++) {
        const date = arr[i].date;
        let index = formattedLogsDates.indexOf(date);
        if (index === -1) {
            formattedLogsDates.push(date);
            index = formattedLogsDates.length - 1;
        }

        if (typeof formattedLogsDatesValues[index] === 'undefined') {
            formattedLogsDatesValues[index] = [];
        }

        formattedLogsDatesValues[index].push(arr[i]);
    }
    return formattedLogsDatesValues;
}
