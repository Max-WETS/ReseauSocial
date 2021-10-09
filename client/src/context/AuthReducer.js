const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        user: null,
        isFetching: true,
        error: false,
      };
    case "LOGIN_SUCCESS":
      return {
        user: action.payload,
        isFetching: false,
        error: false,
      };
    case "LOGIN_FAILURE":
      return {
        user: null,
        isFetching: false,
        error: true,
      };
    case "LOGOUT":
      return {
        user: null,
        isFetching: false,
        error: false,
      };
    case "FRIENDS_UPDATE":
      return {
        ...state,
        user: {
          ...state.user,
          userFriends: action.payload,
        },
      };
    case "ADD_FRIEND":
      return {
        ...state,
        user: {
          ...state.user,
          userFriends: [...state.user.userFriends, action.payload],
        },
      };
    case "REMOVE_FRIEND":
      return {
        ...state,
        user: {
          ...state.user,
          userFriends: state.user.userFriends.filter(
            (friend) => friend.friendId !== action.payload
          ),
        },
      };
    case "ACCEPT_FRIEND":
      return {
        ...state,
        user: {
          ...state.user,
          userFriends: state.user.userFriends.map((friend) => {
            const rFriend = friend;
            if (rFriend.friendId === action.payload) {
              rFriend.status = "confirmé";
            }
            return rFriend;
          }),
        },
      };
    case "UPDATE_PROFILE_PIC":
      return {
        ...state,
        user: {
          ...state.user,
          profilePicture: action.payload,
        },
      };
    case "CONNECTED_USERS":
      return {
        ...state,
        user: {
          ...state.user,
          connectedUsers: action.payload,
        },
      };
    default:
      return state;
  }
};

export default AuthReducer;
