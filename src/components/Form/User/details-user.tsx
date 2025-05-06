"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

// import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useUsers, User } from "@/lib/useUser"
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

const formSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
})

export function UserDetails() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
    }

    const searchParams = useSearchParams();
    const userId = searchParams.get("id");
    const [user, setUser] = useState<User | null>(null);
    const { getRoleName, getCompanyName, getTeamName, getDepartmentName } = useUsers(); // dùng lại hook

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            if (!token || !userId) return;

            try {
                const res = await axios.get(`https://qthl-group.onrender.com/api/user/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(res.data);
            } catch (err) {
                console.error("Lỗi khi lấy thông tin người dùng:", err);
            }
        };

        fetchUser();
    }, [userId]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem className="w-[550px]">
                            <FormLabel>Tên người dùng</FormLabel>
                            <FormControl style={{ marginBottom: '15px' }}>
                                <Input value={user?.name || ''} disabled />
                            </FormControl>

                            <FormLabel>Email người dùng</FormLabel>
                            <FormControl style={{ marginBottom: '15px' }}>
                                <Input value={user?.email || ''} disabled />
                            </FormControl>

                            <FormLabel>Vai trò / Chức vụ người dùng</FormLabel>
                            <FormControl style={{ marginBottom: '15px' }}>
                                <Input value={getRoleName(user?.role_id || '')} disabled />
                            </FormControl>

                            <FormLabel>Thuộc team</FormLabel>
                            <FormControl style={{ marginBottom: '15px' }}>
                                <Input value={getTeamName(user?.team_id || '')} disabled />
                            </FormControl>

                            <FormLabel>Phòng ban</FormLabel>
                            <FormControl style={{ marginBottom: '15px' }}>
                                <Input value={getDepartmentName(user?.department_id || '')} disabled />
                            </FormControl>

                            <FormLabel>Làm việc cho công ty</FormLabel>
                            <FormControl style={{ marginBottom: '15px' }}>
                                <Input value={getCompanyName(user?.company_id || '')} disabled />
                            </FormControl>

                            <FormLabel>Ngày tạo</FormLabel>
                            <FormControl style={{ marginBottom: '15px' }}>
                                <Input
                                    value={
                                        user?.createdAt
                                            ? (() => {
                                                const date = new Date(user.createdAt);
                                                const pad = (n: number) => n.toString().padStart(2, "0");

                                                const day = pad(date.getDate());
                                                const month = pad(date.getMonth() + 1);
                                                const year = date.getFullYear();
                                                const hours = pad(date.getHours());
                                                const minutes = pad(date.getMinutes());
                                                const seconds = pad(date.getSeconds());

                                                return `${day}/${month}/${year} - ${hours}:${minutes}:${seconds}`;
                                            })()
                                            : ""
                                    }
                                    disabled
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    )
}
