import { RiCloseFill } from "react-icons/ri"
import { useAppStore } from "@/store"
import { HOST } from "@/utils/constants"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { getColor } from "@/lib/utils"

const ChatHeader = () => {
    const { closeChat, selectedChatData, selectedChatType } = useAppStore()
    
    return <div className="h-[10vh] border-b border-border flex items-center justify-between px-20 bg-card">
        <div className="flex gap-5 items-center w-full justify-between">            <div className="flex gap-3 items-center justify-center">
            <div className="h-10 w-10 relative">
                {
                    selectedChatType === "contact" ? <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                        {selectedChatData.image ? (
                            <AvatarImage src={`${HOST}/${selectedChatData.image}`} alt="profile" className="object-cover w-full h-full bg-muted" />
                        ) : (
                            <div className={`uppercase h-10 w-10 text-base border-[1px] flex items-center justify-center rounded-full ${getColor(selectedChatData.color)}`}>
                                {selectedChatData.firstName
                                    ? selectedChatData.firstName.split("").shift()
                                    : selectedChatData.email.split("").shift()}
                            </div>
                        )}                        </Avatar> : <div className="bg-muted h-10 w-10 flex items-center justify-center rounded-full text-base text-foreground">
                        #
                    </div>
                }
            </div>
            <div className="text-foreground">
                {selectedChatType === "channel" && selectedChatData.name}
                {selectedChatType === "contact" &&
                    selectedChatData.firstName ? `${selectedChatData.firstName} ${selectedChatData.lastName}` : selectedChatData.email}
            </div>
        </div>
        </div>
        <div className="flex items-center justify-center gap-5">
            <button className="text-muted-foreground focus:border-none focus:outline-none hover:text-foreground duration-300 transition-all" onClick={closeChat}>
                <RiCloseFill className="text-3xl" />
            </button>
        </div>
    </div>
}

export default ChatHeader