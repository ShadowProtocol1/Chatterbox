import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useEffect, useState } from "react"
import { FaPlus } from "react-icons/fa"
import { Input } from "@/components/ui/input"
import { CREATE_CHANNEL_ROUTE, GET_ALL_CONTACTS_ROUTES } from "@/utils/constants"
import { apiClient } from "@/lib/api-client"
import { useAppStore } from "@/store"
import { Button } from "@/components/ui/button"
import MultipleSelector from "@/components/ui/multipleselect"
import Lottie from "react-lottie"
import { animationDefaultOptions } from "@/lib/utils"
import { LoadingScreen } from "@/components/loading-screen"

const CreateChannel = () => {
    const { setSelectedChatType, setSelectedChatData, addChannels } = useAppStore()
    const [newChannelModal, setNewChannelModal] = useState(false)
    const [allContacts, setAllContacts] = useState([])
    const [selectedContacts, setSelectedContacts] = useState([])
    const [channelName, setChannelName] = useState("")
    const [isCreatingChannel, setIsCreatingChannel] = useState(false)
    const [isLoadingContacts, setIsLoadingContacts] = useState(false)

    useEffect(() => {
        const getData = async () => {
            setIsLoadingContacts(true)
            try {
                const response = await apiClient.get(GET_ALL_CONTACTS_ROUTES, { withCredentials: true })
                setAllContacts(response.data.contacts)
            } catch (error) {
                console.error("Error fetching contacts:", error)
            } finally {
                setIsLoadingContacts(false)
            }
        }
        getData()
    }, [])

    const createChannel = async () => {
        setIsCreatingChannel(true)
        try {
            if (channelName.length > 0 && selectedContacts.length > 0) {
                const response = await apiClient.post(
                    CREATE_CHANNEL_ROUTE,
                    {
                        name: channelName,
                        members: selectedContacts.map((contact) => contact.value),
                    },
                    { withCredentials: true }
                )

                if (response.status === 201) {
                    setChannelName("")
                    setSelectedContacts([])
                    setNewChannelModal(false)
                    addChannels(response.data.channel)
                }
            }
        } catch (error) {
            console.log("Channel creation error:", error)
        } finally {
            setIsCreatingChannel(false)
        }
    }

    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <FaPlus className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300" onClick={() => setNewChannelModal(true)} />
                    </TooltipTrigger>
                    <TooltipContent className="bg-popover border-border mb-2 p-3 text-popover-foreground">Create Channel</TooltipContent>
                </Tooltip>
            </TooltipProvider>            <Dialog open={newChannelModal} onOpenChange={setNewChannelModal}>
                <DialogContent className="bg-popover border-border text-popover-foreground w-[400px] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Please fill up the details for new channel.</DialogTitle>
                    </DialogHeader>
                    <div className="flex justify-center">
                        <Lottie options={animationDefaultOptions} height={120} width={120} />
                    </div>
                    <div>
                        <Input placeholder="Channel Name" className="rounded-lg p-6 bg-input border-border" onChange={e => setChannelName(e.target.value)} value={channelName} />
                    </div>
                    <div className="flex-1">
                        <MultipleSelector className="rounded-lg bg-input border-border py-2 text-popover-foreground" defaultOptions={allContacts} placeholder="Search Contacts" value={selectedContacts} onChange={setSelectedContacts} emptyIndicator={<p className="text-center text-lg leading-10 text-muted-foreground">No results found</p>} />
                    </div>                    <div>
                        <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white transition-all duration-300" onClick={createChannel}>Create Channel</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default CreateChannel