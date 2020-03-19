import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

import CustomSelect from '../CustomSelect';

import './style.scss';
import { apiCall } from "../../services/apiService";
import { AppConfig } from "../../config";
import moment from "moment";
import { addPlanUser } from '../../actions/PlaningActions';

import { connect } from "react-redux";

export class AddPlan extends React.Component {
    state = {};

    addPlanClick = (data) => {
      console.log(data)
      const { hours, startDate, endDate, person:{idPerson}, project:{idProject} } = data;
      addPlanUser({
        userId: idPerson,
        projectId: idProject,
        startDate: startDate,
        duration: hours,
        endDate: endDate,
      }).then(()=>{
        this.props.getTimerPlaningList()
      })
      // apiCall(AppConfig.apiURL + `timer-planning/add`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     userId:'a97028cf-30b8-4286-b961-673955af85c5',
      //     projectId:'2b4547fa-fff9-4d30-8810-ab27333d8769',
      //     startDate: startDate,
      //     duration: hours,
      //     endDate: endDate,
      //   }),
      // }).then(result => {
      //
      // });
    }

  render() {
        const { users = [], projects = [], add, cancel, vocabulary } = this.props;
        const { v_cancel_small, v_add, v_add_plan, v_v_required } = vocabulary;
        console.log(users)
    console.log(projects)
        return (
            <div className="planing-modal">
                <div className="planing-modal__header">
                    <p>{v_add_plan}</p>
                </div>
                <div className="planing-modal__body">
                    <Formik
                        enableReinitialize={true}
                        validateOnChange={false}
                        validateOnBlur={true}
                        initialValues={{
                            person: '',
                            project: '',
                            hours: 0,
                            startDate: '',
                            endDate: '',
                        }}
                        validationSchema={Yup.object({
                            person: Yup.string().required(v_v_required),
                            project: Yup.string().required(v_v_required),
                        })}
                        onSubmit={values => {
                            console.log(values);
                            this.addPlanClick(values)
                            console.log('test');
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
                                        onChange={(a, b, idPerson)=>formik.setFieldValue('person', {a, b, idPerson})}
                                        onBlur={formik.setFieldTouched}
                                        error={formik.errors.person}
                                        touched={formik.touched.person}
                                    />
                                </label>
                                <label htmlFor="project" className="planing-modal__label">
                                    Select Project
                                    <CustomSelect
                                        name="project"
                                        value={formik.values.project.b}
                                        options={projects}
                                        onChange={(a, b, idProject)=>formik.setFieldValue('project', {a, b, idProject})}
                                        onBlur={formik.setFieldTouched}
                                        error={formik.errors.project}
                                        touched={formik.touched.project}
                                    />
                                </label>
                                <label className="planing-modal__label">
                                    Add Time <small>(eg. 3w 4d 12h)</small>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <input style={{ width: '78px', height: '25px' }} onChange={formik.handleChange} name="hours" type="number" />
                                        <input style={{ width: '78px', height: '25px' }} onChange={formik.handleChange} name="startDate" type="date" />
                                        to
                                        <input style={{ width: '78px', height: '25px' }} onChange={formik.handleChange} name="endDate" type="date" />
                                    </div>
                                </label>
                                <div className="planing-modal__footer">
                                    <button type="submit" className="planing-modal__add-btn">
                                        {v_add}
                                    </button>
                                    <button className="planing-modal__cancel-btn" onClick={cancel}>
                                        {v_cancel_small}
                                    </button>
                                </div>
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

const mapDispatchToProps = {
  // addPlanUser
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddPlan);
