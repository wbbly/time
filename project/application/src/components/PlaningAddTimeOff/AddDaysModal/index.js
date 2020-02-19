import React from 'react';
import { CloseSvg } from '../index';
import { Formik } from 'formik';
import * as Yup from 'yup';
import './style.scss';

import CustomSelect from '../../CustomSelect';

const AddDaysModal = ({ close, vocabulary, timeOff, initialName, initialColor, itemId }) => {
    const { v_cancel_small, v_add, v_v_required } = vocabulary;
    return (
        <div className="add-days-modal">
            <div className="add-days-modal__header">
                <p>Add days</p>
                <CloseSvg cancel={close} />
            </div>
            <Formik
                enableReinitialize={true}
                validateOnChange={false}
                validateOnBlur={true}
                initialValues={{
                    dayName: initialName ? initialName.charAt(0).toUpperCase() + initialName.slice(1) : '',
                    color: initialColor ? initialColor : '',
                }}
                validationSchema={Yup.object({
                    dayName: Yup.string().required(v_v_required),
                    color: Yup.string().required(v_v_required),
                })}
                onSubmit={values => {
                    console.log(values);
                    console.log('test');
                    close();
                }}
            >
                {formik => (
                    <form onSubmit={formik.handleSubmit} className="add-days-modal__formik">
                        <input
                            style={{ border: formik.errors.dayName ? '1px solid red' : null }}
                            name="dayName"
                            type="text"
                            className="add-days-modal__input"
                            value={formik.values.dayName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.errors.dayName}
                            placeholder={'Enter day name'}
                            autoFocus
                        />
                        <CustomSelect
                            className="add-days-modal__select"
                            name="color"
                            value={formik.values.color}
                            options={timeOff}
                            onChange={formik.setFieldValue}
                            onBlur={formik.setFieldTouched}
                            error={formik.errors.color}
                            placeholder={'Pick a color'}
                            touched={formik.touched.color}
                            addDays
                        />

                        <div className="add-days-modal__footer">
                            <button type="submit" className="add-days-modal__add-btn">
                                {v_add}
                            </button>
                            <button className="add-days-modal__cancel-btn" onClick={close}>
                                {v_cancel_small}
                            </button>
                        </div>
                    </form>
                )}
            </Formik>
        </div>
    );
};

export default AddDaysModal;
