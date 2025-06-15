export const createAuthSlice = (set, get) => (
    {
        userInfo: undefined,
        setUserInfo: (userInfo) => set({ userInfo }),
        isAuthLoading: false,
        setIsAuthLoading: (isAuthLoading) => set({ isAuthLoading }),
        isProfileLoading: false,
        setIsProfileLoading: (isProfileLoading) => set({ isProfileLoading }),
        logOut: () => set({ 
            userInfo: undefined,
            isAuthLoading: false,
            isProfileLoading: false 
        }),
    })