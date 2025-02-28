import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { FaPlus } from "react-icons/fa"
import { useState } from "react"
import Lottie from 'react-lottie';
import { animationDefaultOptions } from "@/lib/utils"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import apiClient from "@/lib/api-client"
import { SEARCH_CONTACTS_ROUTES } from "@/utils/constants";
import { useAppStore } from "@/store";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HOST } from "@/utils/constants";
import { getColor } from "@/lib/utils";


const NewDm = () => {
    const [openNewContactModal, setOpenNewContactModal] = useState(false)
    const [searchedContacts, setSearchedContacts] = useState([]);
    const { setSelectedChatType, setSelectedChatData } = useAppStore()

    const searchContacts = async (searchTerm) => {
        try {
            if (searchTerm.length > 0) {
                const response = await apiClient.post(
                    SEARCH_CONTACTS_ROUTES,
                    { searchTerm },
                    { withCredentials: true }
                );
                if (response.status === 200 && response.data.contacts) {
                    setSearchedContacts(response.data.contacts);
                } else {
                    setSearchedContacts([]);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    const selectNewContact = (contact) => {
        setSelectedChatType("contact");
        setSelectedChatData(contact);
        setOpenNewContactModal(false);


        setSearchedContacts([]);
    };

    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <FaPlus className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 transition-all duration-300 cursor-pointer" onClick={() => setOpenNewContactModal(true)} />
                    </TooltipTrigger>
                    <TooltipContent className="border-none mb-2 p-3 text-white">Select New Contact</TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModal}>
                {/* <DialogTrigger>Open</DialogTrigger> */}
                <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex  flex-col">
                    <DialogHeader>
                        <DialogTitle>Plaese select Contact</DialogTitle>
                        {/* <DialogDescription>
                            This action cannot be undone. This will permanently delete your account
                            and remove your data from our servers.
                        </DialogDescription> */}
                    </DialogHeader>
                    <div>
                        <input
                            placeholder="Search Contacts"
                            className="rounded-lg p-6 border-none bg-[#2c2e3b] w-full h-12"
                            onChange={(e) => searchContacts(e.target.value)}
                        />
                    </div>
                    {
                        searchedContacts.length > 0 && (


                            <ScrollArea className="h-[250px]">
                                <div className="flex flex-col gap-5">
                                    {searchedContacts.map((contact) => (
                                        <div key={contact._id} className="flex gap-3 items-center cursor-pointer" onClick={() => { selectNewContact(contact) }}>
                                            <div className="w-12 h-12 relative">
                                                <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                                                    {contact.image ? (
                                                        <AvatarImage
                                                            src={`${HOST}/${contact.image}`}
                                                            className="object-fit w-full h-full bg-black"
                                                        />
                                                    ) : (
                                                        <div
                                                            className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(contact.color)}`}
                                                        >
                                                            {contact.firstName
                                                                ? contact.firstName.split(' ').shift()
                                                                : contact.email.split('').shift()}
                                                        </div>
                                                    )}
                                                </Avatar>
                                            </div>
                                            <div className="flex flex-col">
                                                <span>{contact.firstName && contact.lastName ? `${contact.firstName} ${contact.lastName}` : contact.email} </span>
                                                <span className="text-xs">{contact.email}</span>
                                            </div>
                                        </div>

                                    ))}
                                </div>
                            </ScrollArea>
                        )}
                    {searchedContacts.length <= 0 && (
                        <div className="flex-1 md:flex md:bg-[#1c1d25] flex-col mt-5 p-4 justify-center items-center transition-all duration-1000">
                            <Lottie
                                options={animationDefaultOptions}
                                height={100}
                                width={100}
                                isClickToPauseDisabled={true}
                            />
                            <div className="text-white flex flex-col gap-5 items-center mt-5 lg:text-2xl text-xl text-opacity-80 transition-all duration-300 text-center">
                                <h3 className="poppins-medium">
                                    Hi<span className="text-purple-500">!</span>Search new
                                    <span className="text-purple-500">Contact .</span>
                                </h3>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog >
        </>
    )
}

export default NewDm