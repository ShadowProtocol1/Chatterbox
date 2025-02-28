import React from 'react';
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/store";

import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { FiEdit2 } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import { IoPowerSharp } from 'react-icons/io5';
import apiClient from '@/lib/api-client';
import { LOGOUT_ROUTE } from '@/utils/constants';
import { HOST } from '@/utils/constants';
import { getColor } from '@/lib/utils';

const ProfileInfo = () => {
    const { userInfo, setUserInfo } = useAppStore();
    const navigate = useNavigate()
    const logout = async () => {
        try {
            const response = await apiClient.post(LOGOUT_ROUTE, {}, {
                withCredentials: true
            })

            if (response.status === 200) {
                navigate("/auth")
                setUserInfo(null)
            }
        }
        catch (error) {
            console.error("Logout failed", error);
        }
    }

    return (
        <div className="absolute bottom-0 h-16 flex items-center justify-between px-10 w-full bg-[#2a2b33]">
            <div className="flex gap-3 items-center justify-center">
                <div className='w-12 h-12 relative'>
                    <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                        {userInfo && userInfo.image ? (
                            <AvatarImage src={`${HOST}/${userInfo.image}`} alt="Profile" className="object-cover w-full h-full bg-black" />
                        ) : (
                            <div className={`uppercase h-12 w-12 text-lg border-[1px] rounded-full flex items-center justify-center bg-gray-500 text-white" ${userInfo ? getColor(userInfo.color) : ''}`}>
                                {
                                    userInfo.firstName
                                        ? userInfo.firstName.split("").shift()
                                        : null}
                            </div>
                        )}
                    </Avatar>
                </div>
                <div>
                    {userInfo.firstName && userInfo.lastName
                        ? `${userInfo.firstName} ${userInfo.lastName}`
                        : null}
                </div>
            </div>
            <div className="flex gap-5">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <FiEdit2 className="text-purple-500 text-xl font-medium" onClick={() => { navigate("/profile") }} />
                        </TooltipTrigger>
                        <TooltipContent className="bg-[#1c1d1e] text-white border-none">
                            Edit Profile
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <IoPowerSharp className="text-purple-500 text-xl font-medium" onClick={() => { logout }} />
                        </TooltipTrigger>
                        <TooltipContent className="bg-[#1c1d1e] text-white border-none">
                            Logout
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    );
};

export default ProfileInfo;