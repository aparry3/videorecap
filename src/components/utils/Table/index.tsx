import { FC, HTMLProps, ReactNode } from "react"
import styles from './Table.module.scss'
import Container from "../Container/Container"
import { on } from "events"

interface TableProps extends HTMLProps<HTMLTableElement> {
    header?: ReactNode
}


const Table: FC<TableProps> = ({className, header, children}) => {
    
    return (
        <table className={`${className || ''} ${styles.table}`}>
            {header && (<thead>{header}</thead>)}
            <tbody className={styles.tableBody}>{children}</tbody>
        </table>
    )
}


interface TableRowProps extends HTMLProps<HTMLTableRowElement> {}


export const TableRow: FC<TableRowProps> = ({className, children, onClick}) => {
    
    return (
        <tr className={`${className || ''} ${styles.tableRow}`} onClick={onClick}>
            {children}
        </tr>
    )
}

interface TableCellProps extends HTMLProps<HTMLTableCellElement> {
    justify?: 'flex-start' | 'center' | 'flex-end'
}


export const TableCell: FC<TableCellProps> = ({className, children, justify = 'center'}) => {
    
    return (
        <td className={`${className || ''} ${styles.tableCell}`}>
            <Container justify={justify} padding={0.5}>{children}</Container>
        </td>
    )
}



export default Table