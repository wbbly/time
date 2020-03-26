import moment from 'moment';

const initialState = {
    invoices: [
        {
            id: '1',
            name: 'Thomas Schaefer-Tertilt',
            number: '001',
            price: 30000,
            createdAt: new Date(),
            deadlineDate: moment()
                .add(2, 'months')
                .toDate(),
            confirmed: true,
            currency: 'usd',
        },
        {
            id: '2',
            name: 'Thomas Schaefer-Tertilt',
            number: '002',
            price: 85000,
            createdAt: new Date(),
            deadlineDate: moment()
                .add(1, 'months')
                .toDate(),
            confirmed: true,
            currency: 'usd',
        },
        {
            id: '3',
            name: 'Thomas Schaefer-Tertilt',
            number: '003',
            price: 30000,
            createdAt: new Date(),
            deadlineDate: moment()
                .add(3, 'months')
                .toDate(),
            confirmed: false,
            currency: 'usd',
        },
        {
            id: '4',
            name: 'Thomas Schaefer-Tertilt',
            number: '001',
            price: 84500,
            createdAt: new Date(),
            deadlineDate: moment()
                .add(2, 'months')
                .toDate(),
            confirmed: true,
            currency: 'usd',
        },
    ],
};

export default function invoicesReducer(state = initialState, { type, payload }) {
    switch (type) {
        default:
            return state;
    }
}
