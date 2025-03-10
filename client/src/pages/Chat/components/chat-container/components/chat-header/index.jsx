import { useAppStore } from '@/store';
import React from 'react';
import { RiCloseFill } from 'react-icons/ri';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { getColor } from '@/lib/utils';
import { HOST } from '@/utils/constants';

const ChatHeader = () => {
    const { closeChat, selectedChatData, selectedChatType } = useAppStore()
    return (
        <div className="border-b-2 flex items-center justify-between h-[10vh] border-[#2f303b] px-20">
            <div className='flex items-center gap-5 w-full justify-between'>
                <div className="flex items-center gap-3 justify-center bg-black">
                    <div className="w-12 h-12 relative">
                        {/* {
                            selectedChatType === "contacts" ? ( */}
                                <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                                    {selectedChatData.image ? (
                                        <AvatarImage
                                            src={`${HOST}/${selectedChatData.image}`}
                                            className="object-cover w-full h-full bg-black"
                                            alt="profile"
                                        />
                                    ) : (
                                        <div
                                            className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(selectedChatData.color)}`}
                                        >
                                            {selectedChatData.firstName
                                                ? selectedChatData.firstName.split(' ').shift()
                                                : selectedChatData.email.split('').shift()}
                                        </div>
                                    )}
                                 </Avatar>{/*) : (
                                <div className='bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full'>
                                    #</div> */}
                            {/* )
                        } */}


                    </div>
                    <div>
                        {
                            selectedChatType === "contact" && selectedChatData.firstName ?
                                `${selectedChatData.firstName} ${selectedChatData.lastName}`
                                : selectedChatData.email

                        }
                    </div>
                </div>
                <div className='flex items-center justify-center gap-5'>
                    <button className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all" onClick={closeChat}>
                        <RiCloseFill className="text-3xl" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatHeader;