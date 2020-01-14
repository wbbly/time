import React from 'react';

import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import CustomSelect from '../../components/CustomSelect';

export class AddPlan extends React.Component {
    state = {};

    render() {
        const { users = [], projects = [], add, cancel, v_cancel_small, v_add, v_add_plan, v_v_required } = this.props;
        console.log(projects);
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
                        }}
                        validationSchema={Yup.object().shape({
                            person: Yup.string().required(`${v_v_required}`),
                            project: Yup.string().required(`${v_v_required}`),
                        })}
                        onSubmit={values => {
                            console.log(values);
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
                                <label htmlFor="person">
                                    Select Person
                                    <CustomSelect
                                        name="person"
                                        value={formik.values.person}
                                        options={users}
                                        onChange={formik.setFieldValue}
                                        onBlur={formik.setFieldTouched}
                                        error={formik.errors.person}
                                        touched={formik.touched.person}
                                    />
                                </label>
                                <label htmlFor="project">
                                    Select Project
                                    <CustomSelect
                                        name="project"
                                        value={formik.values.project}
                                        options={projects}
                                        onChange={formik.setFieldValue}
                                        onBlur={formik.setFieldTouched}
                                        error={formik.errors.project}
                                        touched={formik.touched.project}
                                    />
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
                {/* <div className="planing-modal__footer">
                    <button className="planing-modal__add-btn"  onClick={e => add('hello')}>
                        {v_add}
                    </button>
                    <button className="planing-modal__cancel-btn" onClick={cancel}>
                        {v_cancel_small}
                    </button>
                </div> */}
            </div>
        );
    }
}
