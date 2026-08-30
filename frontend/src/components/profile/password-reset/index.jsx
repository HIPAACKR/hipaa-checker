import { useState } from 'react';
import { toast } from 'react-toastify';

import Button from '@/components/button';
import TextInput from '@/components/textInput';
import { patch } from '@/utils/api-service';
import API_ENDPOINTS from '@/utils/apiEndpoints';
import { useMutation } from '@tanstack/react-query';

const PasswordReset = () => {
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    password_confirmation: '',
  });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const updatePasswordMutation = useMutation({
    mutationFn: async (data) => {
      const response = await patch(
        API_ENDPOINTS.UPDATE_PASSWORD,
        data,
        true
      );

      return response?.data;
    },
    onSuccess: () => {
      toast.success('Password updated successfully');
      setPasswordData({
        old_password: '',
        new_password: '',
        password_confirmation: '',
      });
      setIsUpdatingPassword(false);
      setErrors({});
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.errors?.[0] || 'Failed to update password';
      toast.error(errorMessage);
    },
  });

  const validatePassword = () => {
    const newErrors = {};

    if (!passwordData.old_password) {
      newErrors.old_password = 'Current password is required';
    }

    if (!passwordData.new_password) {
      newErrors.new_password = 'New password is required';
    } else if (passwordData.new_password.length < 8) {
      newErrors.new_password = 'Password must be at least 8 characters';
    }

    if (!passwordData.password_confirmation) {
      newErrors.password_confirmation = 'Password confirmation is required';
    } else if (passwordData.new_password !== passwordData.password_confirmation) {
      newErrors.password_confirmation = 'Passwords do not match';
    }

    if (passwordData.old_password && passwordData.new_password &&
        passwordData.old_password === passwordData.new_password) {
      newErrors.new_password = 'New password must be different from current password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdatePassword = () => {
    if (!validatePassword()) {
      return;
    }

    updatePasswordMutation.mutate({
      old_password: passwordData.old_password,
      new_password: passwordData.new_password,
      password_confirmation: passwordData.password_confirmation,
    });
  };

  const handleCancel = () => {
    setPasswordData({
      old_password: '',
      new_password: '',
      password_confirmation: '',
    });
    setErrors({});
    setIsUpdatingPassword(false);
  };

  return (
    <div className='profile-group'>
      <div>
        <div className='profile-group__content'>
          <div>
            <div className='profile-group__title'>Password</div>
            <p className='profile-group__description'>
              Please enter your current password to change your password.
            </p>
          </div>
          {!isUpdatingPassword && (
            <div className='flex gap-2'>
              <Button
                size='small'
                icon='delete'
                className='bg-red-600 hover:bg-red-700 text-white'
                onClick={() => setIsUpdatingPassword(true)}
              >
                Change Password
              </Button>
            </div>
          )}
        </div>

        <div className='input-wrapper'>
          <div className='input-wrapper__row'>
            <p className='input-wrapper__label'>
              Current password <span className='input-wrapper__require'>*</span>
            </p>
            <div className='input-wrapper__field-group'>
              <TextInput
                customInputWrapperClass='custom-input-field'
                type='password'
                value={passwordData.old_password}
                setValue={(val) => {
                  setPasswordData({ ...passwordData, old_password: val });
                  setErrors({ ...errors, old_password: '' });
                }}
                isDisabled={!isUpdatingPassword}
              />
              {errors.old_password && (
                <p className='text-red-500 text-sm mt-1'>{errors.old_password}</p>
              )}
            </div>
          </div>

          <div className='input-wrapper__row'>
            <p className='input-wrapper__label'>
              New password <span className='input-wrapper__require'>*</span>
            </p>
            <div className='input-wrapper__field-group'>
              <TextInput
                customInputWrapperClass='custom-input-field'
                type='password'
                value={passwordData.new_password}
                setValue={(val) => {
                  setPasswordData({ ...passwordData, new_password: val });
                  setErrors({ ...errors, new_password: '' });
                }}
                isDisabled={!isUpdatingPassword}
              />
              <p className='text-[#667085]'>
                Your new password must be more than 8 characters.
              </p>
              {errors.new_password && (
                <p className='text-red-500 text-sm mt-1'>{errors.new_password}</p>
              )}
            </div>
          </div>

          <div className='input-wrapper__row'>
            <p className='input-wrapper__label'>
              Confirm new password <span className='input-wrapper__require'>*</span>
            </p>
            <div className='input-wrapper__field-group'>
              <TextInput
                customInputWrapperClass='custom-input-field'
                type='password'
                value={passwordData.password_confirmation}
                setValue={(val) => {
                  setPasswordData({ ...passwordData, password_confirmation: val });
                  setErrors({ ...errors, password_confirmation: '' });
                }}
                isDisabled={!isUpdatingPassword}
              />
              {errors.password_confirmation && (
                <p className='text-red-500 text-sm mt-1'>{errors.password_confirmation}</p>
              )}
            </div>
          </div>
        </div>

        {isUpdatingPassword && (
          <div className='flex gap-2 border-t border-neutral-200 mt-5 pt-5 justify-end'>
            <Button
              size='small'
              className='bg-white boder-btn-now'
              type='button'
              onClick={handleCancel}
              isDisabled={updatePasswordMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              size='small'
              icon='delete'
              className='bg-red-600 hover:bg-red-700 text-white'
              onClick={handleUpdatePassword}
              isDisabled={updatePasswordMutation.isPending}
            >
              {updatePasswordMutation.isPending ? 'Updating...' : 'Update Password'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordReset;

