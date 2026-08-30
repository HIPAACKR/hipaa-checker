

'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Select from 'react-select';
import { toast } from 'react-toastify';

import Button from '@/components/button';
import Heading from '@/components/heading';
import Text from '@/components/text';
import { get, post, remove } from '@/utils/api-service';
import useLocalStorage from '@/utils/useLocalData';

import './index.scss';

const MemberManagement = () => {
  const router = useRouter();
  const [localData] = useLocalStorage('user');
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isInviteRemovalModalOpen, setInviteRemovalModalOpen] = useState(false);
  const [isAddMemberModalOpen, setAddMemberModalOpen] = useState(false);
  const [isResendInviteModalOpen, setResendInviteModalOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [removeInviteItem, setRemoveInviteItem] = useState(null);
  const [resendInviteItem, setResendInviteItem] = useState(null);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');
  const [availableRoles, setAvailableRoles] = useState([]);
  const [isRolesLoading, setIsRolesLoading] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [maxMemberCount, setMaxMemberCount] = useState(10);
  const [activeTab, setActiveTab] = useState('confirmed'); 

  const fetchRoles = async () => {
    setIsRolesLoading(true);
    try {
      const response = await get('roles', true);
      const data = await response?.data;

      const roleOptions = data.map((role) => ({
        value: role.id, 
        label: role.name.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      }));

      setAvailableRoles(roleOptions);
    } catch (error) {
      setAvailableRoles([
        { value: 'client', label: '1' },
        { value: 'client-manager', label: '2' },
      ]);
    } finally {
      setIsRolesLoading(false);
    }
  };

  const fetchUserPlanData = async () => {
    try {
      const response = await get('user', true);
      const data = response?.data;
      if (data.user?.plan?.max_member_count) {
        setMaxMemberCount(data.user.plan.max_member_count);
      }
    } catch (error) {
      // console.error('Error fetching user plan data:', error);
      // toast.error('Error fetching user plan data:', error);
      // Keep the default value of 10 if there's an error
    }
  };

  const handleRoleChange = (selectedOptions) => {
    setSelectedRoles(selectedOptions || null);
  };

  const handleDeleteClick = (item) => {
    setDeleteItem(item);
    setModalOpen(true);
  };

  const handleDeleteFile = async (id) => {
    setModalOpen(false);

    try {
      await remove(
        `members/${id}`,
        true,
        1,
      );

      const updatedMembers = members.filter((member) => member.id !== id);
      setMembers(updatedMembers);

      toast.success('User deleted successfully.');
    }catch (error) {
      toast.error('An error occurred while deleting the user. Please try again.', {
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleEditClick = (id) => {
    router.push(`/user-account/organization/detail-user/${id}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);

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
  const handleRemoveInviteClick = (item) => {
    setRemoveInviteItem(item);
    setInviteRemovalModalOpen(true);
  };
  const handleRemoveInvite = async (id) => {
    setInviteRemovalModalOpen(false);

    try {
      await remove(
        `members/${id}`,
        true,
        1,
      );

      const updatedMembers = members.filter((member) => member.id !== id);
      setMembers(updatedMembers);

      toast.success('Invitation removed successfully');
    } catch (error) {
      toast.error('An error occurred while removing the invitation. Please try again.');
    }
  };

  const handleAddMemberClick = () => {
    if (members.length >= maxMemberCount) {
      toast.error(`Member capacity (${maxMemberCount}) has been reached. You cannot add more members.`);
      return;
    }
    setAddMemberModalOpen(true);
  };
  const handleAddMember = async () => {
    if (!newMemberEmail) {
      toast.error('Please enter an email address.');
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(newMemberEmail)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    const roleIds = selectedRoles ? [selectedRoles.value] : [];

    const payload = {
      email: newMemberEmail,
      roles: roleIds,
    };

    try {
      await post('members/invite', payload, true);

      toast.success(`Invitation sent successfully to ${newMemberEmail}`);

      fetchMembers();

      setAddMemberModalOpen(false);
      setNewMemberEmail('');
      setNewMemberRole('');
      setSelectedRoles([]);
    } catch (error) {
      toast.error('An error occurred while sending the invitation. Please try again.');
    }
  };
  const handleResendInviteClick = (item) => {
    setResendInviteItem(item);
    handleResendInvite(item.id);
  };

  const handleResendInvite = async (id) => {
    try {
      await post(
        `members/${id}/resend_invitation`,
        {},
        true,
        false,
        1,
      );

      setResendInviteModalOpen(true);
    } catch (error) {
      toast.error('An error occurred while resending the invitation. Please try again.');
    }
  };

  const handleResendInviteClose = () => {
    setResendInviteModalOpen(false);
    setResendInviteItem(null);
  };

  const fetchMembers = async () => {
    try {
      const response = await get('members', true);
      const data = response?.data;
      // console.log('Response:', data)
      setMembers(data.members || []);
    } catch (error) {
      // console.error('Error fetching members:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const getSerialNumber = (index, tab) => {
    return index + 1; 
  };

  useEffect(() => {
    fetchMembers();
    fetchRoles();
    fetchUserPlanData();
  }, []);

  const confirmedMembers = members.filter((member) => member.is_confirmed)
    .sort((a, b) => b.is_admin - a.is_admin);

  const pendingInvitees = members.filter((member) => !member.is_confirmed);

  return (
    <div>
      {/* Resend Invite Modal */}
      {isResendInviteModalOpen && (
        <div className='report-list__modal'>
          <div className='report-list__modal__content'>
            <div className='report-list__modal__titleWrapper'>
              <Heading
                title={'Invitation resent successfully!'}
                type='h6'
              />
              <Image
                onClick={handleResendInviteClose}
                className='report-list__modal__cross'
                src={'/images/icons/cross.svg'}
                alt='cross-icon'
                width={24}
                height={24}
              />
            </div>
            <div className='report-list__modal__body'>
              <Text
                size='fs-16'
                color='neutral-500'
                align='center'
              >
                The invitation for <b>{resendInviteItem?.email}</b> has been resent successfully.
              </Text>
            </div>
            <div className='report-list__modal__buttonWrapper'>
              <Button
                isFullWidth
                type='secondary'
                onClick={handleResendInviteClose}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {isAddMemberModalOpen && (
        <div className='report-list__modal'>
          <div className='report-list__modal__content'>
            <div className='report-list__modal__titleWrapper'>
              <Heading
                title={'Add New Member'}
                type='h6'
              />
              <Image
                onClick={() => setAddMemberModalOpen(false)}
                className='report-list__modal__cross'
                src={'/images/icons/cross.svg'}
                alt='cross-icon'
                width={24}
                height={24}
              />
            </div>
            <div className='report-list__modal__body'>
            <div className='input-field'>
                <label htmlFor='email'>Email:</label>
                <input
                  id='email'
                  type='email'
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  placeholder='Enter member email'
                  className='email-input'
                />
              </div>
              <div className='input-field'>
                <label htmlFor='role'>Role:</label>
                <Select
                  id='role'
                  options={availableRoles}
                  value={selectedRoles}
                  onChange={handleRoleChange}
                  placeholder='Select role'
                  className='select-dropdown'
                  classNamePrefix='select'
                />
              </div>
            </div>
            <div className='report-list__modal__buttonWrapper'>
              <Button
                isFullWidth
                type='secondary'
                onClick={() => setAddMemberModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                isFullWidth
                onClick={handleAddMember}
                isDisabled={isRolesLoading}
              >
                Add Member
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isModalOpen && (
        <div className='report-list__modal'>
          <div className='report-list__modal__content'>
            <div className='report-list__modal__titleWrapper'>
              <Heading
                title={'Delete user?'}
                type='h6'
              />
              <Image
                onClick={() => setModalOpen(false)}
                className='report-list__modal__cross'
                src={'/images/icons/cross.svg'}
                alt='cross-icon'
                width={24}
                height={24}
              />
            </div>
            <div className='report-list__modal__body'>
              <Text
                size='fs-16'
                color='neutral-500'
                align='center'
              >
                This will delete permanently <b>{deleteItem?.email}</b>. This action cannot be
                undone.
              </Text>
            </div>
            <div className='report-list__modal__buttonWrapper'>
              <Button
                isFullWidth
                type='secondary'
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                isFullWidth
                onClick={() => handleDeleteFile(deleteItem?.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Removal Modal */}
      {isInviteRemovalModalOpen && (
        <div className='report-list__modal'>
          <div className='report-list__modal__content'>
            <div className='report-list__modal__titleWrapper'>
              <Heading
                title={'Remove invite?'}
                type='h6'
              />
              <Image
                onClick={() => setInviteRemovalModalOpen(false)}
                className='report-list__modal__cross'
                src={'/images/icons/cross.svg'}
                alt='cross-icon'
                width={24}
                height={24}
              />
            </div>
            <div className='report-list__modal__body'>
              <Text
                size='fs-16'
                color='neutral-500'
                align='center'
              >
                Are you sure you want to remove the invite for <b>{removeInviteItem?.email}</b>?
              </Text>
            </div>
            <div className='report-list__modal__buttonWrapper'>
              <Button
                isFullWidth
                type='secondary'
                onClick={() => setInviteRemovalModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                isFullWidth
                onClick={() => handleRemoveInvite(removeInviteItem?.id)}
              >
                Remove Invite
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className='report-list'>
        <div className='report-list__body'>
          <h2 className='subtitle'>Organization Members</h2>
          
          {/* Tab navigation */}
          <div className='tabs-container'>
            <div className='tabs-header'>
              <button 
                className={`tab-button ${activeTab === 'confirmed' ? 'active' : ''}`}
                onClick={() => setActiveTab('confirmed')}
              >
                Confirmed Members ({confirmedMembers.length})
              </button>
              <button 
                className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`}
                onClick={() => setActiveTab('pending')}
              >
                Pending Invites ({pendingInvitees.length})
              </button>
            </div>
            
            <div className='add-member-wrapper'>
              <Button
                onClick={handleAddMemberClick}
                className='add-member-button'
                isDisabled={members.length >= maxMemberCount}
                type='primary'
              >
                Add Members ({members.length}/{maxMemberCount})
              </Button>
            </div>
            
            {/* Confirmed Members Tab */}
            {activeTab === 'confirmed' && (
              <div className='report-list__tableWrapper'>
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Email</th>
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Created At</th>
                      <th>Role</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {confirmedMembers.map((member, index) => (
                      <tr key={member.id}>
                        <td>
                          {/* <a
                            href={`/user-account/organization/view-user/${member.id}`}
                            style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                          >
                            {member.id}
                          </a> */}
                          <Text size='fs-14' color='neutral-700'>
                            {getSerialNumber(index, 'confirmed')}
                          </Text>
                        </td>
                        <td>
                          <Text
                            size='fs-14'
                            color='neutral-700'
                          >
                            {member.email}
                          </Text>
                        </td>
                        <td>
                          <Text
                            size='fs-14'
                            color='neutral-700'
                          >
                            {member.first_name}
                          </Text>
                        </td>
                        <td>
                          <Text
                            size='fs-14'
                            color='neutral-700'
                          >
                            {member.last_name}
                          </Text>
                        </td>
                        <td>
                          <Text
                            size='fs-14'
                            color='neutral-700'
                          >
                            {formatDate(member.created_at)}
                          </Text>
                        </td>
                        <td>
                          <Text
                            size='fs-14'
                            color='neutral-700'
                          >
                            {member.roles && member.roles.length > 0 
                              ? member.roles.map(role => role.name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())).join(', ')
                              : 'No roles'}
                          </Text>
                        </td>
                        <td>
                          <div className='actions'>
                            <Button
                              type='secondary'
                              size = 'small'
                              className='details-button'
                              onClick={() => router.push(`/user-account/organization/details-user/${member.id}`)}
                            >
                              Details
                            </Button>
                            <Button
                              type='secondary'
                              size = 'small'
                              className='delete-button'
                              onClick={() => handleDeleteClick(member)}
                            >
                              Delete
                            </Button>
                            {/* <Image
                              className='report-list--edit-icon'
                              src='/images/icons/edit.svg'
                              alt='edit-icon'
                              width={24}
                              height={24}
                              onClick={() => handleEditClick(member.id)}
                            /> */}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* Pending Invites Tab */}
            {activeTab === 'pending' && (
              <div className='report-list__tableWrapper'>
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Email</th>
                      <th>Created At</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingInvitees.map((member, index) => (
                      <tr key={member.id}>
                        <td>
                          <Text size='fs-14' color='neutral-700'>
                            {getSerialNumber(index, 'pending')}
                          </Text>
                        </td>
                        <td>
                          <Text
                            size='fs-14'
                            color='neutral-700'
                          >
                            {member.email}
                          </Text>
                        </td>
                        <td>
                          <Text
                            size='fs-14'
                            color='neutral-700'
                          >
                            {formatDate(member.created_at)}
                          </Text>
                        </td>
                        <td>
                          <div className='actions'>
                          <Button
                              type='secondary'
                              size = 'small'
                              className='delete-button'
                              onClick={() => handleResendInviteClick(member)}
                            >
                              Resend Invite
                          </Button>
                          <Button
                              type='secondary'
                              size = 'small'
                              className='delete-button'
                              onClick={() => handleRemoveInviteClick(member)}
                            >
                              Delete Invite
                          </Button>
                            {/* <Image
                              onClick={() => handleRemoveInviteClick(member)}
                              src='/images/icons/cross-red.svg'
                              alt='remove-invite-icon'
                              width={24}
                              height={24}
                            />
                            <Image
                              onClick={() => handleResendInviteClick(member)}
                              src='/images/icons/resend.svg'
                              alt='resend-invite-icon'
                              width={24}
                              height={24}
                            /> */}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {pendingInvitees.length === 0 && (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', padding: '20px 0' }}>
                          <Text size='fs-14' color='neutral-500'>
                            No pending invitations
                          </Text>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberManagement;