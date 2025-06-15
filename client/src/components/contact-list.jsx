import { useAppStore } from "@/store"
import { Avatar, AvatarImage } from "./ui/avatar"
import { HOST } from "@/utils/constants"
import { getColor } from "@/lib/utils"

const ContactList = ({ contacts, isChannel = false }) => {

    const { selectedChatData, setSelectedChatData, setSelectedChatType, selectedChatType, setSelectedChatMessages, } = useAppStore()

    const handleClick = (contact) => {
        if (isChannel) setSelectedChatType("channel")
        else setSelectedChatType("contact")
        setSelectedChatData(contact)
        if (selectedChatData && selectedChatData._id !== contact._id) {
            setSelectedChatMessages([])
        }
    }
    return (
        <div className="mt-5">
            {contacts.map((contact) => (                <div
                    key={contact._id} className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${selectedChatData && (selectedChatData._id === contact._id)
                        ? "bg-purple-500/20 text-purple-600 dark:text-purple-400 border-r-2 border-purple-500"
                        : "hover:bg-purple-500/10 hover:text-purple-600 dark:hover:text-purple-400"
                        }`}
                    onClick={() => handleClick(contact)}
                >
                    <div className="flex gap-5 items-center justify-start text-foreground">
                        {
                            !isChannel && <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                                {contact.image ? (
                                    <AvatarImage src={`${HOST}/${contact.image}`} alt="profile" className="object-cover w-full h-full bg-muted" />                                ) : (
                                    <div className={`${getColor(contact.color)} uppercase h-10 w-10 text-lg border-[1px] flex items-center justify-center rounded-full`}>
                                        {contact.firstName
                                            ? contact.firstName.split("").shift()
                                            : contact.email.split("").shift()}
                                    </div>
                                )}
                            </Avatar>
                        }                        {
                            isChannel && <div className={`h-10 w-10 flex items-center justify-center rounded-full ${selectedChatData && selectedChatData._id === contact._id ? "bg-purple-500/20 border border-purple-500 text-purple-600 dark:text-purple-400" : "bg-accent-foreground/20 text-foreground"}`}>#</div>
                        }
                        {isChannel ? <span>{contact.name}</span> : <span>{contact.firstName ? `${contact.firstName} ${contact.lastName}` : contact.email}</span>}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ContactList