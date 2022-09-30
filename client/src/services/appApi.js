import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// define a service user a base URL

const appApi = createApi({
    reducerPath: "appApi",
    baseQuery: fetchBaseQuery({
        // baseUrl: "http://localhost:8000/",
        baseUrl: "https://cuarta.herokuapp.com/",
    }),

    endpoints: (builder) => ({
        // creating the user
        signupUser: builder.mutation({
            query: (user) => ({
                url: "/users",
                method: "POST",
                body: user,
            }),
        }),

        // login
        loginUser: builder.mutation({
            query: (user) => ({
                url: "/users/login",
                method: "POST",
                body: user,
            }),
        }),

        // logout

        logoutUser: builder.mutation({
            query: (payload) => ({
                url: "/logout",
                method: "DELETE",
                body: payload,
            }),
        }),

        // delete user message

        deleteUserMsg: builder.mutation({
            query: (payload) => ({
                url: "/data/delete_user_message",
                method: "POST",
                body: payload,
            }),
        }),

        // update username

        updateUserName: builder.mutation({
            query: (payload) => ({
                url: "/data/update_name",
                method: "POST",
                body: payload,
            }),
        }),

        // update user password

        updateUserPassword: builder.mutation({
            query: (payload) => ({
                url: "/data/update_password",
                method: "POST",
                body: payload,
            }),
        }),

        // update user profile image

        updateUserProfileImage: builder.mutation({
            query: (payload) => ({
                url: "/data/update_profile_picture",
                method: "POST",
                body: payload,
            }),
        }),

        // fetch all groups

        fetchAllGroups: builder.mutation({
            query: (payload) => ({
                url: "/data/fetchallgroups",
                method: "POST",
                body: payload,
            }),
        }),

        // create a new group

        createNewGroup: builder.mutation({
            query: (payload) => ({
                url: "/data/creategroup",
                method: "POST",
                body: payload,
            }),
        }),



    }),
});

export const { useSignupUserMutation, useLoginUserMutation, useLogoutUserMutation, useDeleteUserMsgMutation, useUpdateUserNameMutation, useUpdateUserPasswordMutation, useUpdateUserProfileImageMutation, useCreateNewGroupMutation, useFetchAllGroupsMutation } = appApi;

export default appApi;
