"use client";  // Required for client-side React hooks in Next.js 13+

import { useEffect, useState } from "react";
import axios from "axios";
import * as React from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableHeader,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Company {
    _id: string;
    name: string;
    email: string;
    phone: string;
    is_headquarter: boolean;
}

// Custom function to fetch companies data
const fetchCompanies = async (
    setCompanies: React.Dispatch<React.SetStateAction<Company[]>>,
    setError: React.Dispatch<React.SetStateAction<string>>
) => {
    try {
        const token = localStorage.getItem("token");

        if (token) {
            const response = await axios.get<{ data: Company[] }>("https://qthl-group.onrender.com/api/company", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCompanies(response.data as unknown as Company[]);
        } else {
            setError("Token not found in localStorage");
        }
    } catch (err: unknown) {
        if (err instanceof Error) {
            setError("Error fetching data: " + err.message);
        } else {
            setError("An unknown error occurred");
        }
    }
};

export function Company() {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [error, setError] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        fetchCompanies(setCompanies, setError);  // Call the custom function
    }, []);

    // Filter companies based on the search term
    const filteredCompanies = companies.filter((company) =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Paginate the filtered companies
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedCompanies = filteredCompanies.slice(startIndex, endIndex);

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Handle rows per page change
    const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(Number(e.target.value));
        setCurrentPage(1); // Reset to the first page when rows per page changes
    };

    // Form state for adding a new company
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [isHeadquarter, setIsHeadquarter] = useState(false);

    // Dialog visibility state
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const openAddDialog = () => {
        setName("");
        setEmail("");
        setPhone("");
        setIsHeadquarter(false);
        setIsDialogOpen(true);
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        if (token) {
            try {
                const response = await axios.post(
                    "https://qthl-group.onrender.com/api/company",
                    {
                        name,
                        email,
                        phone,
                        is_headquarter: isHeadquarter,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                // On success, refresh the company list
                if (response.status === 201) {
                    fetchCompanies(setCompanies, setError);
                    setIsDialogOpen(false);
                    // Clear the form
                    setName("");
                    setEmail("");
                    setPhone("");
                    setIsHeadquarter(false);
                }
            } catch (error) {
                setError("Failed to add company: " + (error instanceof Error ? error.message : "Unknown error"));
            }
        } else {
            setError("Token not found in localStorage");
        }
    };

    // Kiểm tra xem có trường nào bị bỏ trống hay không
    const isButtonDisabled = !name || !email || !phone;

    const [selectedRow, setSelectedRow] = useState<number | null>(null) // State để theo dõi dòng được chọn
    // const [position, setPosition] = useState("bottom") // State cho giá trị của radio button

    const handleRowClick = (index: number) => {
        console.log("Clicked row: ", index) // Kiểm tra index
        setSelectedRow(selectedRow === index ? null : index) // Toggle dropdown visibility
    }

    // Edit 
    const [isDialogOpenEdit, setIsDialogOpenEdit] = useState(false);
    const [editCompany, setEditCompany] = useState<Company | null>(null);

    const handleEdit = async (company: Company) => {
        try {
            const token = localStorage.getItem("token"); // hoặc lấy token từ redux, context...
            const res = await axios.get(`https://qthl-group.onrender.com/api/company/${company._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = res.data;

            setEditCompany(data);
            setName(data.name);
            setEmail(data.email);
            setPhone(data.phone);
            setIsHeadquarter(data.is_headquarter);

            setIsDialogOpenEdit(true);
        } catch (error) {
            console.error("Lỗi load chi tiết company:", error);
        }
    };

    const handleUpdate = async () => {
        if (!editCompany) return;
        const token = localStorage.getItem("token");

        try {
            await axios.put(`https://qthl-group.onrender.com/api/company/${editCompany._id}`,
                {
                    name,
                    email,
                    phone,
                    is_headquarter: isHeadquarter
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

            setIsDialogOpenEdit(false);
            fetchCompanies(setCompanies, setError);
        } catch (error) {
            console.error("Lỗi update company:", error);
        }
    };

    // Delete
    const handleDelete = async (id: string) => {
        const token = localStorage.getItem("token");
        if (!token) {
            setError("Token not found in localStorage");
            return;
        }

        try {
            await axios.delete(`https://qthl-group.onrender.com/api/company/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchCompanies(setCompanies, setError); // Refresh list sau khi xoá
        } catch (error) {
            console.error("Lỗi khi xoá company:", error);
            setError("Failed to delete company: " + (error instanceof Error ? error.message : "Unknown error"));
        }
    };



    return (
        <>
            {/* Display error message if any */}
            {error && <div className="text-red-500 p-4">{error}</div>}

            <div className="flex items-center justify-between">
                <h1 style={{ fontWeight: 'bold', fontSize: '24px' }}>Danh sách công ty</h1>
                {/* <Button className="bg-blue-500 text-white hover:bg-blue-600 py-2 px-4 rounded-md">Thêm công ty</Button> */}
                <Dialog
                    open={isDialogOpen}
                    onOpenChange={(open) => {
                        setIsDialogOpen(open);
                        if (open) {
                            if (!editCompany) {
                                // Chỉ reset giá trị khi không phải sửa công ty (mở form thêm công ty mới)
                                setName("");
                                setEmail("");
                                setPhone("");
                                setIsHeadquarter(false);
                            }
                        } else {
                            // Đảm bảo reset form khi đóng dialog
                            setName("");
                            setEmail("");
                            setPhone("");
                            setIsHeadquarter(false);
                            setEditCompany(null);  // Đặt lại editCompany khi đóng form
                        }
                    }}
                >
                    <DialogTrigger asChild>
                        <Button variant="outline" className="bg-blue-500 text-white hover:bg-blue-600 py-2 px-4 rounded-md" onClick={openAddDialog}>
                            Thêm công ty
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] md:max-w-[500px] lg:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Add profile</DialogTitle>
                            <DialogDescription>
                                {"Make changes to your profile here. Click save when you're done."}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} method="post">
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">
                                        Tên công ty
                                    </Label>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}  // Add onChange handler
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="username" className="text-right">
                                        Email
                                    </Label>
                                    <Input
                                        id="username"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}  // Add onChange handler
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="phone" className="text-right">
                                        Số điện thoại
                                    </Label>
                                    <Input
                                        id="phone"
                                        value={phone}
                                        inputMode="numeric"
                                        onChange={(e) => {
                                            let value = e.target.value;

                                            // Chỉ cho phép số và tối đa 10 số
                                            if (/^\d{0,10}$/.test(value)) {
                                                // Nếu có ít nhất 1 ký tự
                                                if (value.length > 0) {
                                                    // Bắt buộc số đầu tiên phải là '0'
                                                    if (value[0] !== '0') {
                                                        value = '0' + value; // tự động thêm '0' vào đầu nếu thiếu
                                                    }
                                                }
                                                setPhone(value);
                                            }
                                        }}
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Input
                                        className="col-span-3"
                                        type="hidden"
                                        id="is_headquarter"
                                        name="is_headquarter"
                                        value="false"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={isButtonDisabled}>Save changes</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Search input */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên công ty"
                    className="px-4 py-2 border border-gray-300 rounded-lg w-full max-w-md"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <Table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <TableHeader className="bg-gray-100 text-gray-800 text-left">
                    <TableRow>
                        <TableHead className="py-3 px-4 text-sm font-semibold">No.</TableHead>
                        <TableHead className="py-3 px-4 text-sm font-semibold">Tên công ty</TableHead>
                        <TableHead className="py-3 px-4 text-sm font-semibold">Email</TableHead>
                        <TableHead className="py-3 px-4 text-sm font-semibold">Số điện thoại</TableHead>
                        <TableHead className="py-3 px-4 text-sm font-semibold">Loại công ty</TableHead>
                        <TableHead className="py-3 px-4 text-sm font-semibold"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedCompanies.length > 0 ? (
                        paginatedCompanies.map((company, index) => (
                            <TableRow
                                key={index}
                                className="border-b transition-colors hover:bg-gray-50 hover:cursor-pointer"
                                onClick={() => handleRowClick(index)}
                            >
                                <TableCell className="py-3 px-4 text-sm">{startIndex + index + 1}</TableCell>
                                <TableCell className="py-3 px-4 text-sm">{company.name}</TableCell>
                                <TableCell className="py-3 px-4 text-sm">{company.email}</TableCell>
                                <TableCell className="py-3 px-4 text-sm">{company.phone}</TableCell>
                                <TableCell className="py-3 px-4 text-sm">
                                    {company.is_headquarter ? "Trụ sở chính" : "Chi nhánh"}
                                </TableCell>

                                <TableCell className="py-3 px-4">
                                    {/* Button inside TableCell */}
                                    {selectedRow === index && (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline">Hành động</Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="w-56">
                                                <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuRadioGroup>
                                                    <DropdownMenuRadioItem value="edit" onClick={() => handleEdit(company)}>Sửa</DropdownMenuRadioItem>
                                                    <DropdownMenuRadioItem value="delete" onClick={() => handleDelete(company._id)}>Xoá</DropdownMenuRadioItem>
                                                </DropdownMenuRadioGroup>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-4 text-sm">
                                No companies found
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Pagination controls */}
            <div className="mt-4 text-right">
                <div className="inline-block mr-4">
                    {/* Rows per page dropdown */}
                    <label htmlFor="rowsPerPage" className="mr-2 text-sm font-semibold text-gray-700">
                        Rows per page:
                    </label>
                    <select
                        id="rowsPerPage"
                        value={rowsPerPage}
                        onChange={handleRowsPerPageChange}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        {[10, 25, 50, 100].map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="inline-block">
                    {/* Pagination buttons */}
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border rounded-md bg-gray-200 text-sm font-semibold text-gray-700 disabled:bg-gray-300 disabled:text-gray-500 hover:bg-gray-300 focus:ring-2 focus:ring-indigo-500"
                    >
                        Previous
                    </button>
                    <span className="text-sm font-semibold text-gray-700 mx-2">
                        Page {currentPage} of {Math.ceil(filteredCompanies.length / rowsPerPage)}
                    </span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === Math.ceil(filteredCompanies.length / rowsPerPage)}
                        className="px-4 py-2 border rounded-md bg-gray-200 text-sm font-semibold text-gray-700 disabled:bg-gray-300 disabled:text-gray-500 hover:bg-gray-300 focus:ring-2 focus:ring-indigo-500"
                    >
                        Next
                    </button>
                </div>
            </div>

            <Dialog open={isDialogOpenEdit} onOpenChange={setIsDialogOpenEdit}>
                <DialogContent className="sm:max-w-[425px] md:max-w-[500px] lg:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Edit profile</DialogTitle>
                        <DialogDescription>
                            {"Make changes to your profile here. Click save when you're done."}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                    Tên công ty
                                </Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}  // Add onChange handler
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="username" className="text-right">
                                    Email
                                </Label>
                                <Input
                                    id="username"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}  // Add onChange handler
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="phone" className="text-right">
                                    Số điện thoại
                                </Label>
                                <Input
                                    id="phone"
                                    value={phone}
                                    inputMode="numeric"
                                    onChange={(e) => {
                                        let value = e.target.value;

                                        // Chỉ cho phép số và tối đa 10 số
                                        if (/^\d{0,10}$/.test(value)) {
                                            // Nếu có ít nhất 1 ký tự
                                            if (value.length > 0) {
                                                // Bắt buộc số đầu tiên phải là '0'
                                                if (value[0] !== '0') {
                                                    value = '0' + value; // tự động thêm '0' vào đầu nếu thiếu
                                                }
                                            }
                                            setPhone(value);
                                        }
                                    }}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Input
                                    className="col-span-3"
                                    type="hidden"
                                    id="is_headquarter"
                                    name="is_headquarter"
                                    value="false"
                                />
                            </div>
                        </div>
                    </form>
                    <DialogFooter>
                        <Button type="submit" disabled={isButtonDisabled} onClick={handleUpdate}>Update changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
