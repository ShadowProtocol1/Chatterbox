import { useAppStore } from "@/store";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { colors } from "@/lib/utils";
import { toast } from "sonner";
import apiClient from "@/lib/api-client";
import {
  REMOVE_PROFILE_IMAGE_ROUTE,
  HOST,
  UPDATE_PROFILE_ROUTE,
  ADD_PROFILE_IMAGE_ROUTE,
} from "@/utils/constants";

function Profile() {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (userInfo.profileSetup) {
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setSelectedColor(colors.indexOf(userInfo.color));
    }
    if (userInfo.image) {
      setImage(`${HOST}/${userInfo.image}`);
    }
  }, [userInfo]);

  const validateProfile = () => {
    if (!firstName) {
      toast.error("First name is required");
      return false;
    }
    if (!lastName) {
      toast.error("Last name is required");
      return false;
    }
    return true;
  };

  const saveChanges = async () => {
    if (validateProfile()) {
      try {
        const response = await apiClient.post(
          UPDATE_PROFILE_ROUTE,
          { firstName, lastName, color: selectedColor },
          { withCredentials: true }
        );
        if (response.status === 200 && response.data) {
          setUserInfo({ ...response.data });
          toast.success("Profile updated successfully.");
          navigate("/chat");
        }
      } catch (error) {
        toast.error("Failed to update profile.");
      }
    }
  };

  const handleNavigate = () => {
    if (userInfo && userInfo.profileSetup) {
      navigate("/chat");
    } else {
      toast.error("Please setup profile.");
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profile-image", file);

      try {
        const response = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        });

        if (response.status === 200 && response.data) {
          setImage({ ...userInfo, image: response.data.image });
          toast.success("Image uploaded successfully.");
        } else {
          toast.error("Failed to upload image.");
        }
        const reader = new FileReader();
        reader.onload = () => {
          setImage(reader.result);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        toast.error("Failed to upload image.");
      }
    }
  };

  const handleDeleteImage = async () => {
    try {
      const response = await apiClient.delete(
        REMOVE_PROFILE_IMAGE_ROUTE,
        // {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        setUserInfo({
          ...userInfo,
          image: null,
        });
        toast.success("Image removed successfully.");
        setImage(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <div onClick={handleNavigate}>
          <IoArrowBack className="text-4xl lg:text-6xl text-white/90 cursor-pointer" />
        </div>
        <div className="grid grid-cols-2">
          <div
            className="h-full w-32 md:h-48 relative flex items-center justify-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden">
              {image ? (
                <AvatarImage
                  src={image}
                  alt="Profile"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div
                  className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl border-[1px] rounded-full flex items-center justify-center bg-gray-500 text-white
                  ${getColor = (selectedColor)}`}
                >
                  {firstName
                    ? firstName.split("").shift()
                    : userInfo.email.split("").shift()}
                </div>
              )
              }
            </Avatar>
            {hovered && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/50 ring-fuchsia-50 rounded—full"
              onClick={image ? handleDeleteImage : handleFileInputClick}
              >
                {image ? (
                  <FaTrash className="text-white text-3xl cursor-pointer" />
                ) : (
                  <FaPlus className="text-white text-3xl cursor-pointer" />
                )}
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
              name="profile-image"
              accept=".jpg, .jpeg, .png, .svg, .webp"
            />
          </div>
          <div className="min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center">
            <div className="w-full">
              <Input
                disabled
                type="email"
                placeholder="Email"
                value={userInfo ? userInfo.email : ""}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none m-2"
              />
            </div>
            <div className="w-full">
              <Input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none m-2"
              />
            </div>
            <div className="w-full">
              <Input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none m-2"
              />
            </div>
            <div className="w-full flex gap-5">
              {colors.map((color, index) => (
                <div
                  key={index}
                  className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 ml-4 ${selectedColor === index
                    ? "outline outline-white/50 outline-1"
                    : ""
                    }`}
                  onClick={() => setSelectedColor(index)}
                ></div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-32 md:w-64">
          <Button
            className="w-full bg-fuchsia-500 rounded-lg p-6 text-white"
            onClick={() => {
              saveChanges()
              navigate("/dashboard");
            }
            }
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
