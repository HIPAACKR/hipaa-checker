import { useContext, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import * as countriesData from 'country-list';
import moment from 'moment-timezone';
import { toast } from 'react-toastify';

import clockIcon from '@/../public/images/icons/clock.svg';
import helpcircle from '@/../public/images/icons/helpcircle.svg';
import Button from '@/components/button';
import DropDown from '@/components/drop-down';
import PhoneInput from '@/components/profile/phone-input';
import TextInput from '@/components/textInput';
import subscriptionContext from '@/context/subscriptionContext';
import { get, patch, post } from '@/utils/api-service';
import API_ENDPOINTS from '@/utils/apiEndpoints';
import { formatPhoneNumberForAPI, parsePhoneNumberData } from '@/utils/helper';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';


const ProfileDetails = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    organization_name: '',
    street_address: '',
    city: '',
    state: '',
    postal_code: '1111', ////TODO: temporary hardcoded
    country_code: '',
    time_zone: '',
    phone: {
      countryCode: 'US',
      phoneCode: '+1',
      number: '',
      full: '',
      isValid: false,
    },
    country_id: '',
    update_done: false,
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const { userData, fetchData, showRoleOnHeader, setShowRoleOnHeader } = useContext(subscriptionContext);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (userData && !formData.update_done) {
      const address = userData?.addresses && userData.addresses.length > 0 ? userData.addresses[userData.addresses.length - 1] : null;

      // Parse phone number using utility function to determine country code
      // Defaults to US if no phone number available
      let phoneData = {
        countryCode: 'US',
        phoneCode: '+1',
        number: '',
        full: '',
        isValid: false,
      };

      if (userData?.phone_number) {
        // Use the utility function to parse and auto-detect country code
        phoneData = parsePhoneNumberData(userData.phone_number);
      }

      setFormData({
        ...formData,
        first_name: userData?.first_name || '',
        last_name: userData?.last_name || '',
        email: userData?.email || '',
        organization_name: userData?.organization?.name || '',

        street_address: address?.street_address || '',
        city: address?.city || '',
        state: address?.state || '',
        country_code: address?.country || '',
        time_zone: address?.time_zone || '',

        phone: phoneData,

        update_done: true
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  const {
    data: availableRoles,
    isLoading: isRolesLoading,
    isError: isRolesError,
  } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const response = await get(API_ENDPOINTS.ROLES, true);

      const data = await response?.data;
      const formattedData = data.map(role => ({
        id: role.id,
        name: role.name.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
        value: role.name
      }));
      // this one is removed from api but we have this role in our system
      formattedData.push({ id: 3, name: 'Super Admin', value: 'super_admin' });
      return formattedData;
    },
    staleTime: 5 * 60 * 1000,
  });

  const getUserRole = () => {
    if (userData && userData.roles && userData.roles.length > 0) {
      const rules = userData.roles.sort((a, b) => a.id - b.id);
      const ruleWithHighestId = rules[rules.length - 1];
      return {
        id: ruleWithHighestId.id,
        name: ruleWithHighestId.name.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
        value: ruleWithHighestId.name
      }
    }

    return { id: null }
  }

  const getTimezoneOptions = useMemo(() => {
    const timezones = moment.tz.names();
    // console.log('timezones raw: ', timezones);

    const seenDisplays = new Set();

    const formattedTimezones = timezones
      .map(tz => {
        const offset = moment.tz(tz).utcOffset();
        const formattedOffset = moment.tz(tz).format('Z');
        const abbreviation = moment.tz(tz).format('z');

        let fullName;
        try {
          const formatter = new Intl.DateTimeFormat('en', {
            timeZone: tz,
            timeZoneName: 'long'
          });
          const parts = formatter.formatToParts(new Date());
          fullName = parts.find(part => part.type === 'timeZoneName')?.value;
        } catch (e) {
          fullName = null;
        }

        // Skip entries without proper names or with generic GMT names
        if (!fullName ||
          fullName.startsWith('GMT') ||
          fullName === abbreviation ||
          fullName.match(/^[+-]\d/)) {
          return null;
        }

        const display = `${fullName} (${abbreviation}) UTC ${formattedOffset}`;

        // Skip if we've already seen this display string
        if (seenDisplays.has(display)) {
          return null;
        }

        seenDisplays.add(display);

        return {
          id: tz.toLowerCase(), // ex: 'america/new_york'
          name: display, // ex: 'Eastern Daylight Time (EDT) UTC -04:00'
          value: tz.toLowerCase(), // ex: 'america/new_york'
          offset: offset, // in minutes
        };
      })
      .filter(item => item !== null) // Remove null entries
      .sort((a, b) => a.offset - b.offset)

    return formattedTimezones;
  }, []);

  const getFormattedCountries = useMemo(() => {
    const countries = countriesData.getData();
    const formattedData = countries.map(country => ({
      id: country.code, // country.code is ISO 3166-1 alpha-2 code which is internationally recognized ex: 'US', 'GB'
      name: country.name.replace(/\s*\(the\)$/i, ''),
      value: country.code
    }));
    const sortedData = formattedData.sort((a, b) => a.name.localeCompare(b.name));
    // console.log('Sorted Countries: ', sortedData);
    return sortedData;
  }, []);

  const updateUserProfileMutation = useMutation({
    mutationFn: async (profileData) => {
      const response = await patch(
        API_ENDPOINTS.USER_UPDATE(userData?.id),
        profileData,
        true
      );
      return response?.data;
    },
    onSuccess: async (data) => {
      // Refresh context data to update all components including AdminHeaderHome
      await fetchData();

      // Update localStorage to sync with header component
      const localData = JSON.parse(localStorage.getItem('user') || '{}');
      if (data) {
        localStorage.setItem('user', JSON.stringify({
          ...localData,
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone_number: data.phone_number,
        }));
      }

      queryClient.invalidateQueries(['userData']);
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.errors?.[0] || 'Failed to update profile';
      toast.error(errorMessage);
    },
  });

  const updateAddressMutation = useMutation({
    mutationFn: async (addressData) => {
      const response = await post(
        API_ENDPOINTS.ADDRESSES,
        { address: addressData },
        true
      );
      return response?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userData']);
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.errors?.[0] || 'Failed to update address';
      toast.error(errorMessage);
    },
  });

  const handleSaveProfileDetails = async () => {
    const validationErrors = [];

    // Personal info validation
    if (!formData.first_name?.trim()) validationErrors.push('first name');
    if (!formData.last_name?.trim()) validationErrors.push('last name');
    if (!formData.phone || !formData.phone.isValid) validationErrors.push('phone number');

    // Address validation
    if (!formData.street_address?.trim()) validationErrors.push('street address');
    if (!formData.city?.trim()) validationErrors.push('city');
    if (!formData.state?.trim()) validationErrors.push('state');
    if (!formData.country_code) validationErrors.push('country');
    if (!formData.time_zone) validationErrors.push('timezone');

    if (validationErrors.length > 0) {
      toast.error('Please provide valid information for all required fields');
      return;
    }

    // Get current address (latest address from user data)
    const currentAddress = userData?.addresses && userData.addresses.length > 0
      ? userData.addresses[userData.addresses.length - 1]
      : null;

    // Check if personal info has changed (first_name, last_name, phone_number)
    const hasPersonalInfoChanged =
      formData.first_name !== userData?.first_name ||
      formData.last_name !== userData?.last_name ||
      formData.phone?.full !== userData?.phone_number;

    // Check if address info has changed (street_address, city, state, country, time_zone)
    const hasAddressChanged =
      formData.street_address !== currentAddress?.street_address ||
      formData.city !== currentAddress?.city ||
      formData.state !== currentAddress?.state ||
      formData.country_code !== currentAddress?.country ||
      formData.time_zone !== currentAddress?.time_zone;

    if (!hasPersonalInfoChanged && !hasAddressChanged) {
      setIsUpdatingProfile(false);
      return;
    }

    try {
      if (hasPersonalInfoChanged) {
        await updateUserProfileMutation.mutateAsync({
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone_number: formatPhoneNumberForAPI(formData.phone)
        });
      }

      if (hasAddressChanged) {
        const addressData = {
          street_address: formData.street_address,
          city: formData.city,
          state: formData.state,
          postal_code: formData.postal_code,
          country: formData.country_code,
          time_zone: formData.time_zone
        };

        await updateAddressMutation.mutateAsync(addressData);
      }

      toast.success('User information updated successfully');
      setIsUpdatingProfile(false);
      fetchData();
    } catch (error) {
      setIsUpdatingProfile(false);
      // one api call can be successfull and another can be failed
      fetchData();
    }
  };

  return (
    <>
      {formData.update_done && (
        <>
          <div className='profile-group'>
            <div>
              <div className='profile-group__content'>
                <div>
                  <div className='profile-group__title'>Personal Info</div>
                  <p className='profile-group__description'>Update your photo and personal details here.</p>
                </div>
                {!isUpdatingProfile && (
                  <div className='flex gap-2'>
                    {/* <Button
                  size='small'
                  className='bg-white boder-btn-now'
                  type='button'
                >
                  Cancel
                </Button> */}
                    <Button
                      size='small'
                      icon='delete'
                      className='bg-red-600 hover:bg-red-700 text-white'
                      onClick={() => setIsUpdatingProfile(true)}
                    >
                      Update Details
                    </Button>
                  </div>
                )}
              </div>

              {/* Personal Info */}
              <div className="input-wrapper">
                <div className='input-wrapper__row'>
                  <p className="input-wrapper__label">Name <span className="input-wrapper__require">*</span></p>
                  <div className='input-wrapper__field-group input-wrapper__field-group--split'>
                    {/* {console.log('first_name at render: ', formData?.first_name)} */}
                    <TextInput
                      value={formData?.first_name}
                      setValue={(val) => setFormData({ ...formData, first_name: val })}
                      customInputWrapperClass='custom-input-field'
                      isDisabled={!isUpdatingProfile}
                    />
                    <TextInput
                      value={formData?.last_name}
                      setValue={(val) => setFormData({ ...formData, last_name: val })}
                      customInputWrapperClass='custom-input-field'
                      isDisabled={!isUpdatingProfile}
                    />
                  </div>
                </div>
                <div className='input-wrapper__row'>
                  <p className="input-wrapper__label">Email Address <span className="input-wrapper__require">*</span></p>
                  <div className='input-wrapper__field-group'>
                    <TextInput
                      customInputWrapperClass='custom-input-field'
                      value={formData?.email}
                      setValue={(val) => setFormData({ ...formData, email: val })}
                      type="email"
                      isDisabled={true}
                    />
                  </div>
                </div>
              </div>
            </div>


            {userData && (
              <div>
                {/* <div className='flex flex-col gap-1'>
              <div>
                <span className='text-[1.2rem] font-bold text-neutral-800'>First Name:</span>
                <span className='ml-2'>{userData?.first_name}</span>
              </div>
              <div>
                <span className='text-[1.2rem] font-bold text-neutral-800'>Last Name:</span>
                <span className='ml-2'>{userData?.last_name}</span>
              </div>
              <div>
                <span className='text-[1.2rem] font-bold text-neutral-800'>Email:</span>
                <span className='ml-2'>{userData?.email}</span>
                <div className='mt-4'>
                  <Button                   
                  // type='danger'
                  size='small'
                  icon='delete'
                  className='bg-red-600 hover:bg-red-700 text-white'
                  onClick={() => setShowDeleteUserModal(true)}
                  >
                    Delete Account
                  </Button>
                </div>
              </div>

            </div> */}
                {/* </div> */}


              </div>
            )}
          </div>

          {/* Company Info */}
          <div className='profile-group'>
            <div>
              <div className='profile-group__content'>
                <div>
                  <div className='profile-group__title'>Company Info</div>
                  <p className='profile-group__description'>Update your role and company details here.</p>
                </div>
              </div>

              <div className="input-wrapper">
                <div className='input-wrapper__row'>
                  <p className="input-wrapper__label">Role</p>
                  <div className='input-wrapper__field-group'>
                    <DropDown
                      type={'object'}
                      value={getUserRole()?.id}
                      data={availableRoles}
                      isDisabled={true}
                    // setValue={(val) => {
                    //   // console.log('Risk Status: ', val)
                    //   setViewStatus(val);
                    //   setFilterTrigger((prev) => !prev);
                    // }}
                    />
                    {/* <TextInput
                  customInputWrapperClass='custom-input-field' /> */}
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="showRoleOnHeader"
                        checked={showRoleOnHeader}
                        onChange={(e) => setShowRoleOnHeader(e.target.checked)}
                        className="cursor-pointer"
                      />
                      <label htmlFor="showRoleOnHeader" className="text-[#667085] cursor-pointer">
                        Show my job title in my profile
                      </label>
                    </div>
                  </div>
                </div>
                <div className='input-wrapper__row'>
                  <p className="input-wrapper__label">Organization name</p>
                  <div className='input-wrapper__field-group'>
                    <TextInput
                      customInputWrapperClass='custom-input-field'
                      value={formData?.organization_name || ''}
                      isDisabled={true}
                    />
                  </div>
                </div>
                <div className='input-wrapper__row'>
                  <p className="input-wrapper__label">
                    Timezone
                    <span>
                      <Image
                        src={helpcircle}
                        width={12}
                        height={5}
                        alt="help"
                      />
                    </span>
                  </p>
                  <div className='input-wrapper__field-group timezone'>
                    <DropDown
                      type={'object'}
                      imgSrcAtLeft={clockIcon}
                      value={formData?.time_zone}
                      data={getTimezoneOptions}
                      isDisabled={!isUpdatingProfile}
                      setValue={(val) => setFormData({ ...formData, time_zone: val })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='profile-group'>
            <div>
              <div className='profile-group__content'>
                <div>
                  <div className='profile-group__title'>Contact Info</div>
                  <p className='profile-group__description'>Update your role and company details here.</p>
                </div>
              </div>

              <div className="input-wrapper">
                <div className='input-wrapper__row'>
                  <p className="input-wrapper__label">Street address <span className="input-wrapper__require">*</span></p>
                  <div className='input-wrapper__field-group'>
                    <TextInput
                      customInputWrapperClass='custom-input-field'
                      isDisabled={!isUpdatingProfile}
                      value={formData?.street_address}
                      setValue={(val) => setFormData({ ...formData, street_address: val })}
                    />
                  </div>
                </div>
                <div className='input-wrapper__row'>
                  <p className="input-wrapper__label">City <span className="input-wrapper__require">*</span></p>
                  <div className='input-wrapper__field-group'>
                    <TextInput
                      customInputWrapperClass='custom-input-field'
                      isDisabled={!isUpdatingProfile}
                      value={formData?.city}
                      setValue={(val) => setFormData({ ...formData, city: val })}
                    />
                  </div>
                </div>
                <div className='input-wrapper__row'>
                  <p className="input-wrapper__label">State / Province <span className="input-wrapper__require">*</span></p>
                  <div className='input-wrapper__field-group'>
                    <TextInput
                      customInputWrapperClass='custom-input-field'
                      isDisabled={!isUpdatingProfile}
                      value={formData?.state}
                      setValue={(val) => setFormData({ ...formData, state: val })}
                    />
                  </div>
                </div>
                <div className='input-wrapper__row'>
                  <p className="input-wrapper__label">Country <span className="input-wrapper__require">*</span></p>
                  <div className='input-wrapper__field-group country'>
                    <DropDown
                      type="string"
                      value={formData?.country_code}
                      data={getFormattedCountries}
                      setValue={(val) => setFormData({ ...formData, country_code: val })}
                      placeholder="Select Country"
                      isDisabled={!isUpdatingProfile}
                    />
                  </div>
                </div>
                <div className='input-wrapper__row'>
                  <p className="input-wrapper__label">Contact Number <span className="input-wrapper__require">*</span></p>
                  <div className='input-wrapper__field-group'>
                    <PhoneInput
                      value={formData?.phone}
                      setValue={(val) => setFormData({ ...formData, phone: val })}
                      isDisabled={!isUpdatingProfile}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {isUpdatingProfile && (
            <div className='flex gap-2 border-t border-neutral-200 mt-5 pt-5 justify-end'>
              <Button
                size='small'
                className='bg-white boder-btn-now'
                type='button'
                onClick={() => setIsUpdatingProfile(false)}
              >
                Cancel
              </Button>
              <Button
                size='small'
                icon='delete'
                className='bg-red-600 hover:bg-red-700 text-white'
                onClick={handleSaveProfileDetails}
                isDisabled={updateAddressMutation.isPending || updateUserProfileMutation.isPending}
              >
                {(updateAddressMutation.isPending || updateUserProfileMutation.isPending) ? 'Saving...' : 'Update Details'}
              </Button>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ProfileDetails;