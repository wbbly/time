import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import classNames from 'classnames';

import { LoggedBlock } from '../../PlaningUserBlock';

import '../../PlaningUserBlock/style.scss';

const Logged = ({ user, month, weekCount, planingReducer, vocabulary }) => {
    const { isWeek } = planingReducer;
    const { v_hour_small } = vocabulary;

    return (
        <div className="logged">
            <p className="logged__title">Logged</p>
            <div className="user-block__main-block">
                {month.map(
                    (week, index) =>
                        ((index === weekCount && isWeek) || !isWeek) && (
                            <div key={index}>
                                <div
                                    id={`week_${week.week[0].fullDate}`}
                                    className="week"
                                    style={{ height: 60 * user.logged.length }}
                                >
                                    {week.week.map((day, index) => {
                                        return (
                                            !day.opacity && (
                                                <div
                                                    key={index}
                                                    id={`middle_logged_${day.fullDate}`}
                                                    className={classNames('day', {
                                                        'day-isWeek': isWeek,
                                                    })}
                                                    style={{
                                                        background: day.background,
                                                        opacity: day.opacity,
                                                    }}
                                                    tabIndex={1}
                                                >
                                                    {user.logged.map((log, logIndex) =>
                                                        log.timeGroups.map(
                                                            (entry, entryIndex) =>
                                                                moment(entry.formattedDate).format('L') ===
                                                                moment(day.fullDate).format('L') ? (
                                                                    <LoggedBlock
                                                                        key={index}
                                                                        logIndex={logIndex}
                                                                        log={log}
                                                                        entry={entry}
                                                                        v_hour_small={v_hour_small}
                                                                        isWeek={isWeek}
                                                                    />
                                                                ) : null
                                                        )
                                                    )}
                                                </div>
                                            )
                                        );
                                    })}
                                </div>
                            </div>
                        )
                )}
            </div>
        </div>
    );
};

const mapDispatchToProps = {};

const mapStateToProps = state => ({
    planingReducer: state.planingReducer,
    vocabulary: state.languageReducer.vocabulary,
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Logged);
