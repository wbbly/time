import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import CustomSelect from '../CustomSelect';

import './style.scss';

import moment from 'moment';
import { addPlanUser } from '../../actions/PlaningActions';

import { connect } from 'react-redux';
import DateFnsUtils from "@date-io/date-fns";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

import enLocale from "date-fns/locale/en-GB";
import ruLocale from "date-fns/locale/ru";
import deLocale from "date-fns/locale/de";
import itLocale from "date-fns/locale/it";
import uaLocale from "date-fns/locale/uk";
import { createMuiTheme, Input } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import { CloseSvg } from "../PlaningAddTimeOff";

const localeMap = {
    en: enLocale,
    ru: ruLocale,
    de: deLocale,
    it: itLocale,
    uk: uaLocale,
};

const muiTheme = createMuiTheme({
    overrides: {
        MuiInput: {
            root: {
                border: '1px solid #DEDEDE',
                boxSizing: 'border-box',
                borderRadius: 2,
                paddingLeft: 8,
                maxWidth: 78,
                minWidth: 78,
                fontSize: 12,
                fontWeight: 600,
                '&:before':{
                    borderBottom: 'none!important'
                },
                '&:focus':{
                    borderColor: 'none!important'
                }
            },
            underline: {
                '&:after':{
                    borderBottom: 'none!important'
                },
            }
        },
    },
});

const MuiDataPicker = ({ value, onChange, firstDayOfWeek, lang, minDate, maxDate }) => {

    const customLocale = localeMap[lang.short];
    customLocale.options.weekStartsOn = firstDayOfWeek;

    return(
      <ThemeProvider theme={muiTheme}>
        <DatePicker
          autoOk
          name="startDate"
          format="MM.dd.yyyy"
          disableToolbar={true}
          allowKeyboardControl={false}
          variant="inline"
          value={value}
          onChange={onChange}
          minDate={minDate}
          maxDate={maxDate}
        />
      </ThemeProvider>)
}



export class AddPlan extends React.Component {
    state = {};

    componentDidMount() {
        this.props.getTimeOff();
    }

    patchPlanClick = (values) => {
        const {
            hours,
            startDate,
            endDate,
            person: { idPerson },
            project: { idProject },
        } = values;
        this.props.patchPlan(this.props.currentPlanOrTimeOff.id, {
            userId: idPerson,
            [this.props.timeOffShow ? 'timerOffId' : 'projectId']: idProject,
            startDate: moment(startDate).format('YYYY-MM-DD'),
            duration: hours,
            endDate: moment(endDate).format('YYYY-MM-DD'),
        } )
    }


    addPlanClick = data => {
        console.log(data);
        const {
            hours,
            startDate,
            endDate,
            person: { idPerson },
            project: { idProject },
        } = data;
        addPlanUser({
            userId: idPerson,
            [this.props.timeOffShow ? 'timerOffId' : 'projectId']: idProject,
            startDate: moment(startDate).format('YYYY-MM-DD'),
            duration: hours,
            endDate: moment(endDate).format('YYYY-MM-DD'),
        }).then(() => {
            this.props.getTimerPlaningList();
        });
    };

    render() {
        const { users = [], projects = [], cancel, vocabulary, timeOff = [], timeOffShow, firstDayOfWeek, dataClickAddPlan, deletePlan, currentPlanOrTimeOff } = this.props;

        const { v_cancel_small, v_add, v_add_plan, v_v_required, lang } = vocabulary;

        const customLocale = localeMap[lang.short];
        customLocale.options.weekStartsOn = firstDayOfWeek;


        return (
            <div className="planing-modal">
                <div className="planing-modal__header">
                    <p>{v_add_plan}</p>
                    <CloseSvg cancel={cancel} />
                </div>
                <div className="planing-modal__body">
                    <Formik
                        enableReinitialize={true}
                        validateOnChange={false}
                        validateOnBlur={true}
                        initialValues={{
                            person: {a:'',b: currentPlanOrTimeOff.username, idPerson: currentPlanOrTimeOff.userId},
                            project:{a:'',b: currentPlanOrTimeOff.projectName, idProject: currentPlanOrTimeOff.projectId},
                            hours: currentPlanOrTimeOff.duration || '' ,
                            startDate: currentPlanOrTimeOff.startDate || dataClickAddPlan || new Date() ,
                            endDate: currentPlanOrTimeOff.endDate || dataClickAddPlan || new Date(),
                        }}
                        validationSchema={Yup.object({
                            person: Yup.string().required(v_v_required),
                            project: Yup.string().required(v_v_required),
                        })}
                        onSubmit={values => {
                            !Object.keys(currentPlanOrTimeOff).length ?this.addPlanClick(values):this.patchPlanClick(values);
                            cancel();
                        }}
                    >
                        {formik => (
                            <form
                                onSubmit={formik.handleSubmit}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    height: '100%',
                                }}
                            >
                                <label htmlFor="person" className="planing-modal__label">
                                    Select Person
                                    <CustomSelect
                                        name="person"
                                        value={formik.values.person.b}
                                        options={users}
                                        onChange={(a, b, idPerson) =>
                                            formik.setFieldValue('person', { a, b, idPerson })
                                        }
                                        onBlur={formik.setFieldTouched}
                                        error={formik.errors.person}
                                        touched={formik.touched.person}
                                    />
                                </label>
                                <label htmlFor="project" className="planing-modal__label">
                                    Add Project / TimeOff
                                    <CustomSelect
                                        name="project"
                                        value={formik.values.project.b}
                                        options={timeOffShow ? timeOff : projects}
                                        onChange={(a, b, idProject) =>
                                            formik.setFieldValue('project', { a, b, idProject })
                                        }
                                        onBlur={formik.setFieldTouched}
                                        error={formik.errors.project}
                                        touched={formik.touched.project}
                                    />
                                </label>
                                <label className="planing-modal__label">
                                    Add Time
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginTop: 8
                                        }}
                                    >
                                        <ThemeProvider theme={muiTheme}>
                                            <Input
                                                placeholder="Hours"
                                                name="hours"
                                                onChange={formik.handleChange}
                                                type='number'
                                                value={formik.values.hours}
                                                inputProps={{ min: "0", max: "1000", step: "1" }}
                                            />
                                        </ThemeProvider>
                                        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={customLocale}>
                                            <MuiDataPicker
                                              firstDayOfWeek={firstDayOfWeek}
                                              lang={lang}
                                              value={formik.values.startDate}
                                              maxDate={formik.values.endDate}
                                              onChange={value => formik.setFieldValue("startDate", value)}
                                            />
                                        </MuiPickersUtilsProvider>
                                        to
                                        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={customLocale}>
                                            <MuiDataPicker
                                              firstDayOfWeek={firstDayOfWeek}
                                              lang={lang}
                                              value={formik.values.endDate}
                                              minDate={formik.values.startDate}
                                              onChange={value => formik.setFieldValue("endDate", value)}
                                            />
                                        </MuiPickersUtilsProvider>
                                    </div>
                                </label>
                                {!Object.keys(currentPlanOrTimeOff).length ?<div className="planing-modal__footer">
                                    <button type="submit" className="planing-modal__add-btn">
                                        {v_add}
                                    </button>
                                    <button className="planing-modal__cancel-btn" onClick={cancel}>
                                        {v_cancel_small}
                                    </button>
                                </div>:
                                <div className="planing-modal__footer">
                                    <button type="submit" className="planing-modal__add-btn">
                                         Save
                                    </button>
                                    <button className="planing-modal__cancel-btn" onClick={() => deletePlan(currentPlanOrTimeOff.id)}>
                                        Delete
                                    </button>
                                </div>}
                            </form>
                        )}
                    </Formik>
                </div>
            </div>
        );
    }
}
const mapStateToProps = state => ({
    user: state.userReducer.user,
});

const mapDispatchToProps = {};

export default  connect(
    mapStateToProps,
    mapDispatchToProps
)(AddPlan);
