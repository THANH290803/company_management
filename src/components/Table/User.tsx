"use client";  // Required for client-side React hooks in Next.js 13+

import * as React from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { useUsers } from "@/lib/useUser";
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";



export function User() {
    const {
        searchTerm,
        setSearchTerm,
        getRoleName,
        getCompanyName,
        currentPage,
        rowsPerPage,
        handleRowsPerPageChange,
        currentUsers,
        paginate,
        filteredUsers,
        handleDelete
    } = useUsers();

    const router = useRouter();

    const handleClick = () => {
        // Navigate to the department page when button is clicked
        router.push("/user/add-user"); // Replace with the correct path
    };

    return (
        <>

            <div className="flex items-center justify-between">
                <h1 style={{ fontWeight: 'bold', fontSize: '24px' }}>Danh sách người dùng</h1>
                <Button variant="outline" className="bg-blue-500 text-white hover:bg-blue-600 py-2 px-4 rounded-md" onClick={handleClick}>
                    Thêm người dùng
                </Button>
            </div>

            <div className="mb-4">
                <Input
                    type="text"
                    placeholder="Tìm kiếm theo tên người dùng..."
                    className="px-4 py-2 border border-gray-300 rounded-lg w-full max-w-md"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ marginBottom: "10px", padding: "5px", fontSize: "16px" }}
                />
            </div>


            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead style={{ width: '200px' }}>No.</TableHead>
                        <TableHead className="text-center">Tên người dùng</TableHead>
                        <TableHead className="text-center">Trức vụ trong công ty</TableHead>
                        <TableHead className="text-right">Trực thuộc công ty</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currentUsers.length > 0 ? (
                        currentUsers.map((user, index) => (
                            <TableRow key={user._id}>
                                <TableCell>{index + 1 + (currentPage - 1) * rowsPerPage}</TableCell>
                                <TableCell className="text-center">{user.name}</TableCell>
                                <TableCell className="text-center">{getRoleName(user.role_id)}</TableCell>
                                <TableCell className="text-right">{getCompanyName(user.company_id)}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="p-2 hover:bg-gray-100 rounded">
                                                <MoreHorizontal className="h-5 w-5" />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => router.push(`/user/details?id=${user._id}`)}>
                                                Chi tiết người dùng
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => router.push(`/department/edit-department?id=${user._id}`)}>
                                                Sửa
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-500" onClick={() => handleDelete(user._id)}>
                                                Xoá
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                                Không có phòng ban
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <div className="mt-6 flex flex-col md:flex-row md:justify-end items-center gap-4">
                {/* Rows per page */}
                <div className="flex items-center gap-2 text-sm">
                    <span>Rows per page:</span>
                    <select
                        value={rowsPerPage}
                        onChange={handleRowsPerPageChange}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                    >
                        {[10, 25, 50, 100].map((val) => (
                            <option key={val} value={val}>
                                {val}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-2 rounded-md border text-sm hover:bg-gray-100 disabled:opacity-50"
                    >
                        ← Trước
                    </button>

                    <span className="text-sm">
                        Trang <strong>{currentPage}</strong> /{" "}
                        {Math.ceil(filteredUsers.length / rowsPerPage)}
                    </span>

                    <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage * rowsPerPage >= filteredUsers.length}
                        className="px-3 py-2 rounded-md border text-sm hover:bg-gray-100 disabled:opacity-50"
                    >
                        Sau →
                    </button>
                </div>
            </div>
        </>
    );
}
