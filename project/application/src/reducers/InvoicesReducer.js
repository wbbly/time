import moment from 'moment';
import {TOGGLE_SEND_INVOICE_MODAL} from "../actions/InvoicesActions";

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
    sendInvoiceModalToggle: false,
    openedInvoice: null
};

export default function invoicesReducer(state = initialState, { type, payload }) {
    switch (type) {
        case TOGGLE_SEND_INVOICE_MODAL:
            return {
                ...state,
                sendInvoiceModalToggle: !state.sendInvoiceModalToggle,
                openedInvoice: !state.sendInvoiceModalToggle? payload : null
            };
        default:
            return state;
    }
}
