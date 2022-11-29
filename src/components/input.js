import { FormControl, FormErrorMessage, FormLabel, Input } from "@chakra-ui/react"



export const InputForm = ({ label, name, error = null, ...rest }) => {
    return (
        <FormControl my = "1" isInvalid = {!!error}>
          <FormLabel>{label}</FormLabel>
          <Input name = {name} id = {name} {...rest} />

          {!!error && <FormErrorMessage>{error}</FormErrorMessage>}
        </FormControl>
    )
}