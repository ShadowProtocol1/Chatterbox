import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { IoArrowBack } from "react-icons/io5"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { getColor, colors } from '@/lib/utils';
import { FaPlus, FaTrash } from "react-icons/fa"
import { ADD_PROFILE_IMAGE_ROUTE, REMOVE_PROFILE_IMAGE_ROUTE, UPDATE_PROFILE_ROUTE, HOST } from '@/utils/constants';
import { Button } from "@/components/ui/button"
import { LoadingScreen } from '@/components/loading-screen'

const Profile = () => {

    const navigate = useNavigate()
    const { userInfo, setUserInfo, isProfileLoading, setIsProfileLoading } = useAppStore()
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [image, setImage] = useState(null)
    const [hovered, setHovered] = useState(false)
    const [selectedColor, setSelectedColor] = useState(0)
    const fileInputRef = useRef(null)

    useEffect(() => {
        if (userInfo.profileSetup) {
            setFirstName(userInfo.firstName)
            setLastName(userInfo.lastName)
            setSelectedColor(userInfo.color)
        }
        if (userInfo.image) {
            setImage(`${HOST}/${userInfo.image}`)
        }
    }, [userInfo])


    const validateProfile = () => {
        if (!firstName) {
            toast.error("First name is required")
            return false
        }
        if (!lastName) {
            toast.error("Last name is required")
            return false
        }
        return true
    }

    const saveChanges = async () => {
        if (validateProfile()) {
            setIsProfileLoading(true)
            try {
                const response = await apiClient.post(UPDATE_PROFILE_ROUTE,
                    { firstName, lastName, color: selectedColor },
                    { withCredentials: true }
                )
                if (response.status === 200 && response.data) {
                    setUserInfo({ ...response.data })
                    toast.success("Profile updated successfully")
                    navigate("/Chat")
                }
            } catch (error) {
                console.error("Error updating profile:", error);
                toast.error("Failed to update profile. Please try again.");
            } finally {
                setIsProfileLoading(false)
            }
        }
    }

    const handleNavigate = () => {
        if (userInfo.profileSetup) {
            navigate("/chat")
        } else {
            toast.error("Please setup profile")
        }
    }

    const handleFileInputClick = () => {
        fileInputRef.current.click()
    }

    const handleImageChange = async (event) => {
        const file = event.target.files[0]
        if (file) {
            setIsProfileLoading(true)
            try {
                const formData = new FormData()
                formData.append("profile-image", file)
                const response = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE, formData, { withCredentials: true })
                if (response.status === 200 && response.data.image) {
                    setUserInfo({ ...userInfo, image: response.data.image })
                    toast.success("Image updated successfully")
                }
                const reader = new FileReader()
                reader.onload = () => {
                    setImage(reader.result)
                }
                reader.readAsDataURL(file)
            } catch (error) {
                console.error("Error uploading image:", error);
                toast.error("Failed to upload image. Please try again.");
            } finally {
                setIsProfileLoading(false)
            }
        }
    }

    const handleDeleteImage = async () => {
        setIsProfileLoading(true)
        try {
            const response = await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE, { withCredentials: true })
            if (response.status === 200) {
                setUserInfo({ ...userInfo, image: null })
                toast.success("Image removed successfully")
                setImage(null)
            }
        } catch (error) {
            console.error("Error removing image:", error);
            toast.error("Failed to remove image. Please try again.");
        } finally {
            setIsProfileLoading(false)
        }
    }

    if (isProfileLoading) {
        return <LoadingScreen message="Updating profile..." />
    } return (
        <div className='bg-background h-[100vh] flex items-center justify-center gap-10 flex-col'>
            <div className='flex flex-col gap-10 w-[80vw] md:w-max'>
                <div onClick={handleNavigate}>
                    <IoArrowBack className='text-foreground/90 text-4xl cursor-pointer lg:text-4xl hover:text-foreground transition-colors' onClick={() => navigate('/auth')} />
                </div>
                <div className='grid grid-cols-2'>
                    <div className='h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center' onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
                        <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden">
                            {image ? (
                                <AvatarImage src={image} alt="profile" className="object-cover w-full h-full bg-muted" />
                            ) : (
                                <div className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(selectedColor)}`}>
                                    {firstName
                                        ? firstName.split("").shift()
                                        : userInfo.email.split("").shift()}
                                </div>
                            )
                            }
                        </Avatar>                        {
                            hovered && (<div className='absolute inset-0 flex items-center justify-center bg-black/50 ring-fuchsia-50 cursor-pointer rounded-full'
                                onClick={image ? handleDeleteImage : handleFileInputClick}
                            >
                                {image ? (
                                    <FaTrash className='text-white text-3xl cursor-pointer' />
                                ) : (
                                    <FaPlus className='text-white text-3xl cursor-pointer' />
                                )}
                            </div>
                            )}
                        <input type='file' ref={fileInputRef} className='hidden' onChange={handleImageChange} name="profile-image" accept=".png, .jpg, .jpeg, .svg, .webp" />
                    </div>
                    <div className='flex flex-w-32 md:min-w-64 flex-col gap-5 text-foreground items-center justify-center'>
                        <div className='w-full'>
                            <Input placeholder='Email' type="email" value={userInfo.email} disabled className="rounded-lg p-6 bg-input border-border" />
                        </div>
                        <div className='w-full'>
                            <Input placeholder='First Name' type="text" onChange={e => setFirstName(e.target.value)} value={firstName} className="rounded-lg p-6 bg-input border-border" />
                        </div>
                        <div className='w-full'>
                            <Input placeholder='Last Name' type="text" onChange={e => setLastName(e.target.value)} value={lastName} className="rounded-lg p-6 bg-input border-border" />
                        </div>
                        <div className='w-full flex gap-5'>
                            {colors.map((color, index) => (
                                <div
                                    className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 ${selectedColor === index
                                            ? "outline outline-foreground/50"
                                            : ""
                                        }`}
                                    key={index}
                                    onClick={() => setSelectedColor(index)}
                                ></div>
                            ))}
                        </div>
                    </div>
                </div>                <div className="w-full">
                    <Button className="h-12 w-full bg-purple-700 hover:bg-purple-900 text-white transition-all duration-300"
                        onClick={saveChanges}>
                        Save Changes
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Profile