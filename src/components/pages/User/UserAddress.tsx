import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
    User,
    Phone,
    MapPin,
    Save,
    Trash2,
    Edit,
    RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../shadcn-components/ui/card";
import { Label } from "../../../shadcn-components/ui/label";
import { Button } from "../../../shadcn-components/ui/button";
import { Input } from "../../../shadcn-components/ui/input";
import AuthUtil from "../../../utils/authUtil";
import { LeftUserSideBar } from "./LeftUserSideBar";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Address } from "../../../types/ApiResponse/Address/Address";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import {
    fetchAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
} from "../../../redux/slice/addressSlice";
import { toast } from "react-toastify";

// Định nghĩa schema và types
interface AddressFormInputs {
    fullName: string;
    phone: string;
    province: string;
    district: string;
    ward: string;
    addInfo: string;
    isDefault: boolean;
}

const AddressSchema = z.object({
    fullName: z
        .string()
        .min(2, { message: "Họ và tên phải có ít nhất 2 ký tự" })
        .max(50, { message: "Họ và tên không được vượt quá 50 ký tự" }),

    phone: z
        .string()
        .regex(/^(0[1-9][0-9]{8,9})$/, { message: "Số điện thoại không hợp lệ" }),

    province: z
        .string()
        .min(2, { message: "Tỉnh/Thành phố phải có ít nhất 2 ký tự" })
        .max(50, { message: "Tỉnh/Thành phố không được vượt quá 50 ký tự" }),

    district: z
        .string()
        .min(2, { message: "Quận/Huyện phải có ít nhất 2 ký tự" })
        .max(50, { message: "Quận/Huyện không được vượt quá 50 ký tự" }),

    ward: z
        .string()
        .min(2, { message: "Phường/Xã phải có ít nhất 2 ký tự" })
        .max(50, { message: "Phường/Xã không được vượt quá 50 ký tự" }),

    addInfo: z
        .string()
        .max(200, { message: "Thông tin bổ sung không được vượt quá 200 ký tự" })
        .optional()
        .transform((val) => val || ""),

    isDefault: z.boolean(),
});

export const UserAddress = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { addresses, status } = useSelector((state: RootState) => state.address);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [userId, setUserId] = useState<number | null>(null);

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<AddressFormInputs>({
        resolver: zodResolver(AddressSchema),
        mode: "onBlur",
        defaultValues: {
            fullName: "",
            phone: "",
            province: "",
            district: "",
            ward: "",
            addInfo: "",
            isDefault: false,
        },
    });

    useEffect(() => {
        const user = AuthUtil.getUser();
        console.log("User from AuthUtil:", user); // Debug
        if (user?.id) {
            console.log("Setting userId:", user.id); // Debug
            setUserId(user.id);
        } else {
            console.error("Không thể lấy userId từ AuthUtil.getUser():", user);
            toast.error("Vui lòng đăng nhập để quản lý địa chỉ.");
        }
    }, []);

    useEffect(() => {
        console.log("Current status:", status); // Debug
    }, [status]);

    useEffect(() => {
        if (userId) {
            console.log("Fetching addresses for userId:", userId); // Debug
            dispatch(fetchAddresses(userId.toString()));
        }
    }, [dispatch, userId]);

    const onSubmit = async (data: AddressFormInputs) => {
        console.log("Form submitted with data:", data); // Debug
        if (!userId) {
            console.error("userId is null"); // Debug
            toast.error("Không thể xác định userId. Vui lòng đăng nhập lại.");
            return;
        }

        const addressData: Address = {
            id: editingAddress?.id || 0,
            userId: userId,
            fullName: data.fullName,
            phone: data.phone,
            province: data.province,
            district: data.district,
            ward: data.ward,
            addInfo: data.addInfo || "",
            isDefault: data.isDefault,
        };

        console.log("Address data to submit:", addressData); // Debug
        console.log("Editing address:", editingAddress); // Debug

        try {
            // Xác nhận nếu thay đổi thành địa chỉ mặc định
            if (editingAddress && !editingAddress.isDefault && data.isDefault) {
                const confirmChange = window.confirm(
                    "Bạn có chắc chắn muốn đặt địa chỉ này làm mặc định? Điều này sẽ bỏ chọn địa chỉ mặc định hiện tại (nếu có)."
                );
                if (!confirmChange) {
                    return;
                }
            }

            if (editingAddress) {
                if (!addressData.id || addressData.id <= 0) {
                    toast.error("Địa chỉ không hợp lệ. Vui lòng làm mới danh sách và thử lại.");
                    return;
                }

                console.log("Dispatching updateAddress"); // Debug
                const result = await dispatch(updateAddress({ addressData }));
                if (updateAddress.rejected.match(result)) {
                    console.log("Update failed:", result.payload); // Debug
                } else if (updateAddress.fulfilled.match(result)) {
                    console.log("Update succeeded, response:", result.payload); // Debug
                    // Tự động làm mới danh sách địa chỉ
                    dispatch(fetchAddresses(userId.toString()));
                }
                setEditingAddress(null);
                reset();
            } else {
                console.log("Dispatching addAddress"); // Debug
                const result = await dispatch(addAddress(addressData));
                if (addAddress.fulfilled.match(result)) {
                    console.log("Add succeeded, response:", result.payload); // Debug
                    // Tự động làm mới danh sách địa chỉ
                    dispatch(fetchAddresses(userId.toString()));
                } else if (addAddress.rejected.match(result)) {
                    console.log("Add failed:", result.payload); // Debug
                    toast.error("Không thể thêm địa chỉ. Vui lòng thử lại.");
                }
                reset();
            }
        } catch (error) {
            console.error("Error during submission:", error);
            toast.error("Đã có lỗi xảy ra khi lưu địa chỉ.");
        }
    };

    const handleEdit = async (address: Address) => {
        console.log("Editing address:", address); // Debug
        if (!userId) {
            toast.error("Không thể xác định userId. Vui lòng đăng nhập lại.");
            return;
        }

        if (!address.id || address.id <= 0) {
            toast.error("Địa chỉ không hợp lệ. Vui lòng làm mới danh sách và thử lại.");
            return;
        }

        setEditingAddress(address);
        setValue("fullName", address.fullName || "");
        setValue("phone", address.phone || "");
        setValue("province", address.province || "");
        setValue("district", address.district || "");
        setValue("ward", address.ward || "");
        setValue("addInfo", address.addInfo || "");
        setValue("isDefault", address.isDefault || false);
    };

    const handleDelete = (addressId: number) => {
        console.log("Dispatching deleteAddress with addressId:", addressId); // Debug
        dispatch(deleteAddress({ id: addressId })).then((result) => {
            if (deleteAddress.rejected.match(result)) {
                console.log("Delete address failed:", result.payload); // Debug
                toast.error("Không thể xóa địa chỉ. Vui lòng thử lại.");
            } else {
                // Tự động làm mới danh sách sau khi xóa
                dispatch(fetchAddresses(userId!.toString()));
            }
        });
    };

    const handleCancelEdit = () => {
        console.log("Canceling edit"); // Debug
        setEditingAddress(null);
        reset();
    };

    const handleRefresh = () => {
        if (userId) {
            dispatch(fetchAddresses(userId.toString()));
        }
    };

    console.log("Addresses in state:", addresses); // Debug

    return (
        <div className="flex bg-gray-50">
            <LeftUserSideBar />

            <div className="flex-1 pl-8 pr-4">
                <Card className="shadow-lg">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-2xl font-bold">Quản lý địa chỉ</CardTitle>
                        <CardDescription>
                            Thêm, sửa hoặc xóa địa chỉ giao hàng của bạn
                        </CardDescription>
                    </CardHeader>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <CardContent className="space-y-6 pt-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName" className="flex items-center gap-2">
                                        <User size={16} />
                                        <span>Họ và tên người nhận</span>
                                    </Label>
                                    <Controller
                                        name="fullName"
                                        control={control}
                                        render={({ field }) => (
                                            <>
                                                <Input
                                                    {...field}
                                                    value={field.value || ""}
                                                    onChange={(e) => field.onChange(e.target.value)}
                                                    id="fullName"
                                                    placeholder="Nhập họ và tên"
                                                />
                                                {errors.fullName && (
                                                    <div className="text-red-500 text-sm mt-1">
                                                        {errors.fullName.message}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    />
                                </div>

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
                                                    value={field.value || ""}
                                                    onChange={(e) => field.onChange(e.target.value)}
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

                                <div className="space-y-2">
                                    <Label htmlFor="province" className="flex items-center gap-2">
                                        <MapPin size={16} />
                                        <span>Tỉnh/Thành phố</span>
                                    </Label>
                                    <Controller
                                        name="province"
                                        control={control}
                                        render={({ field }) => (
                                            <>
                                                <Input
                                                    {...field}
                                                    value={field.value || ""}
                                                    onChange={(e) => field.onChange(e.target.value)}
                                                    id="province"
                                                    placeholder="Nhập tỉnh/thành phố"
                                                />
                                                {errors.province && (
                                                    <div className="text-red-500 text-sm mt-1">
                                                        {errors.province.message}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="district" className="flex items-center gap-2">
                                        <MapPin size={16} />
                                        <span>Quận/Huyện</span>
                                    </Label>
                                    <Controller
                                        name="district"
                                        control={control}
                                        render={({ field }) => (
                                            <>
                                                <Input
                                                    {...field}
                                                    value={field.value || ""}
                                                    onChange={(e) => field.onChange(e.target.value)}
                                                    id="district"
                                                    placeholder="Nhập quận/huyện"
                                                />
                                                {errors.district && (
                                                    <div className="text-red-500 text-sm mt-1">
                                                        {errors.district.message}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="ward" className="flex items-center gap-2">
                                        <MapPin size={16} />
                                        <span>Phường/Xã</span>
                                    </Label>
                                    <Controller
                                        name="ward"
                                        control={control}
                                        render={({ field }) => (
                                            <>
                                                <Input
                                                    {...field}
                                                    value={field.value || ""}
                                                    onChange={(e) => field.onChange(e.target.value)}
                                                    id="ward"
                                                    placeholder="Nhập phường/xã"
                                                />
                                                {errors.ward && (
                                                    <div className="text-red-500 text-sm mt-1">
                                                        {errors.ward.message}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="addInfo" className="flex items-center gap-2">
                                        <MapPin size={16} />
                                        <span>Thông tin bổ sung (không bắt buộc)</span>
                                    </Label>
                                    <Controller
                                        name="addInfo"
                                        control={control}
                                        render={({ field }) => (
                                            <>
                                                <Input
                                                    {...field}
                                                    value={field.value || ""}
                                                    onChange={(e) => field.onChange(e.target.value)}
                                                    id="addInfo"
                                                    placeholder="Nhập thông tin bổ sung (số nhà, tên đường, v.v.)"
                                                />
                                                {errors.addInfo && (
                                                    <div className="text-red-500 text-sm mt-1">
                                                        {errors.addInfo.message}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Controller
                                        name="isDefault"
                                        control={control}
                                        render={({ field }) => (
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    id="isDefault"
                                                    checked={field.value || false}
                                                    onChange={(e) => field.onChange(e.target.checked)}
                                                />
                                                <Label htmlFor="isDefault">
                                                    Đặt làm địa chỉ mặc định
                                                </Label>
                                            </div>
                                        )}
                                    />
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="flex justify-end space-x-4 pt-2">
                            {editingAddress && (
                                <Button
                                    variant="outline"
                                    onClick={handleCancelEdit}
                                    type="button"
                                >
                                    Hủy
                                </Button>
                            )}
                            <Button
                                type="submit"
                                disabled={status === "loading"}
                                className="flex items-center gap-2"
                            >
                                {status === "loading" ? ("Đang lưu...") : (
                                    <>
                                        <Save size={16} />
                                        <span>{editingAddress ? "Cập nhật địa chỉ" : "Thêm địa chỉ"}</span>
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </form>

                    {addresses.length > 0 && (
                        <CardContent className="pt-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">Danh sách địa chỉ</h3>
                                <Button
                                    variant="outline"
                                    onClick={handleRefresh}
                                    disabled={status === "loading"}
                                    className="flex items-center gap-2"
                                >
                                    <RefreshCw size={16} />
                                    Làm mới
                                </Button>
                            </div>
                            <div className="space-y-4">
                                {addresses.map((address) => (
                                    <div
                                        key={address.id}
                                        className={`p-4 border rounded-lg flex justify-between items-center ${
                                            address.isDefault
                                                ? "border-green-500 bg-green-50 shadow-md"
                                                : "border-gray-300"
                                        }`}
                                    >
                                        <div>
                                            <p className="font-medium">{address.fullName}</p>
                                            <p>{address.phone}</p>
                                            <p>{address.addInfo}, {address.ward}, {address.district}, {address.province}</p>
                                            {address.isDefault && (
                                                <span
                                                    className="inline-block mt-1 px-2 py-1 text-xs font-semibold text-white bg-green-500 rounded-full transition-all duration-300 hover:bg-green-600"
                                                    title="Đây là địa chỉ mặc định của bạn"
                                                >
                                                    Mặc định
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEdit(address)}
                                            >
                                                <Edit size={16} />
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(address.id)}
                                                disabled={status === "loading"}
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    )}
                </Card>
            </div>
        </div>
    );
};