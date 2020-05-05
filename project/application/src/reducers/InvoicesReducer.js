import moment from 'moment';
import { ADD_INVOICE, GET_INVOICE, UPDATE_INVOICE } from '../actions/InvoicesActions';

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
            dateFrom: new Date(),
            dateDue: new Date(),
            sender: null,
            recipient: null,
            image: null,
            projects: [
                {
                    id: '1',
                    projectId: '1',
                    name: 'Zulu',
                    amount: 200,
                    rate: 100,
                    tax: 15,
                },
                {
                    id: '2',
                    projectId: '2',
                    name: 'Ultra',
                    amount: 300,
                    rate: 20,
                    tax: 10,
                },
            ],
            status: 'draft',
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
            dateFrom: new Date(),
            dateDue: new Date(),
            sender: null,
            recipient: null,
            image: null,
            projects: [
                {
                    id: '1',
                    projectId: '1',
                    name: 'Zulu',
                    amount: 200,
                    rate: 100,
                    tax: 15,
                },
                {
                    id: '2',
                    projectId: '2',
                    name: 'Ultra',
                    amount: 300,
                    rate: 20,
                    tax: 10,
                },
                {
                    id: '3',
                    projectId: '2',
                    name: 'Ultra',
                    amount: 300,
                    rate: 20,
                    tax: 10,
                },
            ],
            status: 'overdue',
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
            dateFrom: new Date(),
            dateDue: new Date(),
            sender: null,
            recipient: null,
            image: null,
            projects: [
                {
                    id: '1',
                    projectId: '1',
                    name: 'Zulu',
                    amount: 200,
                    rate: 100,
                    tax: 15,
                },
                {
                    id: '2',
                    projectId: '2',
                    name: 'Ultra',
                    amount: 300,
                    rate: 20,
                    tax: 10,
                },
            ],
            status: 'paid',
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
            dateFrom: new Date(),
            dateDue: new Date(),
            sender: null,
            recipient: null,
            image: null,
            projects: [
                {
                    id: '1',
                    projectId: '1',
                    name: 'Zulu',
                    amount: 200,
                    rate: 100,
                    tax: 15,
                },
            ],
            status: 'paid',
        },
    ],
    invoice: null,
};

export default function invoicesReducer(state = initialState, { type, payload }) {
    switch (type) {
        case GET_INVOICE:
            return {
                ...state,
                invoice: state.invoices.filter(i => i.id === payload)[0],
            };
        case UPDATE_INVOICE:
            const findIndex = state.invoices.findIndex(i => i.id === payload.id);
            state.invoices[findIndex] = payload;
            return {
                ...state,
            };

        case ADD_INVOICE:
            return {
                ...state,
                invoices: [...state.invoices, payload],
            };
        default:
            return state;
    }
}
