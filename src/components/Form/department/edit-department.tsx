"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useRouter, useSearchParams } from "next/navigation"
import axios from "axios" // Import Axios

// Định nghĩa schema validation với Zod
const formSchema = z.object({
    name: z.string().min(1, {
        message: "Bạn không được để trống tên phòng ban",
    }),
    company_id: z.string().min(1, {
        message: "Vui lòng chọn công ty",
    }),
})

type Company = {
    _id: string;
    name: string;
    is_headquarter: boolean;
    phone: string;
    email: string;
};

type DepartmentFormValues = z.infer<typeof formSchema>

export function EditDepartment() {
    const form = useForm<DepartmentFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            company_id: "",
        },
    })

    const [companies, setCompanies] = useState<Company[]>([]) // State để lưu danh sách công ty
    const router = useRouter()
    const searchParams = useSearchParams()
    const id = searchParams.get("id")

    // Lấy danh sách công ty
    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const token = localStorage.getItem("token")

                if (!token) {
                    console.error("No token found in localStorage!")
                    return
                }

                const response = await axios.get("https://qthl-group.onrender.com/api/company", {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                })

                setCompanies(response.data)  // Lưu dữ liệu vào state
            } catch (error) {
                console.error("Error fetching companies:", error)
            }
        }

        fetchCompanies()
    }, [])

    // Lấy thông tin phòng ban để sửa
    useEffect(() => {
        const fetchDepartment = async () => {
            if (!id) return

            const token = localStorage.getItem("token")
            if (!token) return

            try {
                const res = await axios.get(`https://qthl-group.onrender.com/api/department/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                const data = res.data

                if (data) {
                    // Reset form với dữ liệu trả về từ API
                    form.reset({
                        name: data.name,
                        company_id: data.company_id._id || data.company_id, // Kiểm tra đúng kiểu dữ liệu
                    })
                }
            } catch (error) {
                console.error("Lỗi lấy thông tin phòng ban:", error)
            }
        }

        fetchDepartment()
    }, [id, form])

    const onSubmit = async (data: DepartmentFormValues) => {
        const token = localStorage.getItem("token")
        if (!token || !id) return

        try {
            const response = await axios.put(
                `https://qthl-group.onrender.com/api/department/${id}`,
                data,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            )

            if (response.status === 200) {
                router.push("/department") // Chuyển hướng đến trang danh sách phòng ban
            } else {
                console.error("Lỗi cập nhật phòng ban")
            }
        } catch (error) {
            console.error("Lỗi cập nhật phòng ban:", error)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tên phòng ban</FormLabel>
                            <FormControl className="w-[550px]">
                                <Input placeholder="Nhập tên phòng ban" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="company_id"
                    render={({ field }) => {
                        const selectedCompany = companies.find(c => c._id === field.value)

                        return (
                            <FormItem>
                                <FormLabel>Công ty trực thuộc</FormLabel>
                                <FormControl>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className="w-[550px]">
                                            <SelectValue placeholder="Chọn công ty">
                                                {selectedCompany ? selectedCompany.name : "Chọn công ty"}
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {companies.length === 0 ? (
                                                <SelectItem value="0" disabled>
                                                    Không có công ty nào
                                                </SelectItem>
                                            ) : (
                                                companies.map((company) => (
                                                    <SelectItem key={company._id} value={company._id}>
                                                        {company.name}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )
                    }}
                />
                <Button type="submit" style={{ float: 'right' }}>Cập nhật phòng ban</Button>
            </form>
        </Form>
    )
}
