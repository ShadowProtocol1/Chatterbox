import React, { useEffect } from 'react';
import { useAppStore } from '@/store';
import ProfileInfo from '../chat-container/components/profile-info';
import NewDM from '../chat-container/components/New-DM';
import apiClient from '@/lib/api-client';
import { GET_DM_CONTACTS_ROUTES, GET_USER_CHANNELS_ROUTE } from '@/utils/constants';
import CreateChannel from '../chat-container/components/create-channel';
import ContactsList from '@/components/contacts-list';

const ContactContainer = () => {
    const { setDirectMessagesContacts, directMessagesContacts, channels, setChannels } = useAppStore();

    useEffect(() => {
        const getContacts = async () => {
            const response = await apiClient.get(GET_DM_CONTACTS_ROUTES, {
                withCredentials: 'true',
            });
            if (response.data.contacts) {
                setDirectMessagesContacts(response.data.contacts);
            }
        };
        
        const getChannels = async () => {
            const response = await apiClient.get(GET_USER_CHANNELS_ROUTE, {
                withCredentials: 'true',
            });
            if (response.data.channels) {
                setChannels(response.data.channels);
            }
        };
        getContacts();
        getChannels();
    }, [setChannels, setDirectMessagesContacts]);
    return (
        <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full">
            {/* <h2>Contact List</h2> */}
            {/* Add your contact list components or elements here */}
            <div className='pt-3'>
                <Logo />
            </div>
            <div className="flex items-center justify-between pr-10">
                <Title text="Direct Messages" />
                <NewDM />
            </div>
            <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
                <ContactsList contacts={directMessagesContacts} />
            </div>
            <div className="max-h-[38vh] overflow-y-auto scroll">
                <div className='my-5'>
                    <div className="flex items-center justify-between pr-10">
                        <Title text="Channels" />
                        <CreateChannel />
                    </div>
                    <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
                        <ContactsList contacts={channels} isChannel={true}/>
                    </div>
                </div>
                <ProfileInfo />
            </div>
        </div>
    );
};

export default ContactContainer;


const Logo = () => {
    return (
        <div className="flex p-5 justify-start items-center gap-2">
            <svg
                width="64"
                height="64"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-16 h-16"
            >
                <rect width="64" height="64" rx="8" fill="#4A90E2" />
                <path
                    d="M32 16C23.1634 16 16 23.1634 16 32C16 40.8366 23.1634 48 32 48C40.8366 48 48 40.8366 48 32C48 23.1634 40.8366 16 32 16ZM32 44C25.3726 44 20 38.6274 20 32C20 25.3726 25.3726 20 32 20C38.6274 20 44 25.3726 44 32C44 38.6274 38.6274 44 32 44Z"
                    fill="white"
                />
                <path
                    d="M32 24C28.6863 24 26 26.6863 26 30C26 31.6569 26.8431 33.1569 28.3431 34.1569L26 40L32 36L37.6569 39.6569L35.3137 34.1569C36.8137 33.1569 38 31.6569 38 30C38 26.6863 35.3137 24 32 24ZM32 34C30.3431 34 29 32.6569 29 31C29 29.3431 30.3431 28 32 28C33.6569 28 35 29.3431 35 31C35 32.6569 33.6569 34 32 34Z"
                    fill="white"
                />
            </svg>
            <span className='text-3xl font-semibold'>ChatterBox</span>
        </div>
    );
};

const Title = ({ text }) => {
    return (
        <h6 className="uppercase tracking-widest text-neutral-400 pl-10 font-light text-opacity-90 text-sm">
            {text}
        </h6>
    );
};