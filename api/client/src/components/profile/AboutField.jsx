import React from "react";
import { Text, Button } from "@chakra-ui/react";
import { AiFillEdit } from "react-icons/ai";

function AboutField({
  user,
  updateForm,
  setUpdateForm,
  field,
  value,
  setBuffer,
  handleUpdate,
}) {
  return (
    <>
      {!updateForm && (
        <>
          <Text w="100%" textAlign="left">
            {field[0].toUpperCase() + field.substring(1)}: {value}
          </Text>
          <AiFillEdit
            cursor="pointer"
            color="blue"
            onClick={() => setUpdateForm(true)}
          />
        </>
      )}
      {updateForm && (
        <>
          <input
            type="text"
            defaultValue={value}
            onChange={(e) => setBuffer(e.target.value)}
          />
          <Button
            value={field === "bio" ? "desc" : field}
            onClick={(e) => handleUpdate(e)}
          >
            Save
          </Button>
          <Button onClick={() => setUpdateForm(false)}>Cancel</Button>
        </>
      )}
    </>
  );
}

export default AboutField;
