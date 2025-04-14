import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import AuthUtil from "../../utils/authUtil";
import { Address } from "../../components/vendor/Address/Address.ts";
import { API_ENDPOINTS } from "../../constants/ApiInfo.ts";
import Logger from "../../log/Logger.ts";

interface AddressState {
    addresses: Address[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

const initialState: AddressState = {
    addresses: [],
    status: "idle",
    error: null,
};

export const fetchAddresses = createAsyncThunk<Address[], string, { rejectValue: string }>(
    "address/fetchAddresses",
    async (userId, { rejectWithValue }) => {
        try {
            console.log("Fetching addresses for userId:", userId); // Debug
            const response = await fetch(`${API_ENDPOINTS.ADDRESS.GET_ADDRESS.URL}/${userId}?t=${Date.now()}`, {
                headers: {
                    Authorization: `Bearer ${AuthUtil.getToken()}`,
                    "Cache-Control": "no-cache",
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.log("Fetch addresses response error:", errorData); // Debug
                throw new Error(errorData.message || `Không thể tải danh sách địa chỉ (HTTP ${response.status})`);
            }

            const data = await response.json();
            if (!data.success) {
                throw new Error(data.message || "Không thể tải danh sách địa chỉ");
            }
            console.log("Fetched addresses:", data.data); // Debug
            return data.data;
        } catch (error) {
            Logger.error("Fetch addresses error:", error);
            return rejectWithValue((error as Error).message);
        }
    }
);

export const addAddress = createAsyncThunk<Address, Address, { rejectValue: string }>(
    "address/addAddress",
    async (addressData, { rejectWithValue }) => {
        try {
            console.log("Adding address with data:", addressData); // Debug
            const response = await fetch(`${API_ENDPOINTS.ADDRESS.ADD_ADDRESS.URL}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${AuthUtil.getToken()}`,
                },
                body: JSON.stringify({
                    userId: addressData.userId,
                    fullName: addressData.fullName,
                    phone: addressData.phone,
                    province: addressData.province,
                    district: addressData.district,
                    ward: addressData.ward,
                    addInfo: addressData.addInfo,
                    isDefault: addressData.isDefault,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.log("Add address response error:", errorData); // Debug
                throw new Error(errorData.message || `Không thể thêm địa chỉ (HTTP ${response.status})`);
            }

            const data = await response.json();
            if (!data.success) {
                throw new Error(data.message || "Đã có lỗi xảy ra khi thêm địa chỉ");
            }
            console.log("Added address:", data.data); // Debug
            return data.data;
        } catch (error) {
            Logger.error("Add address error:", error);
            return rejectWithValue((error as Error).message);
        }
    }
);

export const updateAddress = createAsyncThunk<
    Address,
    { addressData: Address },
    { rejectValue: string }
>(
    "address/updateAddress",
    async ({ addressData

           }, { rejectWithValue }) => {
        try {
            console.log("Updating address with data:", addressData); // Debug
            const response = await fetch(`${API_ENDPOINTS.ADDRESS.UPDATE_ADDRESS.URL}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${AuthUtil.getToken()}`,
                },
                body: JSON.stringify({
                    addressId: addressData.id,
                    userId: addressData.userId,
                    fullName: addressData.fullName,
                    phone: addressData.phone,
                    province: addressData.province,
                    district: addressData.district,
                    ward: addressData.ward,
                    addInfo: addressData.addInfo,
                    isDefault: addressData.isDefault,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.log("Update address response error:", errorData); // Debug
                throw new Error(errorData.message || `Không thể cập nhật địa chỉ (HTTP ${response.status})`);
            }

            const data = await response.json();
            if (!data.success) {
                throw new Error(data.message || "Đã có lỗi xảy ra khi cập nhật địa chỉ");
            }
            console.log("Updated address:", data.data); // Debug
            return data.data;
        } catch (error) {
            Logger.error("Update address error:", error);
            return rejectWithValue((error as Error).message);
        }
    }
);

export const deleteAddress = createAsyncThunk<void, { id: number }, { rejectValue: string }>(
    "address/deleteAddress",
    async ({ id }, { rejectWithValue }) => {
        try {
            console.log("Deleting address with id:", id); // Debug
            const response = await fetch(`${API_ENDPOINTS.ADDRESS.DELETE_ADDRESS.URL}?addressId=${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${AuthUtil.getToken()}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.log("Delete address response error:", errorData); // Debug
                throw new Error(errorData.message || `Không thể xóa địa chỉ (HTTP ${response.status})`);
            }

            const data = await response.json();
            if (!data.success) {
                throw new Error(data.message || "Đã có lỗi xảy ra khi xóa địa chỉ");
            }
            console.log("Deleted address:", id); // Debug
        } catch (error) {
            Logger.error("Delete address error:", error);
            return rejectWithValue((error as Error).message);
        }
    }
);

const addressSlice = createSlice({
    name: "address",
    initialState,
    reducers: {
        resetAddressState: (state) => {
            state.addresses = [];
            state.status = "idle";
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAddresses.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchAddresses.fulfilled, (state, action) => {
                state.status = "succeeded";
                // Chỉ cập nhật nếu dữ liệu trả về không rỗng và hợp lệ
                if (action.payload && Array.isArray(action.payload)) {
                    state.addresses = action.payload;
                }
                state.error = null;
                console.log("State updated with fetched addresses:", state.addresses); // Debug
            })
            .addCase(fetchAddresses.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
                console.log("Fetch addresses failed:", action.payload); // Debug
                toast.error(action.payload || "Đã có lỗi xảy ra khi tải danh sách địa chỉ");
                // Không ghi đè state.addresses
            })
            .addCase(addAddress.pending, (state) => {
                state.status = "loading";
            })
            .addCase(addAddress.fulfilled, (state, action) => {
                state.status = "succeeded";
                // Thêm địa chỉ mới vào state ngay lập tức
                state.addresses.push(action.payload);
                state.error = null;
                toast.success("Thêm địa chỉ thành công");
            })
            .addCase(addAddress.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
                console.log("Add address failed:", action.payload); // Debug
                toast.error(action.payload || "Đã có lỗi xảy ra khi thêm địa chỉ");
            })
            .addCase(updateAddress.pending, (state) => {
                state.status = "loading";
            })
            .addCase(updateAddress.fulfilled, (state, action) => {
                state.status = "succeeded";
                // Cập nhật địa chỉ trong state
                const index = state.addresses.findIndex((addr) => addr.id === action.payload.id);
                if (index !== -1) {
                    state.addresses[index] = action.payload;
                }
                state.error = null;
                toast.success("Cập nhật địa chỉ thành công");
            })
            .addCase(updateAddress.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
                console.log("Update address failed:", action.payload); // Debug
                if (action.payload === "Address not found") {
                    toast.error("Địa chỉ không tồn tại. Vui lòng làm mới trang và thử lại.");
                } else if (action.payload === "You are not authorized to update this address") {
                    toast.error("Bạn không có quyền cập nhật địa chỉ này.");
                } else {
                    toast.error(action.payload || "Đã có lỗi xảy ra khi cập nhật địa chỉ");
                }
            })
            .addCase(deleteAddress.pending, (state) => {
                state.status = "loading";
            })
            .addCase(deleteAddress.fulfilled, (state, action) => {
                state.status = "succeeded";
                // Xóa địa chỉ khỏi state
                state.addresses = state.addresses.filter((addr) => addr.id !== action.meta.arg.id);
                state.error = null;
                toast.success("Xóa địa chỉ thành công");
            })
            .addCase(deleteAddress.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
                console.log("Delete address failed:", action.payload); // Debug
                toast.error(action.payload || "Đã có lỗi xảy ra khi xóa địa chỉ");
            });
    },
});

export const { resetAddressState } = addressSlice.actions;
export default addressSlice.reducer;