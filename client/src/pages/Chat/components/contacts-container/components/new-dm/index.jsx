import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { useState } from "react"
import { FaPlus } from "react-icons/fa"
import { Input } from "@/components/ui/input"
import { HOST, SEARCH_CONTACTS_ROUTES } from "@/utils/constants"
import { apiClient } from "@/lib/api-client"
import { useAppStore } from "@/store"
import Lottie from "react-lottie"
import { animationDefaultOptions, getColor } from "@/lib/utils"
import { LoadingScreen } from "@/components/loading-screen"

const NewDm = () => {
    const { setSelectedChatType, setSelectedChatData } = useAppStore()
    const [openNewContactModal, setOpenNewContactModal] = useState(false)
    const [searchedContacts, setSearchedContacts] = useState([])
    const [isSearching, setIsSearching] = useState(false)

    const searchContacts = async (searchTerm) => {
        setIsSearching(true)
        try {
            if (searchTerm.length > 0) {
                const response = await apiClient.post(SEARCH_CONTACTS_ROUTES, { searchTerm }, { withCredentials: true })

                if (response.status === 200 && response.data.contacts) {
                    setSearchedContacts(response.data.contacts)
                } else {
                    setSearchedContacts([])
                }
            } else {
                setSearchedContacts([])
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsSearching(false)
        }
    }

    const selectNewContact = (contact) => {
        setOpenNewContactModal(false)
        setSelectedChatType("contact")
        setSelectedChatData(contact)
        setSearchedContacts([])
    }
    return (<>
        <TooltipProvider>
            <Tooltip>                <TooltipTrigger>
                    <FaPlus className="text-muted-foreground font-light text-opacity-90 text-start hover:text-foreground cursor-pointer transition-all duration-300" onClick={() => setOpenNewContactModal(true)} />
                </TooltipTrigger>
                <TooltipContent className="bg-popover border-border mb-2 p-3 text-popover-foreground">Select New Contact</TooltipContent>
            </Tooltip>
        </TooltipProvider>        <Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModal}>
            <DialogContent className="bg-popover border-border text-popover-foreground w-[350px] h-[350px] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Please select a contact</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <div>
                    <Input placeholder="Search Contacts" className="rounded-lg p-6 bg-input border-border" onChange={e => searchContacts(e.target.value)} />
                </div>
                {searchedContacts.length > 0 && (
                    <ScrollArea className="h-[250px]">
                        <div className="flex flex-col gap-5">
                            {
                                searchedContacts.map((contact) =>
                                    <div key={contact._id} className="flex gap-3 items-center cursor-pointer" onClick={() => selectNewContact(contact)}>
                                        <div className="h-12 w-12 relative">
                                            <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                                                {contact.image ? (
                                                    <AvatarImage src={`${HOST}/${contact.image}`} alt="profile" className="object-cover w-full h-full bg-black" />
                                                ) : (
                                                    <div className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(contact.color)}`}>
                                                        {contact.firstName
                                                            ? contact.firstName.split("").shift()
                                                            : contact.email.split("").shift()}
                                                    </div>
                                                )}
                                            </Avatar>                                        </div>                                        <div className="flex flex-col">
                                            <span className="text-popover-foreground">
                                                {contact.firstName && contact.lastName
                                                    ? `${contact.firstName} ${contact.lastName}`
                                                    : contact.email}
                                            </span>
                                            <span className="text-xs text-muted-foreground">{contact.email}</span>
                                        </div>
                                    </div>
                                )}
                        </div>
                    </ScrollArea>
                )}
                {searchedContacts.length <= 0 && (
                    <div className="flex-1 md:flex mt-5 md:mt-0 flex-col justify-center items-center duration-1000 transition-all">
                        <Lottie
                            isClickToPauseDisabled={true}
                            height={100}
                            width={100}
                            options={animationDefaultOptions} />                        <div className="text-opacity-80 text-popover-foreground flex flex-col gap-5 items-center mt-10 lg:text-2xl text-xl transition-all duration-300 text-center">
                            <h3 className="poppins-medium">
                                Hi <span className="text-purple-500">!</span> Search new{" "}
                                <span className="text-purple-500">Contact.</span>
                            </h3>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    </>
    )
}

export default NewDm