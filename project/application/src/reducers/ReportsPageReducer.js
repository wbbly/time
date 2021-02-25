import * as moment from 'moment';

import { getCurrentDate } from '../services/timeService';
import { getTimeDurationByGivenTimestamp } from '../services/timeService';

const initialState = {
    timeRange: {
        startDate: getCurrentDate(),
        endDate: getCurrentDate(),
        key: 'selection',
        firstDayOfWeek: 1,
    },
    inputUserData: [],
    dataBarChat: {
        defaultFontColor: 'red',
        labels: [],
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
                data: [],
            },
        ],
    },
    projectsArr: [],
    userProjectsArr: [],
    dataDoughnutChat: {
        labels: [],
        options: {
            title: {
                display: false,
            },
            legend: {
                display: false,
            },
            tooltips: {
                callbacks: {
                    label: function(tooltipItem) {
                        return getTimeDurationByGivenTimestamp(+moment(tooltipItem.yLabel));
                    },
                },
            },
        },
        datasets: [
            {
                data: [],
                backgroundColor: [
                    //
                    // https://materialuicolors.co/
                    //

                    // Level: [300]
                    '#E57373',
                    '#F06292',
                    '#BA68C8',
                    '#9575CD',
                    '#7986CB',
                    '#64B5F6',
                    '#4FC3F7',
                    '#4DD0E1',
                    '#4DB6AC',
                    '#81C784',
                    '#AED581',
                    '#DCE775',
                    '#FFF176',
                    '#FFD54F',
                    '#FFB74D',
                    '#FF8A65',
                    '#A1887F',
                    '#E0E0E0',
                    '#90A4AE',

                    // Level: [600]
                    '#E53935',
                    '#D81B60',
                    '#8E24AA',
                    '#5E35B1',
                    '#3949AB',
                    '#1E88E5',
                    '#039BE5',
                    '#00ACC1',
                    '#00897B',
                    '#43A047',
                    '#7CB342',
                    '#C0CA33',
                    '#FDD835',
                    '#FFB300',
                    '#FB8C00',
                    '#F4511E',
                    '#6D4C41',
                    '#757575',
                    '#546E7A',

                    // Level: [900]
                    '#B71C1C',
                    '#880E4F',
                    '#4A148C',
                    '#311B92',
                    '#1A237E',
                    '#0D47A1',
                    '#01579B',
                    '#006064',
                    '#004D40',
                    '#1B5E20',
                    '#33691E',
                    '#827717',
                    '#F57F17',
                    '#FF6F00',
                    '#E65100',
                    '#BF360C',
                    '#3E2723',
                    '#212121',
                    '#263238',
                ],
            },
        ],
    },
    dataFromServer: [],
    inputProjectData: [],
};

export function reportsPageReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_LINE_GRAPH':
            return { ...state, dataBarChat: action.payload };
        case 'SET_DATA_FROM_SERVER':
            return { ...state, dataFromServer: action.payload.data };
        case 'SET_DOUGHNUT_GRAPH':
            return { ...state, dataDoughnutChat: action.payload.data };
        case 'SET_PROJECTS':
            return { ...state, projectsArr: action.payload.data };
        case 'SET_USER_PROJECTS':
            return { ...state, userProjectsArr: action.payload.data };
        case 'SET_TIME':
            return { ...state, timeRange: action.payload.data };
        case 'SET_ACTIVE_USER':
            return { ...state, inputUserData: action.payload.data };
        case 'SET_SELECTED_PROJECTS':
            return { ...state, inputProjectData: action.payload.data };
        case 'RESET_ALL':
            return initialState;
        default:
            return state;
    }
}
