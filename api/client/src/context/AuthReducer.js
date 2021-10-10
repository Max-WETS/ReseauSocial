const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        user: null,
        isFetching: true,
        error: false,
        connectedUsers: [],
      };
    case "LOGIN_SUCCESS":
      return {
        user: action.payload,
        isFetching: false,
        error: false,
        connectedUsers: [],
      };
    case "LOGIN_FAILURE":
      return {
        user: null,
        isFetching: false,
        error: true,
        connectedUsers: [],
      };
    case "LOGOUT":
      return {
        user: null,
        isFetching: false,
        error: false,
        connectedUsers: [],
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
        connectedUsers: [...action.payload],
      };
    case "USER_DISCONNECTED":
      return {
        ...state,
        connectedUsers: [...state.connectedUsers].filter(
          (u) => u.userID !== action.payload
        ),
      };
    case "USER_CONNECTED":
      return {
        ...state,
        connectedUsers: [...state.connectedUsers, action.payload],
      };
    default:
      return state;
  }
};

export default AuthReducer;
