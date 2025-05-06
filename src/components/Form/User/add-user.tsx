"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import axios from "axios"
import { useUsers } from "@/lib/useUser"
import * as React from "react"
import { useState } from "react";

const formSchema = z.object({
    name: z.string().min(1, { message: "Tên người dùng không được để trống" }),
    password: z.string().min(1, { message: "Password không được để trống" }),
    email: z.string().email({ message: "Email không hợp lệ." }),
    role_id: z.string().min(1, { message: "Vui lòng chọn vai trò" }),
    company_id: z.string().min(1, { message: "Vui lòng chọn công ty" }),
    department_id: z.string().nullable(),
    team_id: z.string().nullable(),
})

export function AddUser() {
    const [rolePopoverOpen, setRolePopoverOpen] = useState(false);
    const [companyPopoverOpen, setCompanyPopoverOpen] = useState(false);
    const [teamPopoverOpen, setTeamPopoverOpen] = useState(false);
    const [departmentPopoverOpen, setDepartmentPopoverOpen] = useState(false);
    const {
        roles,
        companies,
        departments,
        teams,
    } = useUsers()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            role_id: "",
            company_id: "",
            department_id: null,
            team_id: null,
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values);
        try {
            const token = localStorage.getItem("token")
            await axios.post("https://qthl-group.onrender.com/api/user/post", values, {
                headers: { Authorization: `Bearer ${token}` },
            })
            alert("Thêm người dùng thành công!")
            form.reset()
            window.location.href = "/user"
        } catch (error) {
            console.error("Lỗi khi thêm người dùng:", error)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-[550px]">
                {/* Tên người dùng */}
                <FormField
                    name="name"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tên người dùng</FormLabel>
                            <FormControl>
                                <Input placeholder="Nhập tên" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    name="password"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input placeholder="Nhập password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Email */}
                <FormField
                    name="email"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="email@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Vai trò */}
                <FormField
                    name="role_id"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Vai trò</FormLabel>
                            <FormControl>
                                <Popover open={rolePopoverOpen} onOpenChange={setRolePopoverOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className="w-full justify-between"
                                        >
                                            {roles.find((role) => role._id === field.value)?.name || "-- Chọn vai trò --"}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[550px] p-0">
                                        <Command>
                                            <CommandInput placeholder="Tìm vai trò..." />
                                            <CommandList>
                                                <CommandEmpty>Không tìm thấy vai trò.</CommandEmpty>
                                                <CommandGroup>
                                                    {roles.map((role) => (
                                                        <CommandItem
                                                            key={role._id}
                                                            value={role.name}
                                                            onSelect={() => {
                                                                form.setValue("role_id", role._id);
                                                                setRolePopoverOpen(false); // Hide Popover when a role is selected
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    field.value === role._id ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                            {role.name}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />


                {/* Công ty */}
                <FormField
                    name="company_id"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Công ty</FormLabel>
                            <FormControl>
                                <Popover open={companyPopoverOpen} onOpenChange={setCompanyPopoverOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className="w-full justify-between"
                                        >
                                            {companies.find((company) => company._id === field.value)?.name || "Chọn công ty..."}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[550px] p-0">
                                        <Command>
                                            <CommandInput placeholder="Tìm công ty..." />
                                            <CommandList>
                                                <CommandEmpty>Không tìm thấy công ty.</CommandEmpty>
                                                <CommandGroup>
                                                    {companies.map((company) => (
                                                        <CommandItem
                                                            key={company._id}
                                                            value={company.name}
                                                            onSelect={() => {
                                                                form.setValue("company_id", company._id);
                                                                setCompanyPopoverOpen(false);
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    field.value === company._id ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                            {company.name}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Phòng ban */}
                <FormField
                    name="department_id"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phòng ban</FormLabel>
                            <FormControl>
                                <Popover open={departmentPopoverOpen} onOpenChange={setDepartmentPopoverOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className="w-full justify-between"
                                        >
                                            {departments.find((dept) => dept._id === field.value)?.name || "Chọn phòng ban..."}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[550px] p-0">
                                        <Command>
                                            <CommandInput placeholder="Tìm phòng ban..." />
                                            <CommandList>
                                                <CommandEmpty>Không tìm thấy phòng ban.</CommandEmpty>
                                                <CommandGroup>
                                                    {departments.map((dept) => (
                                                        <CommandItem
                                                            key={dept._id}
                                                            value={dept.name}
                                                            onSelect={() => {
                                                                form.setValue("department_id", dept._id);
                                                                setDepartmentPopoverOpen(false);
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    field.value === dept._id ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                            {dept.name}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Team */}
                <FormField
                    name="team_id"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Team</FormLabel>
                            <FormControl>
                                <Popover open={teamPopoverOpen} onOpenChange={setTeamPopoverOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className="w-full justify-between"
                                        >
                                            {teams.find((team) => team._id === field.value)?.name || "Chọn team..."}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[550px] p-0">
                                        <Command>
                                            <CommandInput placeholder="Tìm team..." />
                                            <CommandList>
                                                <CommandEmpty>Không tìm thấy team.</CommandEmpty>
                                                <CommandGroup>
                                                    {teams.map((team) => (
                                                        <CommandItem
                                                            key={team._id}
                                                            value={team.name}
                                                            onSelect={() => {
                                                                form.setValue("team_id", team._id);
                                                                setTeamPopoverOpen(false);
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    field.value === team._id ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                            {team.name}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit">Thêm người dùng</Button>
            </form>
        </Form>
    )
}
