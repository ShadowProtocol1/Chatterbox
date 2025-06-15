import { useEffect } from "react";
import ProfileInfo from "./components/profile-info"
import { GET_DM_CONTACTS_ROUTES, GET_USER_CHANNELS_ROUTE } from "@/utils/constants";
import { useAppStore } from "@/store";
import { apiClient } from "@/lib/api-client";
import NewDm from "./components/new-dm";
import ContactList from "@/components/contact-list"
import CreateChannel from "./components/create-channel";
import { LoadingScreen } from "@/components/loading-screen";

const contactsContainer = () => {

    const {
        setDirectMessagesContacts,
        directMessagesContacts,
        channels,
        setChannels,
        selectedChatType,
        isContactsLoading,
        isChannelsLoading,
        setIsContactsLoading,
        setIsChannelsLoading
    } = useAppStore()

    useEffect(() => {
        const getContacts = async () => {
            setIsContactsLoading(true)
            try {
                const response = await apiClient.get(GET_DM_CONTACTS_ROUTES, {
                    withCredentials: true,
                })
                if (response.data.contacts) {
                    setDirectMessagesContacts(response.data.contacts)
                }
            } catch (error) {
                console.error("Error fetching contacts:", error)
            } finally {
                setIsContactsLoading(false)
            }
        }

        const getChannels = async () => {
            setIsChannelsLoading(true)
            try {
                const response = await apiClient.get(GET_USER_CHANNELS_ROUTE, { withCredentials: true })

                if (response.data.channels) {
                    setChannels(response.data.channels)
                }
            } catch (error) {
                console.error("Error fetching channels:", error)            } finally {
                setIsChannelsLoading(false)
            }
        }

        getContacts()
        getChannels()
    }, [setChannels, setDirectMessagesContacts, setIsContactsLoading, setIsChannelsLoading])

    return <div className={`relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-card border-r border-border w-full ${selectedChatType ? 'hidden md:block' : 'block'}`}>
        <div className="pt-3">
            <Logo />
        </div>
        <div className="my-5">
            <div className="flex items-center justify-between pr-10">
                <Title text="Direct Messages" />
                <NewDm />
            </div>            <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
                {isContactsLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <LoadingScreen
                            message="Loading contacts..."
                            overlay={false}
                            className="bg-transparent"
                            loaderSize="md"
                        />
                    </div>
                ) : (
                    <ContactList contacts={directMessagesContacts} />
                )}
            </div>
        </div>
        <div className="my-5">
            <div className="flex items-center justify-between pr-10">
                <Title text="Channels" />
                <CreateChannel />
            </div>            <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
                {isChannelsLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <LoadingScreen
                            message="Loading channels..."
                            overlay={false}
                            className="bg-transparent"
                            loaderSize="md"
                        />
                    </div>
                ) : (
                    <ContactList contacts={channels} isChannel={true} />
                )}
            </div>
        </div>
        <ProfileInfo />
    </div>
}

export default contactsContainer

const Logo = () => {
    return (
        <div className="flex p-5  justify-start items-center gap-2">
            <svg
                id="logo-38"
                width="60"
                height="24"
                viewBox="0 0 78 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {" "}
                <path
                    d="M55.5 0H77.5L58.5 32H36.5L55.5 0Z"
                    className="ccustom"
                    fill="#8338ec"
                ></path>{" "}
                <path
                    d="M35.5 0H51.5L32.5 32H16.5L35.5 0Z"
                    className="ccompli1"
                    fill="#975aed"
                ></path>{" "}
                <path
                    d="M19.5 0H31.5L12.5 32H0.5L19.5 0Z"
                    className="ccompli2"
                    fill="#a16ee8"
                ></path>{" "}
            </svg>            <span className="text-2xl font-semibold text-foreground">Chatterbox</span>
        </div>
    );
};

const Title = ({ text }) => {
    return (
        <h6 className="uppercase tracking-widest text-muted-foreground pl-10 font-light text-opacity-90 text-sm">{text}</h6>
    )
}