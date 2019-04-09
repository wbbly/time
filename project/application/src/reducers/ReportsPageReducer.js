import { getUserData } from '../services/authentication';
import * as moment from 'moment';

const initialState = {
    timeRange: {
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
    },
    setUser: getUserData(),
    dataBarChat: {
        defaultFontColor: 'red',
        labels: ['February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'Total hrs by date',
                fill: true,
                lineTension: 0.1,
                backgroundColor: '#56CCF2',
                borderColor: '#56CCF2',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: '#56CCF2',
                scaleFontColor: '#FFFFFF',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: '#56CCF2',
                pointHoverBorderColor: '#56CCF2',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: [65, 59, 80, 81, 56, 55, 40],
            },
        ],
    },
    projectsArr: [
        {
            project: 'Ultradom.com.ua',
            timePassed: '8:20:33',
        },
        {
            project: 'Ultradom.com.ua',
            timePassed: '8:20:33',
        },
        {
            project: 'Ultradom.com.ua',
            timePassed: '8:20:33',
        },
        {
            project: 'Ultradom.com.ua',
            timePassed: '8:20:33',
        },
    ],
    dataDoughnutChat: {
        labels: [],
        options: {
            title: {
                display: false,
                text: 'Custom Chart Title',
            },
            legend: {
                display: false,
            },
            tooltips: {
                callbacks: {
                    label: function (tooltipItem) {
                        return moment(tooltipItem.yLabel)
                            .utc()
                            .format('HH:mm:ss');
                    },
                },
            },
        },
        datasets: [
            {
                data: [300, 50, 100],
                backgroundColor: ['#7B68EE', '#191970', '#000080', '#191970', '#2F80ED', '#6FCF97', '#BB6BD9'],
                hoverBackgroundColor: ['#2F80ED', '#6FCF97', '#BB6BD9'],
            },
        ],
    },
    dataFromServer: [],
    selectedProjects: [],
};

export function reportsPageReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_LINE_GRAPH':
            return {...state, dataBarChat: action.payload};
        case 'SET_DATA_FROM_SERVER':
            return {...state, dataFromServer: action.payload.data};
        case 'SET_DOUGHNUT_GRAPH':
            return {...state, dataDoughnutChat: action.payload.data};
        case 'SET_PROJECTS':
            return {...state, projectsArr: action.payload.data};
        case 'SET_TIME':
            return {...state, timeRange: action.payload.data};
        case 'SET_ACTIVE_USER':
            return {...state, setUser: action.payload.data};
        case 'SET_SELECTED_PROJECTS':
            return {...state, selectedProjects: action.payload.data};
        default:
            return state;
    }
}
