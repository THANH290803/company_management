import { useState, useEffect } from "react";
import axios from "axios";

export interface Department {
    _id: string;
    name: string;
    company_id: {
        _id: string;
        name: string;
        is_headquarter: boolean;
        phone: string;
        email: string;
    };
}

export function useDepartments() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        const token = localStorage.getItem("token");
        axios.get("https://qthl-group.onrender.com/api/department", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => {
                setDepartments(response.data);
            })
            .catch((error) => {
                console.error("Error fetching departments:", error);
            });
    }, []);

    const filteredDepartments = departments.filter(department =>
        department.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastDepartment = currentPage * rowsPerPage;
    const indexOfFirstDepartment = indexOfLastDepartment - rowsPerPage;
    const currentDepartments = filteredDepartments.slice(indexOfFirstDepartment, indexOfLastDepartment);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(parseInt(event.target.value));
        setCurrentPage(1);
    };

    const handleDelete = async (id: string) => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Không tìm thấy token!");
            return;
        }
    
        try {
            await axios.delete(`https://qthl-group.onrender.com/api/department/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            // Cập nhật danh sách phòng ban sau khi xoá
            setDepartments((prev) => prev.filter((dept) => dept._id !== id));
        } catch (error) {
            console.error("Lỗi xoá phòng ban:", error);
        }
    };
    

    return {
        departments,
        searchTerm,
        setSearchTerm,
        currentPage,
        rowsPerPage,
        setRowsPerPage,
        handleRowsPerPageChange,
        filteredDepartments,
        currentDepartments,
        paginate,
        handleDelete
    };
}
