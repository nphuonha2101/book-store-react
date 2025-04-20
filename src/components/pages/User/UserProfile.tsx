import { useState, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
    User,
    Phone,
    MapPin,
    Save,
    Upload
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../shadcn-components/ui/card";
import { Label } from "../../../shadcn-components/ui/label";
import { Button } from "../../../shadcn-components/ui/button";
import { Input } from "../../../shadcn-components/ui/input";
import AuthUtil from "../../../utils/authUtil";
import { LeftUserSideBar } from "./LeftUserSideBar";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { API_ENDPOINTS } from "../../../constants/apiInfo.ts";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store.ts";
import { refreshUser } from "../../../redux/slice/authSlice.ts";
import Logger from "../../../log/Logger.ts";

// Define form input types
interface UserProfileFormInputs {
    name: string;
    phone: string;
    password?: string;
    address?: string;
    avatar?: File;
}

const UserProfileSchema = z.object({
    name: z.string()
        .min(2, { message: "Họ và tên phải có ít nhất 2 ký tự" })
        .max(50, { message: "Họ và tên không được vượt quá 50 ký tự" }),

    phone: z.string()
        .regex(/^(0[1-9][0-9]{8,9})$/, { message: "Số điện thoại không hợp lệ" }),

    password: z.string()
        .optional()
        .refine(val => !val || val.length >= 6, {
            message: "Mật khẩu phải có ít nhất 6 ký tự"
        }),

    address: z.string()
        .max(200, { message: "Địa chỉ không được vượt quá 200 ký tự" })
        .optional(),

    avatar: z.instanceof(File)
        .optional()
        .refine(file => {
            if (!file) return true;
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            const maxSize = 5 * 1024 * 1024; // 5MB
            return allowedTypes.includes(file.type) && file.size <= maxSize;
        }, {
            message: "Ảnh phải là JPEG, PNG, GIF và không quá 5MB"
        })
});

export const UserProfile = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user: userData } = useSelector((state: RootState) => state.auth);
    const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Use react-hook-form for form validation and submission
    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<UserProfileFormInputs>({
        resolver: zodResolver(UserProfileSchema),
        mode: 'onBlur',
    });

    useEffect(() => {


        if (userData) {
            // Set form fields with user data
            setValue('name', userData.name || '');
            setValue('phone', userData.phone || '');
            setValue('address', userData.address || '');
        }
    }, [setValue]);

    const handleAvatarClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Create a preview URL for the selected image
            const objectUrl = URL.createObjectURL(file);
            setPreviewAvatar(objectUrl);

            // Set the file in the form
            setValue('avatar', file);
        }
    };

    const onSubmit = async (data: UserProfileFormInputs) => {
        try {
            setIsSubmitting(true);
            // Create a FormData object to send both file and other form data
            const formData = new FormData();

            // Append text fields
            formData.append('name', data.name);
            formData.append('phone', data.phone);
            formData.append('address', data.address || '');

            // Only append password if it's not empty
            if (data.password) {
                formData.append('password', data.password);
            }

            if (data.avatar instanceof File) {
                formData.append('avatar', data.avatar);
            }

            updateProfile(formData);
        } catch (error) {
            console.error('Error updating profile:', error);
            // Handle error (could add error state and display message)
            toast.error("Đã có lỗi xảy ra khi cập nhật thông tin");
            Logger.error("Update profile error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateProfile = async (formData: FormData) => {
        setIsSubmitting(true);
        const response = await fetch(API_ENDPOINTS.AUTH.UPDATE.URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${AuthUtil.getToken()}`,
            },
            body: formData,
        }).then((res) => res.json())
            .catch((error) => {
                Logger.error("Update profile error:", error);
                return null;
            });

        if (!response.success) {
            toast.error(response.message || "Đã có lỗi xảy ra khi cập nhật thông tin");
            return;
        }
        dispatch(refreshUser(response.data));
        toast.success("Cập nhật thông tin thành công");
    }

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase();
    };

    return (
        <div className="flex bg-gray-50">
            {/* Left sidebar */}
            <LeftUserSideBar />

            {/* Main content */}
            <div className="flex-1 pl-8 pr-4">
                <Card className="shadow-lg">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-2xl font-bold">Thông tin cá nhân</CardTitle>
                        <CardDescription>
                            Cập nhật thông tin cá nhân của bạn
                        </CardDescription>
                    </CardHeader>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <CardContent className="space-y-6 pt-2">
                            {/* Hidden file input for avatar upload */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                accept="image/*"
                                onChange={handleFileChange}
                            />

                            {/* Avatar upload section */}
                            <div className="flex flex-col items-center justify-center space-y-4">
                                <div
                                    className="relative cursor-pointer group"
                                    onClick={handleAvatarClick}
                                >
                                    <div className="w-42 h-42 rounded-full border-2 border-transparent group-hover:border-blue-500 transition-all overflow-hidden relative">
                                        {previewAvatar || (userData && userData.avatar) ? (
                                            <img
                                                src={previewAvatar || (userData && userData.avatar) || undefined}
                                                alt={userData?.name || 'Người dùng'}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-800 text-xl">
                                                {getInitials(userData?.name || 'Người dùng')}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex gap-2 items-center"
                                    onClick={handleAvatarClick}
                                    type="button"
                                >
                                    <Upload size={16} />
                                    <span>Tải lên ảnh đại diện</span>
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name field */}
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="flex items-center gap-2">
                                        <User size={16} />
                                        <span>Họ và tên</span>
                                    </Label>
                                    <Controller
                                        name="name"
                                        control={control}
                                        render={({ field }) => (
                                            <>
                                                <Input
                                                    {...field}
                                                    id="name"
                                                    placeholder="Nhập họ và tên"
                                                />
                                                {errors.name && (
                                                    <div className="text-red-500 text-sm mt-1">
                                                        {errors.name.message}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    />
                                </div>

                                {/* Phone field */}
                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="flex items-center gap-2">
                                        <Phone size={16} />
                                        <span>Số điện thoại</span>
                                    </Label>
                                    <Controller
                                        name="phone"
                                        control={control}
                                        render={({ field }) => (
                                            <>
                                                <Input
                                                    {...field}
                                                    id="phone"
                                                    placeholder="Nhập số điện thoại"
                                                />
                                                {errors.phone && (
                                                    <div className="text-red-500 text-sm mt-1">
                                                        {errors.phone.message}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    />
                                </div>

                                {/* Password field */}
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="flex items-center gap-2">
                                        <span>Mật khẩu</span>
                                    </Label>
                                    <Controller
                                        name="password"
                                        control={control}
                                        render={({ field }) => (
                                            <>
                                                <Input
                                                    {...field}
                                                    id="password"
                                                    type="password"
                                                    placeholder="Nhập mật khẩu mới (để trống nếu không thay đổi)"
                                                />
                                                {errors.password && (
                                                    <div className="text-red-500 text-sm mt-1">
                                                        {errors.password.message}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    />
                                </div>

                                {/* Address field - full width */}
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="address" className="flex items-center gap-2">
                                        <MapPin size={16} />
                                        <span>Địa chỉ</span>
                                    </Label>
                                    <Controller
                                        name="address"
                                        control={control}
                                        render={({ field }) => (
                                            <>
                                                <Input
                                                    {...field}
                                                    id="address"
                                                    placeholder="Nhập địa chỉ"
                                                />
                                                {errors.address && (
                                                    <div className="text-red-500 text-sm mt-1">
                                                        {errors.address.message}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    />
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="flex justify-end space-x-4 pt-2">
                            <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2">
                                {isSubmitting ? ("Đang lưu...") : (
                                    <>
                                        <Save size={16} />
                                        <span>Lưu thay đổi</span>
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
};