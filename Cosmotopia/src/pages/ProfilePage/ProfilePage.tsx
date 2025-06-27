import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { useGetProfile, useEditProfile } from '@/queries/auth.query';
import { toast } from '@/components/ui/use-toast';

export default function ProfilePage() {
  const { data: infoUser, isPending, refetch, isError } = useGetProfile();
  console.log(infoUser);
  const {
    mutateAsync: editProfile,
    isSuccess: isEdited,
    isError: isEditFailed
  } = useEditProfile();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: ''
  });

  const [isEditing, setIsEditing] = useState({
    firstName: false,
    lastName: false,
    phone: false
  });

  useEffect(() => {
    if (infoUser) {
      setFormData({
        firstName: infoUser.firstName,
        lastName: infoUser.lastName,
        email: infoUser.email,
        phone: infoUser.phone,
        gender: infoUser.gender === 1 ? 'male' : 'female'
      });
    }
  }, [infoUser]);

  useEffect(() => {
    if (isEdited) {
      toast({ variant: 'success', title: 'Cập nhật thành công!' });
      refetch();
    }
    if (isEditFailed) {
      toast({ variant: 'destructive', title: 'Cập nhật thất bại!' });
    }
  }, [isEdited, isEditFailed, refetch]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEditClick = (field) => {
    setIsEditing((prev) => ({
      ...prev,
      [field]: true
    }));
  };

  const handleSave = async () => {
    const updatedData = {
      ...formData,
      gender: formData.gender === 'male' ? 1 : 2
    };
    await editProfile(updatedData);
    setIsEditing({ firstName: false, lastName: false, phone: false });
  };

  if (isPending) return <p>Loading...</p>;
  if (isError) return <p>Lỗi tải thông tin</p>;

  return (
    <div className="p-5">
      <div className="border-b border-gray-200/50 pb-4">
        <h1 className="font-montserrat text-xl font-bold text-[#4E4663]">
          Thông tin của tôi
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Quản lý thông tin hồ sơ bảo mật tài khoản
        </p>
      </div>

      <div className="mt-8 space-y-6">
        {/* Họ  */}
        <div className="grid grid-cols-[116px_1fr_auto] items-center gap-4">
          <Label className="text-sm text-[#4E4663]">Họ </Label>
          {isEditing.firstName ? (
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              className="rounded-md border px-2 py-1 text-sm"
            />
          ) : (
            <span className="text-sm text-[#4E4663]">{formData.firstName}</span>
          )}
          <button
            onClick={() => handleEditClick('firstName')}
            className="text-blue-500 text-sm hover:text-[#9C3CFD]"
          >
            Thay đổi
          </button>
        </div>
        {/* Tên */}
        <div className="grid grid-cols-[116px_1fr_auto] items-center gap-4">
          <Label className="text-sm text-[#4E4663]">Tên</Label>
          {isEditing.lastName ? (
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              className="rounded-md border px-2 py-1 text-sm"
            />
          ) : (
            <span className="text-sm text-[#4E4663]">{formData.lastName}</span>
          )}
          <button
            onClick={() => handleEditClick('lastName')}
            className="text-blue-500 text-sm hover:text-[#9C3CFD]"
          >
            Thay đổi
          </button>
        </div>
        {/* Email */}
        <div className="grid grid-cols-[116px_1fr] items-center gap-4">
          <Label className="text-sm text-[#4E4663]">Email</Label>
          <span className="text-sm text-[#4E4663]">{formData.email}</span>
        </div>

        {/* Số điện thoại */}
        <div className="grid grid-cols-[116px_1fr_auto] items-center gap-4">
          <Label className="text-sm text-[#4E4663]">Số điện thoại</Label>
          {isEditing.phone ? (
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="rounded-md border px-2 py-1 text-sm"
            />
          ) : (
            <span className="text-sm text-[#4E4663]">{formData.phone}</span>
          )}
          <button
            onClick={() => handleEditClick('phone')}
            className="text-blue-500 text-sm hover:text-[#9C3CFD]"
          >
            Thay đổi
          </button>
        </div>
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
  );
}
