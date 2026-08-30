'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { get, put } from '@/utils/api-service';

export default function EditUser({ params }) {
  const router = useRouter();
  const { id } = params;
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    passwordConfirmation: '',
    roleId: '', 
  });
  const [userData, setUserData] = useState({
    createdAt: '',
    confirmed: false,
    uploadedTodayCount: 0,
    uploadedTotalCount: 0,
    roles: []
  });
  

  const formatDate = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);

    // Format as "MMM DD, YYYY • HH:MM AM/PM"
    const options = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    };

    return new Intl.DateTimeFormat('en-US', options)
      .format(date)
      .replace(',', '')
      .replace(', ', ' • ');
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await get(`members/${id}`, true);
        const data = response?.data;
        

        // console.log('Fetch User API Response:', data);

        const displayRoles = data.member.roles
        .filter(role => role.name !== 'super_admin')
        .filter((role, index, self) => 
          index === self.findIndex(r => r.name === role.name)
        );
        setUserData({
          createdAt: data.member.created_at || '',
          confirmed: data.member.confirmed || false,
          uploadedTodayCount: data.member.uploaded_today_count || 0,
          uploadedTotalCount: data.member.uploaded_total_count || 0,
          roles: displayRoles || []
        });

        setFormData({
          email: data.member.email || '',
          firstName: data.member.first_name || '',
          lastName: data.member.last_name || '',
          password: '',
          passwordConfirmation: '',
          roleId: data.member.roles && data.member.roles.length > 0 ? data.member.roles[0].id : '',
        });

        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchUserData();
    }
  }, [id]);

  

  const fetchRoles = async () => {
    try {
      const response = await get('roles', true);
      const data = response?.data;
      // console.log('Fetch Roles API Response:', data);
      
      const filteredRoles = data.filter(role => role.name !== 'super_admin');
      setAvailableRoles(filteredRoles);
    } catch (err) {
      // console.error('Error fetching roles:', err);
    }
  };
  useEffect(() => {
    if (isEditMode) {
      fetchRoles();
    }
  }, [isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const payload = {
        member: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          role_ids: [parseInt(formData.roleId)], // Use roleId and convert to integer
        },
      };
  
      // Add password only if provided
      if (formData.password) {
        payload.member.password = formData.password;
        payload.member.password_confirmation = formData.passwordConfirmation;
      }

      await put(
        `members/${id}`,
        payload,
        true,
        false,
        1,
      );
  
      // Navigate back to the user account/organization page
      setIsEditMode(false);
      window.location.reload();
    } catch (error) {
      alert('Failed to update user information. Please try again.');
    }
  };

  if (isLoading) {
    return <div>Loading user data...</div>;
  }

  const formatRoleName = (name) => {
    if (!name) return '';
    return name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className='container mx-auto mt-10'>
      <h1 className='text-2xl font-bold mb-5'>User Details</h1>
      <form
        onSubmit={handleSubmit}
        className='bg-white p-6 shadow rounded'
      >
        {/* <div className='mb-4'>
          <label className='block text-sm font-medium'>Email Address</label>
          <input
            type='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            className='w-full p-2 border rounded mt-1'
            required
          />
        </div> */}

        <div className='mb-4'>
          <label className='block text-sm font-medium'>Email Address</label>
          <div className='w-full p-2 border rounded mt-1 bg-gray-50'>
            {formData.email}
          </div>
        </div>

         <div className='mb-4'>
          <label className='block text-sm font-medium'>First Name</label>
          {isEditMode ? (
            <input
              type='text'
              name='firstName'
              value={formData.firstName}
              onChange={handleChange}
              className='w-full p-2 border rounded mt-1'
              required
            />
          ) : (
            <div className='w-full p-2 border rounded mt-1 bg-gray-50'>
              {formData.firstName}
            </div>
          )}
        </div>


        {/* <div className='mb-4'>
          <label className='block text-sm font-medium'>Last Name</label>
          <div className='w-full p-2 border rounded mt-1 bg-gray-50'>
            {formData.lastName}
          </div>
        </div>
         */}
        <div className='mb-4'>
          <label className='block text-sm font-medium'>Last Name</label>
          {isEditMode ? (
            <input
              type='text'
              name='lastName'
              value={formData.lastName}
              onChange={handleChange}
              className='w-full p-2 border rounded mt-1'
              required
            />
          ) : (
            <div className='w-full p-2 border rounded mt-1 bg-gray-50'>
              {formData.lastName}
            </div>
          )}
        </div>

        <div className='mb-4'>
          <label className='block text-sm font-medium'>Roles</label>
          {isEditMode ? (
            <div className='w-full mt-1'>
              <select 
                name='roleId' 
                value={formData.roleId} 
                onChange={handleChange} 
                className='w-full p-2 border rounded'
              >
                {availableRoles.map(role => (
                  <option key={role.id} value={role.id}>
                    {formatRoleName(role.name)}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className='w-full p-2 border rounded mt-1 bg-gray-50'>
              {userData.roles.length > 0 ? userData.roles.map(role => formatRoleName(role.name)).join(', ') : 'No roles assigned'}
            </div>
          )}
        </div>
        <div className='mb-4'>
            <label className='block text-sm font-medium'>Created At</label>
            <div className='w-full p-2 border rounded mt-1 bg-gray-50'>
              {formatDate(userData.createdAt)}
            </div>
          </div>

          <div className='mb-4'>
            <label className='block text-sm font-medium'>Confirmed</label>
            <div className='w-full p-2 border rounded mt-1 bg-gray-50'>
              {userData.confirmed ? 'Yes' : 'No'}
            </div>
          </div>
          
          <div className='mb-4'>
            <label className='block text-sm font-medium'>Uploaded Today Count</label>
            <div className='w-full p-2 border rounded mt-1 bg-gray-50'>
              {userData.uploadedTodayCount}
            </div>
          </div>
          
          <div className='mb-4'>
            <label className='block text-sm font-medium'>Uploaded Total Count</label>
            <div className='w-full p-2 border rounded mt-1 bg-gray-50'>
              {userData.uploadedTotalCount}
            </div>
          </div>


          <div className='flex justify-end space-x-2'>
            {isEditMode ? (
              <>
                <button
                  type='button'
                  onClick={() => setIsEditMode(false)}
                  className='bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600'
                >
                  Save Changes
                </button>
              </>
            ) : (
              <button
                type='button'
                onClick={() => setIsEditMode(true)}
                className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
              >
                Edit User
              </button>
            )}
          </div>
      </form>
    </div>
  );
}
