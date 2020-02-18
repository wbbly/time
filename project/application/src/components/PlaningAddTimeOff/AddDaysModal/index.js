import React from 'react';
import { CloseSvg } from '../index';
import { Formik } from 'formik';
import * as Yup from 'yup';
import './style.scss';

import CustomSelect from '../../CustomSelect';

const AddDaysModal = ({ close, vocabulary, timeOff }) => {
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
                    colorName: '',
                    color: '',
                }}
                validationSchema={Yup.object({
                    colorName: Yup.string().required(v_v_required),
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
                        <input name="colorName" className="add-days-modal__input" />
                        <CustomSelect
                            className="add-days-modal__select"
                            name="color"
                            value={formik.values.color}
                            options={timeOff}
                            onChange={formik.setFieldValue}
                            onBlur={formik.setFieldTouched}
                            z
                            error={formik.errors.project}
                            touched={formik.touched.project}
                            placeholder={'Pick a color'}
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
