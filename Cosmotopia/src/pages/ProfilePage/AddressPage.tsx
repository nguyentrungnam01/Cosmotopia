import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { useGetProfile, useUpdateAddress } from '@/queries/auth.query';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from '@/components/ui/use-toast';
import mapPlaceholder from '@/assets/map_placeholder.png';

export default function AddressPage() {
  const { data: infoUser, isPending, refetch } = useGetProfile();
  const {
    mutateAsync: updateAddress,
    isSuccess: isAddressUpdated,
    isError: isAddressUpdateFailed
  } = useUpdateAddress();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: 'TP.HCM',
    district: 'Q9',
    ward: 'TP.Thủ Đức',
    specificAddress: 'vinhomes grand park, nguyễn xiển,Q9'
  });

  useEffect(() => {
    if (infoUser) {
      setFormData((prev) => ({
        ...prev,
        name: `${infoUser.firstName || ''} ${infoUser.lastName || ''}`.trim(),
        phone: infoUser.phone || '',
      }));
    }
    if (isAddressUpdated) {
      toast({ variant: 'success', title: 'Cập nhật địa chỉ thành công!' });
      refetch();
    }
    if (isAddressUpdateFailed) {
      toast({ variant: 'destructive', title: 'Cập nhật địa chỉ thất bại!' });
    }
  }, [infoUser, isAddressUpdated, isAddressUpdateFailed, refetch]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    const dataToSave = {
      addressLine1: formData.specificAddress,
      city: formData.city,
      state: formData.district, // Assuming district maps to state or province
      zipCode: '', // No zip code in current form, leaving empty
      country: 'Vietnam', // Assuming Vietnam as default country
      fullName: formData.name,
      phoneNumber: formData.phone,
      ward: formData.ward,
    };
    await updateAddress(dataToSave);
  };

  if (isPending) return <p>Loading...</p>;

  return (
    <div className="p-5">
      <div className="border-b border-gray-200/50 pb-4">
        <h1 className="font-montserrat text-xl font-bold text-[#4E4663]">
          Địa chỉ
        </h1>
      </div>

      <div className="mt-8 space-y-6">
        <div className="border-b border-gray-200/50 pb-4">
          <h2 className="font-montserrat text-lg font-bold text-[#4E4663]">
            Cập nhật địa chỉ
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Thông tin này sẽ xuất hiện trên đơn hàng của bạn
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Tên"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="rounded-md border px-4 py-2"
          />
          <input
            type="text"
            placeholder="Số điện thoại"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="rounded-md border px-4 py-2"
          />
        </div>

        {/* Dropdowns for City, District, Ward */}
        <div className="grid grid-cols-3 gap-4">
          <Select
            value={formData.city}
            onValueChange={(value) => handleChange('city', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Tỉnh/Thành phố" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TP.HCM">TP.HCM</SelectItem>
              <SelectItem value="Hà Nội">Hà Nội</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={formData.district}
            onValueChange={(value) => handleChange('district', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Huyện/Quận" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Q9">Quận 9</SelectItem>
              <SelectItem value="Q1">Quận 1</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={formData.ward}
            onValueChange={(value) => handleChange('ward', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Phường/Xã" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TP.Thủ Đức">TP.Thủ Đức</SelectItem>
              <SelectItem value="Bến Nghé">Bến Nghé</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <input
          type="text"
          placeholder="Địa chỉ cụ thể"
          value={formData.specificAddress}
          onChange={(e) => handleChange('specificAddress', e.target.value)}
          className="w-full rounded-md border px-4 py-2"
        />

        <div
          className="h-64 w-full rounded-md bg-gray-200 flex items-center justify-center bg-cover bg-center cursor-pointer"
          style={{ backgroundImage: `url(${mapPlaceholder})` }}
          onClick={() => toast({ title: 'Google Map hiện không phản hồi', variant: 'destructive' })}
        >
          <span className="text-gray-500 text-lg bg-white px-4 py-2 rounded-md">+ Add location</span>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            className="rounded-full bg-gradient-to-r from-[#9C3CFD] to-[#BF38FF] px-8 py-3 font-bold text-white shadow-lg"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
} 