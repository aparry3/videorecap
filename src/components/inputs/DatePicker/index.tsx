import Column from '@/components/utils/Container/Column';
import Container from '@/components/utils/Container/Container';
import Modal from '@/components/utils/Modal';
import React, { FC, useEffect, useState } from 'react';
import Text from '@/components/utils/Text'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import styles from './DatePicker.module.scss'
import { TableCell } from '@/components/utils/Table';
import Input from '../Input';


interface DatePickerProps {
    value?: Date
    onChange: (date: Date) => void
}


const DAYS_OF_THE_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const DatePicker: FC<DatePickerProps> = ({value, onChange}) => {
    const [selectedDay, setSelectedDay] = useState<Date>(value ?? new Date());
    const [chooserOpen, setChooserOpen] = useState<boolean>(false)
    const [month, setMonth] = useState<number>(selectedDay.getMonth());
    const [year, setYear] = useState<number>(selectedDay.getFullYear());
    
    const [weeks, setWeeks] = useState<Date[][]>([]);
    const [years, setYears] = useState<number[]>([])
    const [chooseYear, setChooseYear] = useState<boolean>(false);

    const getStartOfWeek = (date: Date) => {
        const day = date.getDay();
        const diff = date.getDate() - day;
        return new Date(date.setDate(diff));
    };

    const getEndOfWeek = (date: Date) => {
        const day = date.getDay();
        const diff = date.getDate() + (6 - day);
        return new Date(date.setDate(diff));
    };

    const getWeeksInMonth = (year: number, month: number) => {
        const startOfMonth = new Date(year, month - 1, 1);
        const endOfMonth = new Date(year, month, 0);
        const startOfWeek = getStartOfWeek(new Date(startOfMonth));
        const endOfWeek = getEndOfWeek(new Date(endOfMonth));

        const days = [];
        for (let day = new Date(startOfWeek); day <= endOfWeek; day.setDate(day.getDate() + 1)) {
            days.push(new Date(day));
        }

        const weeks = [];
        for (let i = 0; i < days.length / 7; i++) {
            weeks.push(days.slice(i * 7, (i + 1) * 7));
        }

        return weeks;
    };

    useEffect(() => {
        const _years = Array.from({length: 9}, (_, i) => selectedDay.getFullYear() - 4 + i)
        setYears(_years)
    }, [])

    useEffect(() => {
        setWeeks(getWeeksInMonth(year, month + 1));
    }, [month])
    
    useEffect(() => {
        console.log(weeks)
    }, [weeks])

    useEffect(() => {
        setSelectedDay(value ?? new Date())
    }, [value])

    const incrementYears = () => {
        const _years = Array.from({length: 9}, (_, i) => years[0] + 9 + i)
        setYears(_years)
    }

    const decrementYears = () => {
        const _years = Array.from({length: 9}, (_, i) => years[0] - 9 + i)
        setYears(_years)
    }

    const selectDay = (day: Date) => {
        onChange(new Date(year, month, day.getDate()))
    }

    return (
        <>
        <Container style={{width: '100%', cursor: 'pointer'}} onClick={() => setChooserOpen(true)}><Input inputStyle={{cursor: 'pointer'}} placeholder="Date" value={selectedDay.toDateString()} readOnly/></Container>
        <Modal open={chooserOpen} onClose={() => setChooserOpen(false)} large={false}>
            <Column>
                <Container style={{width: '100%'}} padding={0.2}>
                    <Container style={{cursor: 'pointer'}} onClick={chooseYear ? decrementYears :() => setMonth((month - 1) % 12)}>
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </Container>
                    <Container style={{flexGrow: 1}}>
                        {chooseYear
                        ? (<Container ><Text size={1.1} weight={600}>Choose Year</Text></Container>)
                        : (<Container style={{cursor: 'pointer'}} onClick={() => setChooseYear(true)}><Text size={0.9} weight={600}>{MONTHS[month]} {year}</Text></Container>)
                        }
                    </Container>
                    <Container style={{cursor: 'pointer'}} onClick={chooseYear ? incrementYears : () => setMonth((month + 1) % 12)}>
                        <FontAwesomeIcon icon={faChevronRight} />
                    </Container>
                </Container>
                <table>
                    {!chooseYear && (
                    <thead>
                        <tr>
                        {DAYS_OF_THE_WEEK.map(day => (
                        <td >
                            <Container padding={0.5}><Text weight={600}>{day}</Text></Container>
                        </td>
                        ))}
                        </tr>
                    </thead>
                    )}
                    <tbody>
                        {chooseYear ? (
                            years.map((_, index) => index % 3 === 0 ? (
                                <tr>
                                    {years.slice(index, index + 3).map(y => (
                                    <TableCell className={styles.day}>
                                        <Container onClick={() => {setYear(y); setChooseYear(false)}} padding={0.5} className={`${styles.day} ${y === year && styles.selected}`}><Text>{y}</Text></Container>
                                    </TableCell>
                                    ))}
                                </tr>
                            ) : <></>)
                        ): (
                            weeks.map(week => (
                            <tr>
                                {week.map(day => (
                                    <td className={styles.day}>
                                        <Container onClick={() => selectDay(day)} padding={0.5} className={`${styles.day} ${day.toDateString() == selectedDay.toDateString() && styles.selected} ${day.getMonth() !== month && styles.wrongMonth}`}><Text>{day.getDate()}</Text></Container>
                                    </td>
                                ))}
                            </tr>
                        )))}
                    </tbody>
                </table>
            </Column>
        </Modal>
        </>
    );
};

export default DatePicker;