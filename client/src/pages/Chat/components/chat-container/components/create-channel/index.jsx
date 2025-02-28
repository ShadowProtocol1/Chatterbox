import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { FaPlus } from "react-icons/fa"
import { useEffect, useState } from "react"
import Lottie from '@/assets/lottie';
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
import { GET_ALL_CONTACTS_ROUTES, SEARCH_CONTACTS_ROUTES ,CREATE_CHANNEL_ROUTE  ,HOST} from "@/utils/constants";
import { useAppStore } from "@/store";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getColor } from "@/lib/utils";
import MultipleSelector from "@/components/ui/multiselect";
import {Input } from "@/components/ui/input"
import {Button} from "@/components/ui/button"


const CreateChannel = () => {
    const [newChannelModal, setNewChannelModal] = useState(false)
    const [searchedContacts, setSearchedContacts] = useState([]);
    const { setSelectedChatType, setSelectedChatData, addChannel } = useAppStore()
    const [allContacts, setAllContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState([]);
    const [channelName, setChannelName] = useState("");

    useEffect(() => {
        const getData = async () => {
            const response = await apiClient.get(GET_ALL_CONTACTS_ROUTES, { withCredentials: true })
            setAllContacts(response.data.contacts)
        }
        getData()
    }, [])

    const createChannel = async () => {
        try {
            if (channelName.length > 0 && selectedContact.length > 0) {
                const response = await apiClient.post(CREATE_CHANNEL_ROUTE, { name: channelName, members: selectedContact.map((contact) => contact.value) }, { withCredentials: true })
                if (response.status === 201) {
                    setChannelName("")
                    setSelectedContact([])
                    setNewChannelModal(false)
                    addChannel(response.data.channel)
                }
                addChannel(response.data.channel)
                setSelectedChatType("channel")
                setSelectedChatData(response.data.channel)
                setNewChannelModal(false)
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <FaPlus className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 transition-all duration-300 cursor-pointer" onClick={() => setNewChannelModal(true)} />
                    </TooltipTrigger>
                    <TooltipContent className="border-none mb-2 p-3 text-white">Create new channel</TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <Dialog>
                {/* <DialogTrigger>Open</DialogTrigger> */}
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Please fill up the details for new channel.</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete your account
                            and remove your data from our servers.
                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <Input
                            placeholder="Channel Name"
                            className="rounded-lg p-6 border-none bg-[#2c2e3b]"
                            onChange={(e) => setChannelName(e.target.value)}
                            value={channelName}
                        />
                    </div>
                    <div>
                        <MultipleSelector
                            className="rounded bg-[#2c2e3b] border-none py-2 text-white"
                            defaultOptions={allContacts}
                            placeholder="Select members"
                            value={selectedContact}
                            onChange={setSelectedContact}
                            emptyIndicator={
                                <p className="text-center text-lg leading-10 text-gray-600">
                                    NO results found.
                                </p>
                            }
                        />
                    </div>
                    <div>
                        <Button className="w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300" onClick={createChannel}>Create channel</Button>
                    </div>


                </DialogContent>
            </Dialog >
        </>
    )
}

export default CreateChannel