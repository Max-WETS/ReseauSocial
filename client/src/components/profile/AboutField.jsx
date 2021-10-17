import React, { useContext } from "react";
import { Text, HStack, Button, Input } from "@chakra-ui/react";
import { MdDescription, MdEmail } from "react-icons/md";
import { FaBirthdayCake, FaCity } from "react-icons/fa";
import { AiFillEdit } from "react-icons/ai";
import { AuthContext } from "../../context/AuthContext";

function AboutField({
  userData,
  updateForm,
  setUpdateForm,
  field,
  value,
  setBuffer,
  handleUpdate,
  isUserProfile,
}) {
  const { user } = useContext(AuthContext);
  return (
    <>
      {!updateForm && (
        <HStack w="100%" justifyContent="space-between" pr="10px">
          <Text
            w="100%"
            h="25px"
            textAlign="left"
            ml="10px"
            display="flex"
            flexDirection="row"
            alignItems="center"
          >
            {(() => {
              switch (field) {
                case "bio":
                  return <MdDescription color="blue" pr="4px" />;
                case "age":
                  return <FaBirthdayCake color="blue" pr="4px" />;
                case "city":
                  return <FaCity color="blue" pr="4px" />;
                case "email":
                  return <MdEmail color="blue" pr="4px" />;
                default:
                  return null;
              }
            })()}
            : {" " + value ? value : null}
          </Text>
          {isUserProfile || user.isAdmin ? (
            <AiFillEdit
              cursor="pointer"
              color="blue"
              onClick={() => setUpdateForm(true)}
            />
          ) : null}
        </HStack>
      )}
      {updateForm && (
        <HStack w="100%" justifyContent="space-between">
          <HStack w="100%">
            <Text maxW="30%" textAlign="left" fontWeight="600">
              {field[0].toUpperCase() + field.substring(1)}:
            </Text>
            <Input
              type="text"
              defaultValue={value}
              onChange={(e) => setBuffer(e.target.value)}
              w="100%"
              h="92%"
            />
          </HStack>
          <HStack>
            <Button
              w="60px"
              h="20px"
              value={field === "bio" ? "desc" : field}
              onClick={(e) => handleUpdate(e)}
            >
              Save
            </Button>
            <Button w="60px" h="20px" onClick={() => setUpdateForm(false)}>
              Cancel
            </Button>
          </HStack>
        </HStack>
      )}
    </>
  );
}

export default AboutField;
