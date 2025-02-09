import React, { useState } from "react";
import { useTable } from "react-table";

export default function DataTable({ columns, data }) {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredData = React.useMemo(() => {
        if (!searchTerm) return data;
        return data.filter((row) =>
            Object.values(row)
                .join(" ")
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
        );
    }, [data, searchTerm]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data: filteredData });

    return (
        <div className="p-0">
            <div className="flex lg:flex-row flex-col lg:justify-between items-center mb-4">
                <h2 className="">Jumlah data : {rows.length}</h2>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Pencarian..."
                    className="p-2 border border-gray-200 bg-gray-100 rounded-lg focus:outline-none focus:ring-none"
                />
            </div>
            <table
                {...getTableProps()}
                className="min-w-full table-auto w-full border-collapse border border-gray-800"
            >
                <thead className="bg-gray-200 text-gray-700">
                    {headerGroups.map((headerGroup, index) => {
                        const { key, ...restHeaderGroupProps } =
                            headerGroup.getHeaderGroupProps();
                        return (
                            <tr key={key || index} {...restHeaderGroupProps}>
                                {headerGroup.headers.map((column, colIndex) => {
                                    const { key: columnKey, ...restColumnProps } =
                                        column.getHeaderProps();
                                    return (
                                        <th
                                            key={columnKey || colIndex}
                                            {...restColumnProps}
                                            className="border border-gray-300 px-4 py-2 text-left"
                                        >
                                            {column.render("Header")}
                                        </th>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </thead>
                <tbody {...getTableBodyProps()} className="bg-white">
                    {rows.map((row, rowIndex) => {
                        prepareRow(row);
                        const { key, ...restRowProps } = row.getRowProps();
                        return (
                            <tr
                                key={key || rowIndex}
                                {...restRowProps}
                                className="hover:bg-gray-100"
                            >
                                {row.cells.map((cell, cellIndex) => {
                                    const { key: cellKey, ...restCellProps } = cell.getCellProps();
                                    return (
                                        <td
                                            key={cellKey || cellIndex}
                                            {...restCellProps}
                                            className="border border-gray-300 px-4 py-2"
                                        >
                                            {cell.render("Cell")}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
