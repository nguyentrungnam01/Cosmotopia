import { useState, useEffect } from 'react';
import { useGetProfile, useUpdateAddress } from '@/queries/auth.query';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import mapPlaceholder from '@/assets/map_placeholder.png';

export default function AddressPage() {
  const { data: infoUser, isPending, refetch, isError } = useGetProfile();
  // console.log(infoUser.address);
  const {
    mutateAsync: updateAddress,
    isSuccess: isAddressUpdated,
    isError: isAddressUpdateFailed,
    isLoading: isUpdating
  } = useUpdateAddress();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    district: '',
    ward: '',
    specificAddress: ''
  });

  useEffect(() => {
    if (!infoUser) return;

    setFormData({
      name: `${infoUser.firstName || ''} ${infoUser.lastName || ''}`.trim(),
      phone: infoUser.phone || '',
      city: infoUser.city ?? '',
      district: infoUser.state ?? '',
      ward: infoUser.ward ?? '',
      specificAddress: infoUser.address ?? ''
    });
  }, [infoUser]);

  useEffect(() => {
    if (isAddressUpdated) {
      toast({ variant: 'success', title: 'Cập nhật địa chỉ thành công!' });
      refetch();
    }
    if (isAddressUpdateFailed) {
      toast({ variant: 'destructive', title: 'Cập nhật địa chỉ thất bại!' });
    }
  }, [isAddressUpdated, isAddressUpdateFailed, refetch]);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const payload = {
      address: formData.specificAddress,
    };

    try {
      await updateAddress(payload);
    } catch (err) {
      console.error('Update address error:', err);
    }
  };

  if (isPending) return <p>Loading...</p>;
  if (isError) return <p>Lỗi tải thông tin</p>;

  return (
    <div className="p-5">
      {/* Header */}
      {/* <div className="border-b border-gray-200/50 pb-4">
        <h1 className="font-montserrat text-xl font-bold text-[#4E4663]">
          Địa chỉ
        </h1>
      </div> */}

      <div className="mt-8 space-y-6">
        {/* Section Title */}
        <div className="border-b border-gray-200/50 pb-4">
          <h1 className="font-montserrat text-lg font-bold text-[#4E4663]">
            Cập nhật địa chỉ
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Thông tin này sẽ xuất hiện trên đơn hàng của bạn
          </p>
        </div>

        {/* Name & Phone */}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Tên đầy đủ"
            value={formData.name}
            onChange={e => handleChange('name', e.target.value)}
            className="rounded-md border px-4 py-2"
          />
          <input
            type="text"
            placeholder="Số điện thoại"
            value={formData.phone}
            onChange={e => handleChange('phone', e.target.value)}
            className="rounded-md border px-4 py-2"
          />
        </div>

        {/* City / District / Ward */}
        <div className="grid grid-cols-3 gap-4">
          <Select
            value={formData.city}
            onValueChange={value => handleChange('city', value)}
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
            onValueChange={value => handleChange('district', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Quận/Huyện" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Q1">Quận 1</SelectItem>
              <SelectItem value="Q9">Quận 9</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={formData.ward}
            onValueChange={value => handleChange('ward', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Phường/Xã" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Bến Nghé">Bến Nghé</SelectItem>
              <SelectItem value="TP.Thủ Đức">Thủ Đức</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Specific Address */}
        <input
          type="text"
          placeholder="Địa chỉ cụ thể"
          value={formData.specificAddress}
          onChange={e => handleChange('specificAddress', e.target.value)}
          className="w-full rounded-md border px-4 py-2"
        />

        {/* Map Placeholder */}
        <div
          className="h-64 w-full rounded-md bg-gray-200 flex items-center justify-center bg-cover bg-center cursor-pointer"
          style={{ backgroundImage: `url(${mapPlaceholder})` }}
          onClick={() =>
            toast({
              variant: 'destructive',
              title: 'Google Map hiện không phản hồi'
            })
          }
        >
          <span className="text-gray-500 text-lg bg-white px-4 py-2 rounded-md">
            + Add location
          </span>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            disabled={isUpdating}
            className={`
              rounded-full px-8 py-3 font-bold text-white shadow-lg
              bg-gradient-to-r from-[#9C3CFD] to-[#BF38FF]
              ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {isUpdating ? 'Đang lưu...' : 'Lưu'}
          </button>
        </div>
      </div>
    </div>
  );
}
